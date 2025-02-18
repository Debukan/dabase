from fastapi import APIRouter, Depends, HTTPException
from typing import List
from ..models.models import Task
from ..models.schemas import TaskCreate, Task as TaskSchema
from ..database.database import get_db
from sqlalchemy.orm import Session
from datetime import datetime

router = APIRouter()

@router.post("/admin/tasks", response_model=TaskSchema)
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    new_task = Task(
        title=f"{task.source} - Задание {task.task_number}",
        description=task.description,
        source=task.source,
        task_number=task.task_number,
        topic=task.topic,
        created_at=datetime.now()
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

@router.delete("/admin/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
    return {"message": "Task deleted"}
