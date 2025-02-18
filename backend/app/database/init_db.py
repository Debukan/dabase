from ..api.models.models import Base, Task
from .database import engine

def init_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
