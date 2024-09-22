from langchain_core.prompts import PromptTemplate

prompt = f"""
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

create_scenario_prompt = PromptTemplate.from_template(prompt)

