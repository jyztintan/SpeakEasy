from langchain_core.prompts import PromptTemplate
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
import os

load_dotenv()  # Need to call to load env variables
API_KEY = os.getenv('OPENAI_API_KEY')
MODEL = "gpt-4o-mini"
MAX_TOKENS = 300
TEMPERATURE = 0.8  # Higher temperature for more 'interesting' responses
llm = ChatOpenAI(api_key=API_KEY, temperature=TEMPERATURE, model=MODEL, max_tokens=MAX_TOKENS)


def translate_cn():
    prompt = """
        Translate the following Chinese text to English:
        {chinese}
        """

    return PromptTemplate.from_template(prompt)


def feedback_to_user():
    prompt = """
        You are a helpful language learning assistant. 
        User Input: "{user_input}"
        Output constructive feedback on the user's input, 
        highlighting strengths and areas for improvement in English.
        Evaluating the user's input based on correctness, clarity, and complexity.
        Take into account grammar and vocabulary.
        """

    return PromptTemplate.from_template(prompt)


def response_to_user():
    prompt = """
        You are a helpful language learning assistant. 
        User Input: "{user_input}"
        Output A meaningful and contextually appropriate response to the user's input in Chinese.
        Try to return with a question to keep the conversation going.
        """

    return PromptTemplate.from_template(prompt)


def get_user_score():
    prompt = """
        You are a helpful language learning assistant. 
        User Input: "{user_input}"
        Strictly only output a numerical score between 0 and 100. 
        evaluating the user's input based on correctness, clarity, and complexity.
        Take into account grammar and vocabulary.
        """

    return PromptTemplate.from_template(prompt)



def conversation_response_template():
    prompt = """
        You are a helpful language learning assistant. 
        Provide a structured JSON response containing the following fields 
        based on the user's input and strictly nothing else. 
        No ```json declaration needed, just the JSON object.

        User Input: "{user_input}"

        Requirements:
        - "text": A meaningful and contextually appropriate response to the user's input in Chinese.
        - "feedback": Constructive feedback on the user's input, 
        highlighting strengths and areas for improvement in English.
        - "translated_text": Translation of the appropriate text_response in English.
        - "score": A numerical score between 0 and 100 
        evaluating the user's input based on correctness, clarity, and complexity.

        Ensure the response is in valid JSON format with the exact field names specified.
        """

    return PromptTemplate.from_template(prompt)


def conversation_suggestion_template():
    prompt = """
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

    return PromptTemplate.from_template(prompt)


def scenario_creation_template():
    prompt = """
                You are a helpful language learning assistant. 
                Provide a structured JSON response containing the following fields 
                based on the user's input and strictly nothing else. 
                No ```json declaration needed, just the JSON object.

                User's initial context: '{context}'

                Requirements:
                - "refined_context": A refined version of the user's initial context that is clear and concise.
                - "first_message": An initial message to initiate a detailed conversation 
                about the image and context in Chinese.
                - "translated": The initial message to initiate a detailed conversation 
                about the image and context translated in English.

                Ensure the response is in valid JSON format with the exact field names specified.
            """

    return PromptTemplate.from_template(prompt)
