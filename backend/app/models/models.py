from sqlalchemy import Column, Integer, String, ForeignKey, LargeBinary
from sqlalchemy.orm import relationship
from database.database import Base

class Topic(Base):
    __tablename__ = 'topics'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)

    tasks = relationship("Task", back_populates="topic")

class Task(Base):
    __tablename__ = 'tasks'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    topic_id = Column(Integer, ForeignKey('topics.id'))
    image_data = Column(LargeBinary, nullable=True)
    image_type = Column(String(50), nullable=True)

    topic = relationship("Topic", back_populates="tasks")