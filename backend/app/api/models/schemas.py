from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from enum import Enum
import base64

class SourceEnum(str, Enum):
    kompege = "kompege"
    polykov = "polykov"

class TopicEnum(str, Enum):
    TOPIC_1 = "1"
    TOPIC_2 = "2"
    TOPIC_3 = "3"
    TOPIC_4 = "4"
    TOPIC_5 = "5"
    TOPIC_6 = "6"
    TOPIC_7 = "7"
    TOPIC_8 = "8"
    TOPIC_9 = "9"
    TOPIC_10 = "10"
    TOPIC_11 = "11"
    TOPIC_12 = "12"
    TOPIC_13 = "13"
    TOPIC_14 = "14"
    TOPIC_15 = "15"
    TOPIC_16 = "16"
    TOPIC_17 = "17"
    TOPIC_18 = "18"
    TOPIC_19_20_21 = "19-20-21"
    TOPIC_22 = "22"
    TOPIC_23 = "23"
    TOPIC_24 = "24"
    TOPIC_25 = "25"
    TOPIC_26 = "26"
    TOPIC_27 = "27"

class TaskBase(BaseModel):
    title: str
    text: str
    description: str
    source: str
    task_number: str
    topic: str
    solution: str
    task_url: Optional[str] = None

class TaskCreate(BaseModel):
    taskNumber: str
    site: SourceEnum
    text: str
    topic: TopicEnum
    solution: str
    explanation: Optional[str] = None
    task_url: Optional[str] = None
    image_data: Optional[str] = None
    image_type: Optional[str] = None
    solution_file: Optional[str] = None
    solution_filename: Optional[str] = None

    @property
    def title(self) -> str:
        return f"Задание {self.taskNumber} ({self.site})"

    @property
    def description(self) -> str:
        return self.solution

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "taskNumber": "27",
                "site": "kompege",
                "text": "Текст задания",
                "topic": "27",
                "solution": "Решение задания",
                "explanation": "Пояснение к решению",
                "task_url": "https://example.com/task",
                "image_data": None,
                "image_type": None,
                "solution_file": None,
                "solution_filename": None
            }
        }

class Task(BaseModel):
    id: int
    title: str
    text: str
    description: str
    source: str
    task_number: str
    topic: str
    solution: str
    explanation: Optional[str] = None
    task_url: Optional[str] = None
    image_data: Optional[str] = None
    image_type: Optional[str] = None
    solution_file: Optional[str] = None
    solution_filename: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class LoginData(BaseModel):
    username: str
    password: str
