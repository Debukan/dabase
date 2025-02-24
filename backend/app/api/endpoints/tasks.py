import logging
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Security
from typing import List
from datetime import datetime
from ..models.schemas import Task, TaskCreate
from ..models.models import Task as TaskModel, User
from sqlalchemy.orm import Session
from ..database.database import get_db
import base64
from ..auth import auth

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/tasks/", response_model=List[Task])
async def read_tasks(skip: int = 0, limit: int = 100, source: str = None, db: Session = Depends(get_db)):
    logger.info(f"Fetching tasks with skip={skip}, limit={limit}, source={source}")
    query = db.query(TaskModel)
    if source:
        query = query.filter(TaskModel.source == source)
    tasks = query.order_by(TaskModel.created_at.desc()).offset(skip).limit(limit).all()
    return tasks

@router.get("/tasks/{task_id}", response_model=Task)
async def read_task(task_id: int, db: Session = Depends(get_db)):
    logger.info(f"Fetching task with id={task_id}")
    task = db.query(TaskModel).filter(TaskModel.id == task_id).first()
    if task is None:
        logger.warning(f"Task with id={task_id} not found")
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.post("/tasks/", response_model=Task)
async def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    logger.info(f"Received task creation request: {task}")
    try:
        # Добавим детальное логирование
        logger.debug(f"Processing task data: {task.dict()}")
        
        solution_file = None
        if task.solution_file and ',' in task.solution_file:
            solution_file = task.solution_file.split(',')[1]
        elif task.solution_file:
            solution_file = task.solution_file

        db_task = TaskModel(
            title=f"{task.site.value} - Задание {task.taskNumber}",
            task_number=task.taskNumber,
            text=task.text,
            source=task.site,
            topic=task.topic,
            description=task.text,
            solution=task.solution,
            explanation=task.explanation,
            task_url=task.task_url,
            image_data=task.image_data,
            image_type=task.image_type,
            solution_file=solution_file,
            solution_filename=task.solution_filename,
            created_at=datetime.now()
        )
        db.add(db_task)
        db.commit()
        db.refresh(db_task)
        return db_task
    except Exception as e:
        logger.error(f"Error creating task: {str(e)}", exc_info=True)
        db.rollback()
        print(f"Error creating task: {str(e)}")
        raise HTTPException(
            status_code=422, 
            detail={"message": "Failed to create task", "error": str(e)}
        )

@router.put("/tasks/{task_id}", response_model=Task)
async def update_task(
    task_id: int, 
    task: Task, 
    current_user: User = Security(auth.get_current_user),
    db: Session = Depends(get_db)
):
    logger.info(f"Updating task with id={task_id}")
    db_task = db.query(TaskModel).filter(TaskModel.id == task_id).first()
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    
    update_data = task.dict(exclude_unset=True)
    allowed_fields = {'text', 'solution', 'explanation'}
    filtered_data = {k: v for k, v in update_data.items() if k in allowed_fields}
    
    for key, value in filtered_data.items():
        setattr(db_task, key, value)
    
    try:
        db.commit()
        db.refresh(db_task)
        return db_task
    except Exception as e:
        db.rollback()
        logger.error(f"Error updating task: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update task")

@router.delete("/tasks/{task_id}")
async def delete_task(
    task_id: int, 
    current_user: User = Security(auth.get_current_user),
    db: Session = Depends(get_db)
):
    logger.info(f"Deleting task with id={task_id}")
    
    if not current_user or 'role' not in current_user or current_user['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    db_task = db.query(TaskModel).filter(TaskModel.id == task_id).first()
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    
    try:
        db.delete(db_task)
        db.commit()
        return {"detail": "Task deleted"}
    except Exception as e:
        db.rollback()
        logger.error(f"Error deleting task: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete task")