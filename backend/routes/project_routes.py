from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from datetime import datetime
import uuid

from database.mongodb_connection import get_database
from models.project_model import ProjectCreate, ProjectDB, ProjectResponse, ProjectUpdate
from middleware.auth_middleware import get_current_user
from services.circuit_validator import validate_circuit_data

router = APIRouter()

@router.get("/", response_model=List[ProjectResponse])
async def get_projects(current_user_id: str = Depends(get_current_user), db=Depends(get_database)):
    projects_cursor = db.projects.find({"user_id": current_user_id})
    projects = await projects_cursor.to_list(length=100)
    
    return [
        ProjectResponse(
            id=p["_id"],
            project_name=p["project_name"],
            circuit_data=p["circuit_data"],
            circuit_version=p.get("circuit_version", 1),
            updated_at=p["updated_at"]
        ) for p in projects
    ]

@router.post("/create", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(project: ProjectCreate, current_user_id: str = Depends(get_current_user), db=Depends(get_database)):
    # Validate Circuit Data structure
    validate_circuit_data(project.circuit_data)
        
    new_project = ProjectDB(
        _id=str(uuid.uuid4()),
        user_id=current_user_id,
        project_name=project.project_name,
        circuit_data=project.circuit_data,
        circuit_version=project.circuit_version
    )
    
    await db.projects.insert_one(new_project.model_dump(by_alias=True))
    
    return ProjectResponse(
        id=new_project.id,
        project_name=new_project.project_name,
        circuit_data=new_project.circuit_data,
        circuit_version=new_project.circuit_version,
        updated_at=new_project.updated_at
    )

@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(project_id: str, current_user_id: str = Depends(get_current_user), db=Depends(get_database)):
    project = await db.projects.find_one({"_id": project_id, "user_id": current_user_id})
    if not project:
         raise HTTPException(status_code=404, detail="Project not found")
         
    return ProjectResponse(
        id=project["_id"],
        project_name=project["project_name"],
        circuit_data=project["circuit_data"],
        circuit_version=project.get("circuit_version", 1),
        updated_at=project["updated_at"]
    )

@router.put("/{project_id}", response_model=ProjectResponse)
async def update_project(project_id: str, project_update: ProjectUpdate, current_user_id: str = Depends(get_current_user), db=Depends(get_database)):
    # Validate Circuit Data
    validate_circuit_data(project_update.circuit_data)
    
    # Check ownership
    existing_project = await db.projects.find_one({"_id": project_id, "user_id": current_user_id})
    if not existing_project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    # Update
    updated_at = datetime.utcnow()
    await db.projects.update_one(
        {"_id": project_id},
        {"$set": {
            "circuit_data": project_update.circuit_data,
            "circuit_version": project_update.circuit_version,
            "updated_at": updated_at
        }}
    )
    
    return ProjectResponse(
        id=existing_project["_id"],
        project_name=existing_project["project_name"],
        circuit_data=project_update.circuit_data,
        circuit_version=project_update.circuit_version,
        updated_at=updated_at
    )

@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(project_id: str, current_user_id: str = Depends(get_current_user), db=Depends(get_database)):
    result = await db.projects.delete_one({"_id": project_id, "user_id": current_user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    return None
