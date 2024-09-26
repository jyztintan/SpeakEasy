import json
import os

from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from pymongo.errors import DuplicateKeyError, OperationFailure
from django.http import JsonResponse, HttpResponse
from rest_framework.response import Response
from rest_framework import status
from .prompt_templates import *
from ..serializer import ScenarioSerializer
from db_connection import users_collection, scenarios_collection
import base64
from google.cloud import storage

# Global Variables
load_dotenv()  # Need to call to load env variables
API_KEY = os.getenv("OPENAI_API_KEY")
MODEL = "gpt-4o-mini"
MAX_TOKENS = 500
TEMPERATURE = 0.2  # Limit randomness of response
llm = ChatOpenAI(api_key=API_KEY, temperature=TEMPERATURE, model=MODEL, max_tokens=MAX_TOKENS)
prompts = {"refine_context":refine_context(),
           "generate_init_message":generate_init_message(),
           "translate_cn":translate_cn()}


def delete_scenario(request):
    # request body
    # {
    # "user_id" : "newuserbryan",
    # "scenario_id" : 891
    # }
    # Check if the scenario exists in the collection
    user_id = request.data.get("user_id")
    scenario_id = request.data.get("scenario_id", None)
    if not scenario_id:
        return Response(
            {"error": "scenario_id is required"}, status=status.HTTP_400_BAD_REQUEST
        )
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

        # Note: will not delete scenario from scenario collections in the event other users
        # are using the scenario (common scenarios)
        # scenarios_collection.delete_one({"scenario_id": scenario_id})

        return Response(
            {"message": f"Scenario {scenario_id} deleted for user successfully."},
            status=status.HTTP_200_OK,
        )

    except OperationFailure as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def create_scenario(request):
    # request body
    # {
    #      "user_id" : "newuserbryan",
    #      "context" : "hello world",
    #      "image" : image
    #      "name" : "name of scenario",
    #      "first_message" : "good bye world"
    #      "translated_first_message" : “你好”
    #  }

    # Handle image file from request.FILES
    image_file = request.FILES.get("image")
    if not image_file:
        return Response(
            {"error": "image is required"}, status=status.HTTP_400_BAD_REQUEST
        )

    image_name = f"{request.data.get('name')}_{image_file.name}"
    image_url = upload_image_to_cloud_storage(image_file, image_name)

    if not image_url:
        return Response(
            {"error": "Failed to upload image to cloud storage"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    # dirty way of getting next scenario_id, should be ok for small scenrio collection
    last_scenario = scenarios_collection.find_one(sort=[("scenario_id", -1)])
    new_scenario_id = last_scenario["scenario_id"] + 1

    user_id = request.data.get("user_id")
    scenario_data = {
        key: value for key, value in request.data.items() if key != "user_id"
    }
    scenario_data["scenario_id"] = new_scenario_id
    scenario_data["image"] = image_url

    # Refine context and get first message from GPT
    init_context = scenario_data.get("context")
    response = generate_openai_init_response(init_context)
    scenario_data["context"] = response.get("context")
    scenario_data["first_message"] = response.get("first_message")
    scenario_data["translated_first_message"] = response.get("translated_text")

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


def generate_openai_init_response(init_context):
    output = {}
    prompt = prompts["refine_context"]
    chain = prompt | llm
    output["context"] = chain.invoke({"context": init_context}).content
    prompt = prompts["generate_init_message"]
    chain = prompt | llm
    output["first_message"] = chain.invoke({"context": output["context"]}).content
    prompt = prompts["translate_cn"]
    chain = prompt | llm
    output["translated_text"] = chain.invoke({"chinese": output["first_message"]}).content
    return output


def upload_image_to_cloud_storage(image_file, image_name):
    try:
        client = storage.Client()
        bucket = client.get_bucket("speakeasy-scenarios")
        blob = bucket.blob(image_name)
        blob.upload_from_file(image_file, content_type=image_file.content_type)
        blob.content_disposition = "inline"
        blob.patch()
        blob.make_public()
        return blob.public_url
    except Exception as e:
        print(str(e))
        return False
