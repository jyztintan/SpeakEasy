import json

from openai import OpenAI
import os
from dotenv import load_dotenv
from django.http import JsonResponse, HttpResponse
from rest_framework.response import Response
from rest_framework import status
from ..serializer import (
    ConversationSerializer,
    LLMResponseSerializer,
)
from ..process_prompt import openai_call

load_dotenv()  # Need to call to load env variables
api_key = os.getenv('OPENAI_API_KEY')


def response_to_conversation(request):
    # request body
    # {
    # "user_id" : "newuserjustin",
    # "scenario_id" : 1,
    # "user_text" : "这个教程非常有趣"
    # }
    serializer = ConversationSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    user_text = request.data.get("user_text", None)
    if not user_text:
        return Response(
            {"error": "user_text is required"}, status=status.HTTP_400_BAD_REQUEST
        )
    response = generate_openai_response(user_text)
    try:
        response_data = json.loads(response)
        # mock_response = {
        #     "text_response": "很高兴你觉得这个教程有趣！你学到了什么新知识吗？",
        #     "feedback": "Your input is clear and correctly expresses a positive opinion about the tutorial.
        #     To improve, consider adding more details about what you found interesting or what you learned.
        #     This will enhance the complexity and depth of your expression.",
        #     "translated_text": "I am glad you find this tutorial interesting! What new knowledge have you gained?",
        #     "score": 85
        # }
    except json.JSONDecodeError:
        return Response(
            {"error": "Invalid response from OpenAI"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    serializer = LLMResponseSerializer(data=response_data)
    print(serializer)
    if serializer.is_valid():
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def generate_openai_response(user_text):
    prompt = f"""
            You are a helpful language learning assistant. 
            Provide a structured JSON response containing the following fields 
            based on the user's input and strictly nothing else. 
            No ```json declaration needed, just the JSON object.

            User Input: "{user_text}"

            Requirements:
            - "text_response": A meaningful and contextually appropriate response to the user's input in Chinese.
            - "feedback": Constructive feedback on the user's input, 
            highlighting strengths and areas for improvement in English.
            - "translated_text": Translation of the appropriate text_response in English.
            - "score": A numerical score between 0 and 100 
            evaluating the user's input based on correctness, clarity, and complexity.

            Ensure the response is in valid JSON format with the exact field names specified.
            """
    messages = [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": prompt}
    ]
    client = OpenAI(api_key=api_key)
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        max_tokens=200,
        temperature=0.8  # Limit randomness of response
    )
    # print(response.choices[0].message.content)
    return response.choices[0].message.content


def response_to_get_help(request):
    # {
    #     "user_id": "newuserbryan",
    #     "scenario_id": 1,
    #     "prev_gpt_message": "很高兴你觉得这个教程有趣！你学到了什么新知识吗？",
    # }
    prev_message = request.data.get("prev_gpt_message", None)
    if not prev_message:
        return Response(
            {"error": "prev_gpt_message is required"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    response = generate_openai_suggestions(prev_message)
    try:
        response_data = json.loads(response)
        # mock_response = {
        #     "suggestions": ["helper 1", "helper 2", "helper 3"],
        # }
    except json.JSONDecodeError:
        return Response(
            {"error": "Invalid response from OpenAI"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    return JsonResponse(response_data)


def generate_openai_suggestions(prev_message):
    prompt = f"""
            You are a helpful language learning assistant. 
            Provide a structured JSON response containing the following fields 
            based on the user's input and strictly nothing else. 
            No ```json declaration needed, just the JSON object.

            Previous Input: "{prev_message}"

            Requirements:
            - "first": A meaningful and contextually appropriate response to the Previous Input in Chinese.
            - "first_en": A direct translation of the first suggestion in English.
            - "second": A second meaningful and contextually appropriate response to the Previous Input in Chinese.
            - "second_en": A direct translation of the second suggestion in English.
            - "third": A third meaningful and contextually appropriate response to the Previous Input in Chinese.
            - "third_en": A direct translation of the third suggestion in English.

            Ensure the response is in valid JSON format with the exact field names specified.
            """
    messages = [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": prompt}
    ]
    client = OpenAI(api_key=api_key)
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        max_tokens=200,
        temperature=0.8  # Limit randomness of response
    )
    # print(response.choices[0].message.content)
    return response.choices[0].message.content

