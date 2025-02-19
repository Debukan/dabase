from sqlalchemy import Column, Integer, String, Text, DateTime, Enum
from sqlalchemy.ext.declarative import declarative_base
import enum
from datetime import datetime

Base = declarative_base()

class SourceEnum(str, enum.Enum):
    kompege = "kompege"
    polykov = "polykov"

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    text = Column(Text, nullable=False)
    description = Column(Text, nullable=False)
    source = Column(Enum(SourceEnum), nullable=False)
    task_number = Column(String(50), nullable=False)
    topic = Column(String(255), nullable=False)
    solution = Column(Text, nullable=False)
    explanation = Column(Text, nullable=True)
    task_url = Column(String(500), nullable=True)
    image_data = Column(Text, nullable=True)
    image_type = Column(String(50), nullable=True)
    solution_file = Column(Text, nullable=True)
    solution_filename = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.now)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
