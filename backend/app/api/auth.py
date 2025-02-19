from fastapi import APIRouter, HTTPException, Depends, Header
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from pathlib import Path
import logging
import jwt
from datetime import datetime, timedelta

class LoginRequest(BaseModel):
    login: str
    password: str

router = APIRouter()

env_path = Path(__file__).parents[3] / '.env'
load_dotenv(env_path)

ADMIN_LOGIN = os.getenv("ADMIN_LOGIN")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/var/log/app/backend.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_MINUTES = 30

def create_jwt_token(data: dict) -> str:
    expiration = datetime.utcnow() + timedelta(minutes=JWT_EXPIRATION_MINUTES)
    to_encode = data.copy()
    to_encode.update({"exp": expiration})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)

def verify_jwt_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.post("/verify-admin")
async def verify_admin(login_data: LoginRequest):
    logger.debug(f"Received login attempt for user: {login_data.login}")
    
    if not ADMIN_LOGIN or not ADMIN_PASSWORD:
        logger.error("Admin credentials not configured in .env")
        return JSONResponse(
            status_code=500,
            content={"detail": "Server configuration error"}
        )
    
    input_login = login_data.login.strip()
    input_password = login_data.password.strip()
    stored_login = ADMIN_LOGIN.strip()
    stored_password = ADMIN_PASSWORD.strip()
    
    logger.debug(f"Comparing credentials: '{input_login}' with stored: '{stored_login}'")
    
    if input_login == stored_login and input_password == stored_password:
        logger.info("Successful admin login")
        token = create_jwt_token({"sub": input_login, "role": "admin"})
        return JSONResponse(content={
            "valid": True,
            "token": token
        })
    
    logger.warning(f"Failed login attempt. Expected: {stored_login}, Got: {input_login}")
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
        scheme, token = authorization.split()
        if scheme.lower() != 'bearer':
            return JSONResponse(
                status_code=401,
                content={"detail": "Invalid authentication scheme"}
            )
            
        payload = verify_jwt_token(token)
        return JSONResponse(content={"valid": True, "user": payload})
    except Exception as e:
        logger.error(f"Token verification error: {str(e)}")
        return JSONResponse(
            status_code=401,
            content={"detail": "Token verification failed"}
        )