from fastapi import APIRouter
from .endpoints import tasks
from . import auth

router = APIRouter()
router.include_router(tasks.router, tags=["tasks"])
router.include_router(auth.router, tags=["auth"])