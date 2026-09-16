import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app import models, schemas, auth
from app.ai.classifier import analyze_complaint_text
from app.ai.similarity import find_duplicates_for_complaint
from app.ai.summarizer import generate_ai_response

router = APIRouter(prefix="/complaints", tags=["Complaints"])

@router.post("/ai-analyze", response_model=schemas.AIAnalysisResponse)
def analyze_complaint(data: schemas.AIAnalysisRequest, db: Session = Depends(get_db)):
    analysis = analyze_complaint_text(data.title, data.description)
    dept_code = analysis["suggested_department"]
    department = db.query(models.Department).filter(models.Department.code == dept_code).first()
    
    return schemas.AIAnalysisResponse(
        category=analysis["category"],
        priority=analysis["priority"],
        suggested_department=department.name if department else "General Maintenance",
        department_id=department.id if department else None,
        extracted_location=analysis["extracted_location"],
        sentiment=analysis["sentiment"],
        sla_hours=analysis["sla_hours"]
    )

@router.post("/check-duplicates", response_model=List[schemas.DuplicateMatch])
def check_duplicates(data: schemas.DuplicateCheckRequest, db: Session = Depends(get_db)):
    open_complaints = db.query(models.Complaint).filter(
        models.Complaint.status.in_(["Pending", "In Progress"])
    ).all()
    
    candidates = [
        {
            "complaint_id": c.id,
            "title": c.title,
            "description": c.description,
            "status": c.status,
            "category": c.category,
            "created_at": c.created_at
        }
        for c in open_complaints
    ]
    
    matches = find_duplicates_for_complaint(data.title, data.description, candidates, threshold=0.35)
    return matches[:5]

