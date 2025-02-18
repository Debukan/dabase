from fastapi import APIRouter, HTTPException, Depends
from typing import List
from datetime import datetime
from ..models.schemas import Task, TaskCreate
from ..models.models import Task as TaskModel
from sqlalchemy.orm import Session
from ..database.database import get_db

router = APIRouter()

@router.get("/tasks/", response_model=List[Task])
def read_tasks(skip: int = 0, limit: int = 100, source: str = None, db: Session = Depends(get_db)):
    query = db.query(TaskModel)
    if source:
        query = query.filter(TaskModel.source == source)
    tasks = query.offset(skip).limit(limit).all()
    return tasks

@router.get("/tasks/{task_id}", response_model=Task)
def read_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(TaskModel).filter(TaskModel.id == task_id).first()
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.post("/tasks/", response_model=Task)
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    db_task = TaskModel(
        title=f"Задание {task.taskNumber}",
        task_number=task.taskNumber,
        text=task.text,
        source=task.site,
        topic=task.topic,
        description=task.solution,
        explanation=task.explanation if task.explanation else None,
        created_at=datetime.now()
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@router.put("/tasks/{task_id}", response_model=Task)
def update_task(task_id: int, task: Task, db: Session = Depends(get_db)):
    db_task = db.query(TaskModel).filter(TaskModel.id == task_id).first()
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    for key, value in task.dict().items():
        setattr(db_task, key, value)
    db.commit()
    db.refresh(db_task)
    return db_task

@router.delete("/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    db_task = db.query(TaskModel).filter(TaskModel.id == task_id).first()
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(db_task)
    db.commit()
    return {"detail": "Task deleted"}