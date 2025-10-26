from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, date


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class BookingCreate(BaseModel):
    customer_name: str
    email: EmailStr
    phone: str
    booking_date: str
    time_slot: str  # morning, afternoon, evening
    event_type: str
    guest_count: int
    special_requests: Optional[str] = ""

class Booking(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    customer_name: str
    email: EmailStr
    phone: str
    booking_date: str
    time_slot: str
    event_type: str
    guest_count: int
    special_requests: Optional[str] = ""
    status: str = "pending"  # pending, confirmed, cancelled
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class BookingUpdate(BaseModel):
    status: str

class AvailabilityCheck(BaseModel):
    booking_date: str


# Booking Routes
@api_router.post("/bookings", response_model=Booking)
async def create_booking(booking_input: BookingCreate):
    # Check if slot is available
    existing_bookings = await db.bookings.find({
        "booking_date": booking_input.booking_date,
        "time_slot": booking_input.time_slot,
        "status": {"$ne": "cancelled"}
    }).to_list(None)
    
    if existing_bookings:
        raise HTTPException(status_code=400, detail="This time slot is already booked")
    
    booking_dict = booking_input.model_dump()
    booking_obj = Booking(**booking_dict)
    
    doc = booking_obj.model_dump()
    await db.bookings.insert_one(doc)
    
    return booking_obj

@api_router.get("/bookings", response_model=List[Booking])
async def get_all_bookings():
    bookings = await db.bookings.find({}, {"_id": 0}).to_list(1000)
    return bookings

@api_router.get("/bookings/{booking_id}", response_model=Booking)
async def get_booking(booking_id: str):
    booking = await db.bookings.find_one({"id": booking_id}, {"_id": 0})
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking

@api_router.put("/bookings/{booking_id}", response_model=Booking)
async def update_booking(booking_id: str, update: BookingUpdate):
    result = await db.bookings.update_one(
        {"id": booking_id},
        {"$set": {"status": update.status}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    booking = await db.bookings.find_one({"id": booking_id}, {"_id": 0})
    return booking

@api_router.delete("/bookings/{booking_id}")
async def delete_booking(booking_id: str):
    result = await db.bookings.delete_one({"id": booking_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    return {"message": "Booking deleted successfully"}

@api_router.post("/availability")
async def check_availability(check: AvailabilityCheck):
    bookings = await db.bookings.find({
        "booking_date": check.booking_date,
        "status": {"$ne": "cancelled"}
    }, {"_id": 0}).to_list(None)
    
    booked_slots = [b["time_slot"] for b in bookings]
    
    return {
        "date": check.booking_date,
        "morning_available": "morning" not in booked_slots,
        "afternoon_available": "afternoon" not in booked_slots,
        "evening_available": "evening" not in booked_slots
    }

@api_router.get("/availability/range")
async def get_availability_range(start_date: str, end_date: str):
    bookings = await db.bookings.find({
        "booking_date": {"$gte": start_date, "$lte": end_date},
        "status": {"$ne": "cancelled"}
    }, {"_id": 0}).to_list(None)
    
    # Group bookings by date
    bookings_by_date = {}
    for booking in bookings:
        date = booking["booking_date"]
        if date not in bookings_by_date:
            bookings_by_date[date] = []
        bookings_by_date[date].append(booking["time_slot"])
    
    return bookings_by_date

@api_router.get("/")
async def root():
    return {"message": "Wedding Salon API"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()