# app.py
from fastapi import FastAPI
from pymongo import MongoClient
import os

app = FastAPI()

MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client.get_database("mydatabase")

@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI on Render!"}

@app.get("/admin")
def read_admin():
    return {"admin": True}
