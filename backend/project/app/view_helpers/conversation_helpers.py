import json

from langchain_openai import ChatOpenAI
# from openai import OpenAI
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
MAX_TOKENS = 200
TEMPERATURE = 0.8  # Higher temperature for more 'interesting' responses
llm = ChatOpenAI(api_key=API_KEY, temperature=TEMPERATURE, model=MODEL, max_tokens=MAX_TOKENS)
prompts = {}


def response_to_conversation(request):
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
    prompt = response_to_user()
    chain = prompt | llm
    output['text'] = chain.invoke({"user_input": user_text, "context": context_text}).content
    prompt = translate_cn()
    chain = prompt | llm
    output['translated_text'] = chain.invoke({"chinese": output['text']}).content
    prompt = feedback_to_user()
    chain = prompt | llm
    output['feedback'] = chain.invoke({"user_input": user_text, "context": context_text}).content
    prompt = get_user_score()
    chain = prompt | llm
    output['score'] = chain.invoke({"user_input": user_text, "context": context_text}).content
    return output


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
    # mock_response = {
    #     "first": "我学到了很多关于中文语法的知识，特别是句子的结构。",
    #     "first_en": "I learned a lot about Chinese grammar, especially sentence structure.",
    #     "second": "我了解了如何使用更多的词汇来表达我的想法。",
    #     "second_en": "I learned how to use more vocabulary to express my thoughts.",
    #     "third": "这个教程让我对汉字的写法有了更深入的理解。",
    #     "third_en": "This tutorial gave me a deeper understanding of how to write Chinese characters."
    # }
    try:
        response_data = json.loads(response)
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

            return a list of dictionaries
	            eg. dict(
                "suggestions": 
                    [
                        dict("text": first, "translated_text": first_en),
                        dict("text": second, "translated_text": second_en),
                        dict("text": third, "translated_text": third_en)
                    ]
                )
            Ensure the response is in valid JSON format with the exact field names specified.
            """
    messages = [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": prompt}
    ]
    client = OpenAI(api_key=API_KEY)
    response = client.chat.completions.create(
        model=MODEL,
        messages=messages,
        max_tokens=MAX_TOKENS,
        temperature=TEMPERATURE
    )
    # print(response.choices[0].message.content)
    return response.choices[0].message.content
