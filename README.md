# SpeakEasy

SpeakEasy is a language learning platform that focuses on immersing users in real-world scenarios. Each scenario is conducted through actual conversations, where the user speaks to our application about the specific scenario. The scenarios are designed to provide contextual learning, where the flow of conversation is dynamic, driven by interaction between the user and a generative AI. This allows for personalised and adaptive language practice, offering a more natural and engaging learning experience.

Application: https://speakeasy-speakfreely.netlify.app/

# Group Members

## Daniel Kok

- Matric Number: A0234683Y
- Contributions:
  - Designed frontend on Figma
  - Developed and designed landing page
  - Developed frontend application pages

## Justin Tan

- Matric Number: A0252153N
- Contributions:
  - Prompt Engineering with Langchain
  - Integrate LLM for AI Responses, Context Refinement, and User Feedback
  - Creation of Fixed Scenarios
  - LLM and API Testing

## Lam Jiu Fong

- Matric Number: A0255851Y
- Contributions:
  - Set up MongoDB
  - Developed Frontend pages
  - Wrote APIs in Frontend to link Backend
  - Set up Speech Recognition
  - Set up Text-to-Speech

## Bryan Ho

- Matric Number: A0234509E
- Contributions:
  - Wrote APIs
  - Hosted Frontend on Netlify and Backend on Vercel
  - UI touch ups
  - Set up Google Authentication
  - Set up and implement Google Cloud Storage

# Set Up Instructions

## Frontend

- At the root of the repository, run `npm i` to install the packages
- Run `npm run dev` to start the application

## Backend

- Change directory to `backend` folder and run `python3 -m venv env` to create the virtual environment
- Then run `source env/bin/activate` to enter the virtual environment
- The run `pip install -r requirements.txt` to download the dependencies
- Change directory to `project` and run ` python3 manage.py runserver` to start the backend

  ## Note:

  Environment variables required for the Frontend

  - VITE_BACKEND_URL="http://127.0.0.1:8000"
  - VITE_GOOGLE_APIKEY
  - VITE_GOOGLE_AUTHDOMAIN
  - VITE_GOOGLE_PROJECTID
  - VITE_GOOGLE_STORAGEBUCKET
  - VITE_GOOGLE_MESSAGINGSSENDERID
  - VITE_GOOGLE_APPID
  - VITE_GOOGLE_MEASUREMENTID

  Environment variables required for the Backend

  - OPENAI_API_KEY
  - GOOGLE_APPLICATION_CREDENTIALS_JSON

# Resources

## Frontend

- ShadCN
- TailwindCSS
- Firebase Authentication
- OGP

## Backend

- Python
- Django
- MongoDB
- Google Cloud Storage for blob store
- Langchain
