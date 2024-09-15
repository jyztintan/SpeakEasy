from django.http import JsonResponse, HttpResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializer import (
    ScenarioSerializer,
    UserSerializer,
    ConversationSerializer,
    LLMResponseSerializer,
)
from .models import User
from .process_prompt import openai_call
from db_connection import users_collection, scenarios_collection
from pymongo.errors import DuplicateKeyError, OperationFailure

# Create your views here.
# Views are request handlers


@api_view(["GET"])
def test(request):
    return HttpResponse("the api/v1/test endpoint is hit!")


@api_view(["POST"])
def create_user(request):
    data = request.data.copy()
    # add fixed scenario ids
    data["scenarios"] = [1, 2, 3]
    serializer = UserSerializer(data=data)
    if serializer.is_valid():
        # insert new user into user collection
        users_collection.insert_one(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def get_scenarios(request, user_id):
    try:
        user = users_collection.find_one({"user_id": user_id})
        if not user:
            return Response(
                {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )

        # Remove _id as its of type ObjectId and is not JSON serializable
        del user["_id"]

        # Query scenarios_collection to get scenarios where 'scenario_id' is in user['scenarios']
        scenario_ids = user.get("scenarios", [])
        if not scenario_ids or not isinstance(scenario_ids, list):
            return Response(
                {"error": "No scenarios found for this user"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        scenarios_arr = list(
            scenarios_collection.find({"scenario_id": {"$in": scenario_ids}})
        )

        for scenario in scenarios_arr:
            del scenario["_id"]

        return JsonResponse({"user": user, "scenarios": scenarios_arr})
    except Exception as e:
        print(e)
        return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(["POST", "DELETE"])
def create_scenario(request):
    # request body
    # {
    # "user_id" : "newuserbryan",
    # "scenario_id" : 891,
    # "context" : "some context"
    # }
    user_id = request.data.get("user_id", None)
    new_scenario_id = request.data.get("scenario_id", None)

    if not user_id:
        return Response(
            {"error": "user_id is required"}, status=status.HTTP_400_BAD_REQUEST
        )
    if not new_scenario_id:
        return Response(
            {"error": "scenario_id is required"}, status=status.HTTP_400_BAD_REQUEST
        )

    if request.method == "DELETE":
        return delete_scenario(user_id, new_scenario_id)

    # method == POST
    existing_scenario = scenarios_collection.find_one({"scenario_id": new_scenario_id})
    if existing_scenario:
        raise DuplicateKeyError(
            f"Scenario with ID {new_scenario_id} already exists in the database."
        )

    scenario_data = {
        key: value for key, value in request.data.items() if key != "user_id"
    }
    serializer = ScenarioSerializer(data=scenario_data)
    if serializer.is_valid():
        try:
            # update user's scenarios_id arr
            users_collection.update_one(
                {"user_id": user_id},
                {
                    "$addToSet": {"scenarios_id": new_scenario_id}
                },  # Update: add new_scenario_id to the scenarios_id array
            )
            # add scenario to collections
            scenarios_collection.insert_one(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except OperationFailure as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def delete_scenario(user_id, scenario_id):
    # request body
    # {
    # "user_id" : "newuserbryan",
    # "scenario_id" : 891
    # }
    # Check if the scenario exists in the collection
    existing_scenario = scenarios_collection.find_one({"scenario_id": scenario_id})
    if not existing_scenario:
        return Response(
            {"error": f"Scenario with ID {scenario_id} does not exist."},
            status=status.HTTP_404_NOT_FOUND,
        )

    try:
        # Remove the scenario from the user's scenarios_id array
        users_collection.update_one(
            {"user_id": user_id},
            {"$pull": {"scenarios_id": scenario_id}},  # Remove scenario_id from array
        )

        # Delete the scenario from the scenarios_collection
        scenarios_collection.delete_one({"scenario_id": scenario_id})

        return Response(
            {"message": f"Scenario {scenario_id} deleted successfully."},
            status=status.HTTP_200_OK,
        )

    except OperationFailure as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
def create_conversation_response(request):
    # request body
    # {
    # "user_id" : "test",
    # "scenario_id" : 1,
    # "user_text" : "ni hao"
    # }
    serializer = ConversationSerializer(data=request.data)
    if serializer.is_valid():
        # TODO for justin, call chatGPT api here
        mock_response = {
            "reply": "gpt's reply",
            "feedback": "you could have done this better!",
        }
        return Response(LLMResponseSerializer(mock_response).data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def generate_openai_response(request):
    # You can test with http://127.0.0.1:8000/test-openai/?original=your_mother_is_nice
    original = request.GET.get("original")
    translated = openai_call(original)
    return JsonResponse({"translation": translated})
