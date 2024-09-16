from pymongo.errors import DuplicateKeyError, OperationFailure
from django.http import JsonResponse, HttpResponse
from rest_framework.response import Response
from rest_framework import status
from ..serializer import ScenarioSerializer
from db_connection import users_collection, scenarios_collection
import base64


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
    #  }

    # Handle image file from request.FILES
    image_file = request.FILES.get("image")
    if image_file:
        # convert image to base64 for easy storage
        image_binary = image_file.read()
        image_base64 = base64.b64encode(image_binary).decode("utf-8")
    else:
        return Response(
            {"error": "image is required"}, status=status.HTTP_400_BAD_REQUEST
        )

    # dirty way of getting next scenario_id, should be ok for small scenrio collection
    last_scenario = scenarios_collection.find_one(sort=[("scenario_id", -1)])
    new_scenario_id = last_scenario["scenario_id"] + 1

    user_id = request.data.get("user_id")
    scenario_data = {
        key: value for key, value in request.data.items() if key != "user_id"
    }
    scenario_data["scenario_id"] = new_scenario_id
    scenario_data["image"] = image_base64
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
