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


@api_view(["POST"])
def create_scenario(request):
    serializer = ScenarioSerializer(data=request.data)
    if serializer.is_valid():
        # TODO use mongodb to save this user, now throws error
        scenarios_collection.insert_one(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def create_conversation_response(request):
    # request body
    # {
    # "user_id" : "teost",
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