@router.post("", response_model=schemas.ComplaintOut)
def create_complaint(
    complaint_in: schemas.ComplaintCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    analysis = analyze_complaint_text(complaint_in.title, complaint_in.description)

    category = complaint_in.category or analysis["category"]
    priority = complaint_in.priority or analysis["priority"]
    location_name = complaint_in.location_name or analysis["extracted_location"]
    
    dept_id = complaint_in.department_id
    if not dept_id:
        dept = db.query(models.Department).filter(models.Department.code == analysis["suggested_department"]).first()
        if dept:
            dept_id = dept.id
        else:
            first_dept = db.query(models.Department).first()
            dept_id = first_dept.id if first_dept else None

    # Check for duplicate
    open_complaints = db.query(models.Complaint).filter(
        models.Complaint.status.in_(["Pending", "In Progress"])
    ).all()
    candidates = [
        {"complaint_id": c.id, "title": c.title, "description": c.description}
        for c in open_complaints
    ]
    matches = find_duplicates_for_complaint(complaint_in.title, complaint_in.description, candidates, threshold=0.55)
    
    is_duplicate = len(matches) > 0
    duplicate_of_id = matches[0]["complaint_id"] if is_duplicate else None

    db_complaint = models.Complaint(
        user_id=current_user.id,
        title=complaint_in.title,
        description=complaint_in.description,
        category=category,
        priority=priority,
        status="Pending",
        department_id=dept_id,
        location_name=location_name,
        latitude=complaint_in.latitude or 12.9716, # Default realistic city/campus center lat
        longitude=complaint_in.longitude or 77.5946, # Default lng
        sentiment=analysis["sentiment"],
        image_url=complaint_in.image_url,
        sla_hours=analysis["sla_hours"],
        is_duplicate=is_duplicate,
        duplicate_of_id=duplicate_of_id
    )
    db.add(db_complaint)
    db.commit()
    db.refresh(db_complaint)

    # Initial update history entry
    initial_update = models.ComplaintUpdate(
        complaint_id=db_complaint.id,
        update_text="Complaint received and registered via AI classifier.",
        status_from=None,
        status_to="Pending",
        updated_by_user_id=current_user.id
    )
    db.add(initial_update)

    # User notification
    notif = models.Notification(
        user_id=current_user.id,
        complaint_id=db_complaint.id,
        message=f"Complaint '{db_complaint.title}' created successfully. AI SLA: {db_complaint.sla_hours}h."
    )
    db.add(notif)
    db.commit()
    db.refresh(db_complaint)

    return _format_complaint(db_complaint)

@router.get("", response_model=List[schemas.ComplaintOut])
def list_complaints(
    status_filter: Optional[str] = Query(None, alias="status"),
    category_filter: Optional[str] = Query(None, alias="category"),
    my_only: bool = False,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    query = db.query(models.Complaint)

    if current_user.role == "citizen" or my_only:
        query = query.filter(models.Complaint.user_id == current_user.id)
    elif current_user.role == "staff" and current_user.department_id:
        query = query.filter(models.Complaint.department_id == current_user.department_id)

    if status_filter:
        query = query.filter(models.Complaint.status == status_filter)
    if category_filter:
        query = query.filter(models.Complaint.category == category_filter)

    complaints = query.order_by(models.Complaint.created_at.desc()).all()
    return [_format_complaint(c) for c in complaints]

@router.get("/{complaint_id}", response_model=schemas.ComplaintOut)
def get_complaint(
    complaint_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    complaint = db.query(models.Complaint).filter(models.Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    
    if current_user.role == "citizen" and complaint.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    return _format_complaint(complaint)

@router.put("/{complaint_id}/status", response_model=schemas.ComplaintOut)
def update_complaint_status(
    complaint_id: int,
    status_in: schemas.ComplaintStatusUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_admin)
):
    complaint = db.query(models.Complaint).filter(models.Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    old_status = complaint.status
    complaint.status = status_in.status
    if status_in.status == "Resolved":
        complaint.resolved_at = datetime.datetime.utcnow()
    
    update_msg = status_in.update_text
    dept_name = complaint.department.name if complaint.department else "Maintenance"
    
    if status_in.send_ai_response and not update_msg.strip():
        update_msg = generate_ai_response(status_in.status, complaint.category, dept_name, complaint.title)

    update = models.ComplaintUpdate(
        complaint_id=complaint.id,
        update_text=update_msg,
        status_from=old_status,
        status_to=status_in.status,
        updated_by_user_id=current_user.id
    )
    db.add(update)

    # Notify Citizen
    notif = models.Notification(
        user_id=complaint.user_id,
        complaint_id=complaint.id,
        message=f"Status update for '{complaint.title}': {status_in.status}. {update_msg}"
    )
    db.add(notif)
    
    db.commit()
    db.refresh(complaint)
    return _format_complaint(complaint)


def _format_complaint(c: models.Complaint) -> schemas.ComplaintOut:
    updates_out = [
        schemas.ComplaintUpdateOut(
            id=u.id,
            complaint_id=u.complaint_id,
            update_text=u.update_text,
            status_from=u.status_from,
            status_to=u.status_to,
            updated_by_user_id=u.updated_by_user_id,
            updated_by_name=u.updated_by.full_name if u.updated_by else "System",
            created_at=u.created_at
        )
        for u in sorted(c.updates, key=lambda x: x.created_at, reverse=True)
    ]

    fb_out = None
    if c.feedback:
        fb_out = schemas.FeedbackOut(
            id=c.feedback.id,
            rating=c.feedback.rating,
            comments=c.feedback.comments,
            created_at=c.feedback.created_at
        )

    return schemas.ComplaintOut(
        id=c.id,
        user_id=c.user_id,
        user_name=c.user.full_name if c.user else "Citizen",
        user_email=c.user.email if c.user else None,
        title=c.title,
        description=c.description,
        category=c.category,
        priority=c.priority,
        status=c.status,
        department_id=c.department_id,
        department_name=c.department.name if c.department else "Unassigned",
        location_name=c.location_name,
        latitude=c.latitude,
        longitude=c.longitude,
        sentiment=c.sentiment,
        image_url=c.image_url,
        sla_hours=c.sla_hours,
        is_duplicate=c.is_duplicate,
        duplicate_of_id=c.duplicate_of_id,
        created_at=c.created_at,
        updated_at=c.updated_at,
        resolved_at=c.resolved_at,
        updates=updates_out,
        feedback=fb_out
    )
