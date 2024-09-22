import os

from dotenv import load_dotenv
from langchain_core.prompts import PromptTemplate
from langchain_openai import ChatOpenAI


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

response_prompt = PromptTemplate.from_template(prompt)
load_dotenv()
API_KEY = os.getenv('OPENAI_API_KEY')

llm = ChatOpenAI(api_key=API_KEY,temperature=1, model="gpt-4o-mini")
print(f'Default model is: {llm.model_name}')

chain = response_prompt | llm
result = chain.invoke({"user_input": "这个教程非常有趣"})
print(result)
