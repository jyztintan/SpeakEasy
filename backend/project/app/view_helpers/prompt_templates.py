from langchain_core.prompts import PromptTemplate


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
        Context: "{context}"
        Output constructive feedback on the user's input, 
        highlighting strengths and areas for improvement in English.
        Evaluating the user's input based on relevancy, coherence, and complexity.
        Feedback should be at most 3 sentences without any special formatting.
        """

    return PromptTemplate.from_template(prompt)


def response_to_user():
    prompt = """
        You are a helpful language learning assistant. 
        User Input: "{user_input}"
        Context: "{context}"
        Based on the user input and context, provide a meaningful and contextually appropriate response in Chinese.
        If the user's input is irrelevant to the context or in English, you should reproach them and
        remind them to continue the conversation in Chinese, focusing on maintaining relevance to the topic.
        Aim to engage the user by concluding your response with a question, encouraging a continued dialogue.
        Response should be not be long.
        """

    return PromptTemplate.from_template(prompt)


def get_user_score():
    prompt = """
        You are a helpful language learning assistant. 
        User Input: "{user_input}"
        Context: "{context}"
        Strictly only output a numerical score between 0 and 100. 
        evaluating the user's input based on relevancy, coherence, and complexity.
        Take into account grammar and vocabulary.
        """

    return PromptTemplate.from_template(prompt)


def conversation_suggestion():
    prompt = """
            You are a helpful language learning assistant. 
            Provide a structured JSON response containing the following fields 
            based on the user's input and strictly nothing else. 
            No ```json declaration needed, just the JSON object.

            Previous Input: "{prev_message}"
            Context:  "{context}"

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


def refine_context():
    prompt = """
            You are a helpful language learning assistant. 
            User's initial context: '{context}'
            Output a refined version of the user's initial context that is coherent and understandable.
            Reframe the context clearly as an objective task.
            """

    return PromptTemplate.from_template(prompt)


def generate_init_message():
    prompt = """
            You should immediately assume the role of a helpful language learning assistant,
            without responding to this prompt. 
            Initial context: '{context}'
            Output an initial message to initiate a conversation 
            about the context in Chinese.
            It should not be too long.
            """

    return PromptTemplate.from_template(prompt)
