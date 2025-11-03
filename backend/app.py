from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from bson import ObjectId
from pydantic import BaseModel
import os

app = FastAPI()

# ✅ Allow React frontend (Vercel) to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # you can restrict this later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ MongoDB connection
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client.get_database("mydatabase")
bookings = db["bookings"]

# ✅ Pydantic model for bookings
class Booking(BaseModel):
    customer_name: str
    email: str
    phone: str
    booking_date: str
    time_slot: str
    event_type: str
    guest_count: int
    special_requests: str = ""
    status: str = "pending"

# Root route
@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI on Render!"}


# ✅ Get all bookings
@app.get("/api/bookings")
def get_bookings():
    all_bookings = []
    for b in bookings.find():
        b["id"] = str(b["_id"])
        del b["_id"]
        all_bookings.append(b)
    return all_bookings


# ✅ Create a new booking
@app.post("/api/bookings")
def create_booking(booking: Booking):
    new_booking = booking.dict()
    result = bookings.insert_one(new_booking)
    new_booking["id"] = str(result.inserted_id)
    return new_booking


# ✅ Update booking status
@app.put("/api/bookings/{booking_id}")
def update_booking_status(booking_id: str, data: dict):
    result = bookings.update_one({"_id": ObjectId(booking_id)}, {"$set": data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Booking not found")
    return {"message": "Booking updated successfully"}


# ✅ Delete a booking
@app.delete("/api/bookings/{booking_id}")
def delete_booking(booking_id: str):
    result = bookings.delete_one({"_id": ObjectId(booking_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Booking not found")
    return {"message": "Booking deleted successfully"}
