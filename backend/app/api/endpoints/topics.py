from fastapi import APIRouter, HTTPException
from typing import List
from ..models.models import Topic
from ..database.database import get_db
from sqlalchemy.orm import Session

router = APIRouter()

@router.get("/topics/", response_model=List[Topic])
def read_topics(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    topics = db.query(Topic).offset(skip).limit(limit).all()
    return topics

@router.get("/topics/{topic_id}", response_model=Topic)
def read_topic(topic_id: int, db: Session = Depends(get_db)):
    topic = db.query(Topic).filter(Topic.id == topic_id).first()
    if topic is None:
        raise HTTPException(status_code=404, detail="Topic not found")
    return topic