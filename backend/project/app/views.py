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
from .process_prompt import openai_call
from db_connection import users_collection, scenarios_collection
from .view_helpers.scenario_helpers import create_scenario, delete_scenario
from .view_helpers.conversation_helpers import (
    response_to_conversation,
    response_to_get_help,
)

# Create your views here.
# Views are request handlers


@api_view(["GET"])
def test(request):
    return HttpResponse("the api/v1/test endpoint is hit!")


@api_view(["POST"])
def create_user(request):
    user_id = request.data.get("user_id", None)
    if not user_id:
        return Response(
            {"error": "User_id is required"}, status=status.HTTP_404_NOT_FOUND
        )
    user = users_collection.find_one({"user_id": user_id})
    if user:
        return Response(
            {"error": "user_id already exists"}, status=status.HTTP_404_NOT_FOUND
        )
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
    if not user_id:
        return Response(
            {"error": "user_id is required"}, status=status.HTTP_400_BAD_REQUEST
        )

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
def resouce_scenario(request):
    user_id = request.data.get("user_id", None)

    if not user_id:
        return Response(
            {"error": "user_id is required"}, status=status.HTTP_400_BAD_REQUEST
        )

    if request.method == "POST":
        return create_scenario(request)

    if request.method == "DELETE":
        return delete_scenario(request)


@api_view(["POST"])
def create_conversation_response(request):
    return response_to_conversation(request)


@api_view(["POST"])
def request_help(request):
    return response_to_get_help(request)
