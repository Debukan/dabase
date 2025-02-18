from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from enum import Enum

class SourceEnum(str, Enum):
    kompege = "kompege"
    polykov = "polykov"

class TaskBase(BaseModel):
    title: str
    text: str
    description: str
    source: str
    task_number: str
    topic: str

class TaskCreate(BaseModel):
    taskNumber: str
    site: SourceEnum
    text: str
    topic: str
    solution: str
    explanation: Optional[str] = None

class Task(TaskBase):
    id: int
    created_at: datetime
    explanation: Optional[str]

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class LoginData(BaseModel):
    username: str
    password: str
