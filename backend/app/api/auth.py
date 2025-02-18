from fastapi import APIRouter, HTTPException, Depends, Header
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from pathlib import Path
import logging

class LoginRequest(BaseModel):
    login: str
    password: str

router = APIRouter()

env_path = Path(__file__).parents[3] / '.env'
load_dotenv(env_path)

ADMIN_LOGIN = os.getenv("ADMIN_LOGIN")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")

print(ADMIN_LOGIN, ADMIN_PASSWORD)

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

@router.post("/verify-admin")
async def verify_admin(login_data: LoginRequest):
    logger.debug(f"Received login attempt for user: {login_data.login}")
    
    if not ADMIN_LOGIN or not ADMIN_PASSWORD:
        logger.error("Admin credentials not configured in .env")
        return JSONResponse(
            status_code=500,
            content={"detail": "Server configuration error"}
        )
    
    if login_data.login.strip() == ADMIN_LOGIN.strip() and login_data.password.strip() == ADMIN_PASSWORD.strip():
        logger.info("Successful admin login")
        # Здесь можно добавить генерацию JWT токена, но пока отправляем простой токен
        return JSONResponse(content={
            "valid": True,
            "token": "admin-session-token"  # В реальном приложении здесь должен быть JWT токен
        })
        
    logger.warning("Failed login attempt")
    return JSONResponse(
        status_code=401,
        content={"detail": "Incorrect login or password"}
    )

@router.get("/verify-token")
async def verify_token(authorization: str = Header(None)):
    if not authorization:
        return JSONResponse(
            status_code=401,
            content={"detail": "Token not provided"}
        )
    
    try:
        # Проверяем формат Bearer токена
        scheme, token = authorization.split()
        if scheme.lower() != 'bearer':
            return JSONResponse(
                status_code=401,
                content={"detail": "Invalid authentication scheme"}
            )
            
        # Проверяем сам токен
        if token == "admin-session-token":  # В реальном приложении здесь должна быть проверка JWT
            return JSONResponse(content={"valid": True})
        else:
            return JSONResponse(
                status_code=401,
                content={"detail": "Invalid token"}
            )
    except Exception as e:
        logger.error(f"Token verification error: {str(e)}")
        return JSONResponse(
            status_code=401,
            content={"detail": "Token verification failed"}
        )