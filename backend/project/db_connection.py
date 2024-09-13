# this is just a draft, just for setting up connection to mongodb atlas

from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

uri = "mongodb+srv://cs3216a3g1:Oi1ybUKU2jsHhAvK@assignment-3.sygvy.mongodb.net/?retryWrites=true&w=majority&appName=Assignment-3&connectTimeoutMS=30000&socketTimeoutMS=30000"

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

db = client["assignment3"]
collection = db["test_collection"]
item = {
    "name": "test",
    "no.": 2
}
collection.insert_one(item)

print("Successfully connected to mongodb atlas")