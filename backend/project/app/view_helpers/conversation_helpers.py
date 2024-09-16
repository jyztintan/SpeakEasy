from pymongo.errors import DuplicateKeyError, OperationFailure
from django.http import JsonResponse, HttpResponse
from rest_framework.response import Response
from rest_framework import status
from ..serializer import (
    ConversationSerializer,
    LLMResponseSerializer,
)
from ..process_prompt import openai_call


def response_to_conversation(request):
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
            "text": "wo hen hao",
            "feedback": "you could have done this better!",
            "translated_text": "I am doing very well",
            "score": 10,
        }
        return Response(LLMResponseSerializer(mock_response).data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def response_to_get_help(request):
    # {
    #     "user_id": "newuserbryan",
    #     "scenario_id": 1,
    #     "prev_gpt_message": "What is that on your plate?",
    # }
    prev_message = request.data.get("prev_gpt_message", None)
    if not prev_message:
        return Response(
            {"error": "prev_gpt_message is required"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    # TODO justin generate some suggestions
    mock_response = {
        "suggestions": ["helper 1", "helper 2", "helper 3"],
    }
    return JsonResponse(mock_response)


def generate_openai_response(request):
    original = request.GET.get("original")
    translated = openai_call(original)
    return JsonResponse({"translation": translated})
