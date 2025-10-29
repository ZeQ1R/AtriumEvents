from pymongo import MongoClient
import uuid
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Connect to MongoDB
client = MongoClient(os.environ['MONGO_URL'])
db = client[os.environ['DB_NAME']]

# Sample booking data
sample_bookings = [
    {
        "id": str(uuid.uuid4()),
        "customer_name": "John Doe",
        "email": "john@example.com",
        "phone": "123-456-7890",
        "booking_date": (datetime.now() + timedelta(days=7)).strftime("%Y-%m-%d"),
        "time_slot": "morning",
        "event_type": "Wedding",
        "guest_count": 100,
        "special_requests": "Need vegetarian options",
        "status": "pending",
        "created_at": datetime.now().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "customer_name": "Jane Smith",
        "email": "jane@example.com",
        "phone": "098-765-4321",
        "booking_date": (datetime.now() + timedelta(days=14)).strftime("%Y-%m-%d"),
        "time_slot": "evening",
        "event_type": "Anniversary",
        "guest_count": 50,
        "special_requests": "Decoration in blue theme",
        "status": "confirmed",
        "created_at": datetime.now().isoformat()
    }
]

# Clear existing bookings
db.bookings.delete_many({})

# Insert sample bookings
db.bookings.insert_many(sample_bookings)

print("Sample bookings have been added to the database!")