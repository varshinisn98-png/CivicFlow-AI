from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas, auth

router = APIRouter(prefix="/feedback", tags=["Feedback"])

@router.post("/{complaint_id}", response_model=schemas.FeedbackOut)
def submit_feedback(
    complaint_id: int,
    fb_in: schemas.FeedbackCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    complaint = db.query(models.Complaint).filter(models.Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    
    if complaint.user_id != current_user.id and current_user.role == "citizen":
        raise HTTPException(status_code=403, detail="Can only review your own complaint")

    if complaint.feedback:
        raise HTTPException(status_code=400, detail="Feedback already submitted for this complaint")

    fb = models.Feedback(
        complaint_id=complaint.id,
        user_id=current_user.id,
        rating=fb_in.rating,
        comments=fb_in.comments
    )
    db.add(fb)
    db.commit()
    db.refresh(fb)
    return fb
