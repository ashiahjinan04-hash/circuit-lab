from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from bson import ObjectId
from datetime import timedelta
import uuid

from database.mongodb_connection import get_database
from models.user_model import UserCreate, UserDB, UserResponse, Token, UserUpdate
from middleware.auth_middleware import get_password_hash, verify_password, create_access_token, get_current_user
from config import settings

router = APIRouter()

@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def signup(user: UserCreate, db=Depends(get_database)):
    # Check if email exists
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
        
    # Create new user
    hashed_password = get_password_hash(user.password)
    user_dict = user.model_dump()
    user_dict.pop("password", None)
    
    # Store ID properly
    new_user = UserDB(
        _id=str(uuid.uuid4()),
        name=user.name,
        email=user.email,
        password_hash=hashed_password
    )
    
    await db.users.insert_one(new_user.model_dump(by_alias=True))
    
    return UserResponse(
        id=new_user.id,
        name=new_user.name,
        email=new_user.email,
        created_at=new_user.created_at
    )

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db=Depends(get_database)):
    # Verify user
    user = await db.users.find_one({"email": form_data.username})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    # Verify password
    if not verify_password(form_data.password, user["password_hash"]):
         raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    # Generate Token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["_id"]}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
async def get_user_profile(user_id: str = Depends(get_current_user), db=Depends(get_database)):
    user = await db.users.find_one({"_id": user_id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return UserResponse(
        id=user["_id"],
        name=user["name"],
        email=user["email"],
        created_at=user["created_at"]
    )

@router.put("/me", response_model=UserResponse)
async def update_user_profile(
    update_data: UserUpdate, 
    user_id: str = Depends(get_current_user), 
    db=Depends(get_database)
):
    # Prepare update dict, only include set fields
    update_dict = {k: v for k, v in update_data.model_dump().items() if v is not None}
    
    if not update_dict:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No valid update data provided"
        )
        
    # Update user in database
    result = await db.users.update_one(
        {"_id": user_id},
        {"$set": update_dict}
    )
    
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
        
    # Fetch updated user
    updated_user = await db.users.find_one({"_id": user_id})
    
    return UserResponse(
        id=updated_user["_id"],
        name=updated_user["name"],
        email=updated_user["email"],
        created_at=updated_user["created_at"]
    )
