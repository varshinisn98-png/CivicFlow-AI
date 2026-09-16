from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas, auth

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=schemas.Token)
def register(user_in: schemas.UserRegister, db: Session = Depends(get_db)):
    clean_email = user_in.email.lower().strip()
    existing_user = db.query(models.User).filter(models.User.email == clean_email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists. Please log in."
        )
    
    hashed_pwd = auth.get_password_hash(user_in.password)
    user = models.User(
        email=clean_email,
        hashed_password=hashed_pwd,
        full_name=user_in.full_name.strip(),
        role=user_in.role or "citizen",
        department_id=user_in.department_id
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    access_token = auth.create_access_token(data={"sub": user.email})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.post("/login", response_model=schemas.Token)
def login(credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    clean_email = credentials.email.lower().strip()
    user = db.query(models.User).filter(models.User.email == clean_email).first()
    
    if not user or not auth.verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email address or password. Please check your credentials.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = auth.create_access_token(data={"sub": user.email})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/me", response_model=schemas.UserOut)
def get_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user
