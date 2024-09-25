# this is just a draft, just for setting up connection to mongodb atlas
import os
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv

load_dotenv()
mongodb_key = os.getenv('MONGODB_KEY')

uri = f'mongodb+srv://new_user:{mongodb_key}@assignment-3.sygvy.mongodb.net/?retryWrites=true&w=majority&appName=Assignment-3&connectTimeoutMS=30000&socketTimeoutMS=30000'

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

db = client["assignment3"]

users_collection = db["Users"]
scenarios_collection = db["Scenarios"]

# print("Successfully connected to mongodb atlas")