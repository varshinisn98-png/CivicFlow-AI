from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/departments", tags=["Departments"])

@router.get("", response_model=List[schemas.DepartmentOut])
def get_departments(db: Session = Depends(get_db)):
    return db.query(models.Department).all()
