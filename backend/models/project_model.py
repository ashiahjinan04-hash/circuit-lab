from datetime import datetime
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class ProjectCreate(BaseModel):
    project_name: str = Field(..., min_length=1, max_length=100)
    circuit_data: Dict[str, Any]
    circuit_version: int = 1

class ProjectDB(BaseModel):
    id: str = Field(alias="_id")
    user_id: str
    project_name: str
    circuit_data: Dict[str, Any]
    circuit_version: int
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ProjectResponse(BaseModel):
    id: str
    project_name: str
    circuit_data: Dict[str, Any]
    circuit_version: int
    updated_at: datetime

class ProjectUpdate(BaseModel):
    circuit_data: Dict[str, Any]
    circuit_version: int = 1
