from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.api.database.database import get_db
from app.api.models.models import User
from app.api.models.schemas import Token
from app.api.auth.auth import create_access_token, verify_password
import os
from dotenv import load_dotenv
from pathlib import Path
import logging

router = APIRouter(tags=["auth"])

class LoginRequest(BaseModel):
    login: str
    password: str

env_path = Path(__file__).parents[3] / '.env'
load_dotenv(env_path)

ADMIN_LOGIN = os.getenv("ADMIN_LOGIN")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")

@router.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=400,
            detail="Incorrect username or password"
        )
    access_token = create_access_token({"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}
