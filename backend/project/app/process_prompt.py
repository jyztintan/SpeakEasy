from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv() # Need to call to load env variables

def openai_call(prompt):
    api_key = os.getenv('OPENAI_API_KEY')

    messages = [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": f"Translate the following English text to Chinese: '{prompt}'"}
    ]
    client = OpenAI(api_key=api_key)
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        max_tokens=60,
        temperature=0.5  # "Creativity" or rather randomness of response
    )
    # print(response.choices[0].message.content)
    return response.choices[0].message.content

# print(openai_call("your mother very nice"))
