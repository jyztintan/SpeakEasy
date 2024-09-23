import json

from langchain_openai import ChatOpenAI
import os
from dotenv import load_dotenv
from django.http import JsonResponse, HttpResponse
from rest_framework.response import Response
from rest_framework import status
from .prompt_templates import *
from ..serializer import (
    ConversationSerializer,
    LLMResponseSerializer,
)

# Global Variables
load_dotenv()  # Need to call to load env variables
API_KEY = os.getenv('OPENAI_API_KEY')
MODEL = "gpt-4o-mini"
MAX_TOKENS = 400
TEMPERATURE = 0.8  # Higher temperature for more 'interesting' responses
llm = ChatOpenAI(api_key=API_KEY, temperature=TEMPERATURE, model=MODEL, max_tokens=MAX_TOKENS)
prompts = {"response_to_user":response_to_user(), "feedback_to_user":feedback_to_user(),
           "translate_cn":translate_cn(), "get_user_score":get_user_score(),
           "conversation_suggestion": conversation_suggestion()}


def response_to_conversation(request):
    # request body
    # {
    # "user_id" : "newuserjustin",
    # "scenario_id" : 1,
    # "context_text": "Describe your learning experience in the CS3216 Module"
    # "user_text" : "这个教程非常有趣"
    # }
    serializer = ConversationSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    user_text = request.data.get("user_text", None)
    context_text = request.data.get("context_text", None)
    if not user_text:
        return Response(
            {"error": "user_text is required"}, status=status.HTTP_400_BAD_REQUEST
        )
    response_data = generate_openai_responses(user_text, context_text)
    serializer = LLMResponseSerializer(data=response_data)
    if serializer.is_valid():
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def generate_openai_responses(user_text, context_text):
    output = {}
    prompt = prompts["response_to_user"]
    chain = prompt | llm
    output['text'] = chain.invoke({"user_input": user_text, "context": context_text}).content
    prompt = prompts["translate_cn"]
    chain = prompt | llm
    output['translated_text'] = chain.invoke({"chinese": output['text']}).content
    prompt = prompts["feedback_to_user"]
    chain = prompt | llm
    output['feedback'] = chain.invoke({"user_input": user_text, "context": context_text}).content
    prompt = prompts["get_user_score"]
    chain = prompt | llm
    output['score'] = chain.invoke({"user_input": user_text, "context": context_text}).content
    return output


def response_to_get_help(request):
    # {
    #     "user_id": "newuserbryan",
    #     "scenario_id": 1,
    #     "context_text": "Describe your learning experience in the CS3216 Module"
    #     "prev_gpt_message": "很高兴你觉得这个教程有趣！你学到了什么新知识吗？",
    # }
    prev_message = request.data.get("prev_gpt_message", None)
    context_text = request.data.get("context_text", None)
    if not prev_message:
        return Response(
            {"error": "prev_gpt_message is required"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    response = generate_openai_suggestions(prev_message, context_text)
    try:
        response_data = json.loads(response)
    except json.JSONDecodeError:
        return Response(
            {"error": "Invalid response from OpenAI"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    return JsonResponse(response_data)


def generate_openai_suggestions(prev_message, context_text):
    prompt = prompts["conversation_suggestion"]
    chain = prompt | llm
    return chain.invoke({"prev_message": prev_message, "context": context_text}).content
