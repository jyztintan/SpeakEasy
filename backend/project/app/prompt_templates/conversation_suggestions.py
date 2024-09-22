from langchain_core.prompts import PromptTemplate

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

suggestions_prompt = PromptTemplate.from_template(prompt)

