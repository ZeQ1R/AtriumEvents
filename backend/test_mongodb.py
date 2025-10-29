from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
from dotenv import load_dotenv
import os

async def test_connection():
    # Load environment variables
    load_dotenv()
    
    # Get MongoDB connection string
    mongo_url = os.getenv('MONGO_URL')
    db_name = os.getenv('DB_NAME')
    
    try:
        # Create client
        client = AsyncIOMotorClient(mongo_url)
        
        # Try to connect and list databases
        await client.admin.command('ping')
        print("✅ Successfully connected to MongoDB!")
        
        # List all databases
        database_names = await client.list_database_names()
        print("\nAvailable databases:")
        for db in database_names:
            print(f"- {db}")
        
        # Connect to specific database
        db = client[db_name]
        
        # List all collections
        collections = await db.list_collection_names()
        print(f"\nCollections in {db_name}:")
        for collection in collections:
            print(f"- {collection}")
            
    except Exception as e:
        print("❌ Failed to connect to MongoDB!")
        print(f"Error: {str(e)}")
    finally:
        # Close the connection
        client.close()

if __name__ == "__main__":
    asyncio.run(test_connection())