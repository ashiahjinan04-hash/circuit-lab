from motor.motor_asyncio import AsyncIOMotorClient
from config import settings

class Database:
    client: AsyncIOMotorClient = None

db = Database()

async def connect_to_mongo():
    db.client = AsyncIOMotorClient(settings.MONGODB_URL)
    
    # Initialize indexes
    database = db.client[settings.DATABASE_NAME]
    
    # User Indexes
    await database.users.create_index("email", unique=True)
    
    # Project Indexes
    await database.projects.create_index([("user_id", 1), ("project_name", 1)])
    
    print("Connected to MongoDB & Indexes Verified")

async def close_mongo_connection():
    if db.client:
        db.client.close()
        print("MongoDB connection closed")

def get_database():
    return db.client[settings.DATABASE_NAME]
