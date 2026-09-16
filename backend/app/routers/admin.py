import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Dict, Any

from app.database import get_db
from app import models, schemas, auth
from app.ai.summarizer import generate_cluster_summary

router = APIRouter(prefix="/admin", tags=["Admin Dashboard"])

@router.get("/metrics", response_model=schemas.AdminMetrics)
def get_metrics(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_admin)
):
    total = db.query(models.Complaint).count()
    pending = db.query(models.Complaint).filter(models.Complaint.status == "Pending").count()
    in_progress = db.query(models.Complaint).filter(models.Complaint.status == "In Progress").count()
    resolved = db.query(models.Complaint).filter(models.Complaint.status == "Resolved").count()

    # Calculate SLA breaches
    now = datetime.datetime.utcnow()
    all_unresolved = db.query(models.Complaint).filter(models.Complaint.status.in_(["Pending", "In Progress"])).all()
    sla_breached = 0
    for c in all_unresolved:
        hours_open = (now - c.created_at).total_seconds() / 3600.0
        if hours_open > c.sla_hours:
            sla_breached += 1

    return schemas.AdminMetrics(
        total_complaints=total,
        pending_complaints=pending,
        in_progress_complaints=in_progress,
        resolved_complaints=resolved,
        sla_breached_complaints=sla_breached
    )

@router.get("/analytics", response_model=schemas.AnalyticsOut)
def get_analytics(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_admin)
):
    metrics = get_metrics(db=db, current_user=current_user)

    # Categories breakdown
    cat_counts = db.query(
        models.Complaint.category, func.count(models.Complaint.id)
    ).group_by(models.Complaint.category).all()
    categories = [schemas.CategoryCount(category=cat, count=cnt) for cat, cnt in cat_counts]

    # Priorities breakdown
    prio_counts = db.query(
        models.Complaint.priority, func.count(models.Complaint.id)
    ).group_by(models.Complaint.priority).all()
    priorities = [schemas.PriorityCount(priority=prio, count=cnt) for prio, cnt in prio_counts]

    # Trend calculation (last 7 days)
    trends = []
    today = datetime.date.today()
    for i in range(6, -1, -1):
        day = today - datetime.timedelta(days=i)
        day_str = day.strftime("%b %d")
        
        day_start = datetime.datetime.combine(day, datetime.time.min)
        day_end = datetime.datetime.combine(day, datetime.time.max)

        day_total = db.query(models.Complaint).filter(
            models.Complaint.created_at >= day_start,
            models.Complaint.created_at <= day_end
        ).count()

        day_resolved = db.query(models.Complaint).filter(
            models.Complaint.resolved_at >= day_start,
            models.Complaint.resolved_at <= day_end
        ).count()

        trends.append(schemas.TrendData(date=day_str, total=day_total, resolved=day_resolved))

    # Avg resolution time
    resolved_complaints = db.query(models.Complaint).filter(
        models.Complaint.status == "Resolved",
        models.Complaint.resolved_at.isnot(None)
    ).all()
    
    avg_hours = 0.0
    if resolved_complaints:
        durations = [(c.resolved_at - c.created_at).total_seconds() / 3600.0 for c in resolved_complaints]
        avg_hours = round(sum(durations) / len(durations), 1)

    return schemas.AnalyticsOut(
        metrics=metrics,
        categories=categories,
        priorities=priorities,
        trends=trends,
        avg_resolution_hours=avg_hours
    )

@router.get("/heatmap")
def get_heatmap_points(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_admin)
):
    complaints = db.query(models.Complaint).all()
    points = []
    for c in complaints:
        weight = 0.4
        if c.priority == "Critical":
            weight = 1.0
        elif c.priority == "High":
            weight = 0.8
        elif c.priority == "Medium":
            weight = 0.6
        
        points.append({
            "id": c.id,
            "title": c.title,
            "lat": c.latitude or 12.9716,
            "lng": c.longitude or 77.5946,
            "weight": weight,
            "priority": c.priority,
            "category": c.category,
            "status": c.status,
            "location_name": c.location_name
        })
    return points

@router.get("/duplicate-clusters")
def get_duplicate_clusters(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_admin)
):
    # Group complaints that are duplicates
    parents = db.query(models.Complaint).filter(models.Complaint.duplicate_of_id.is_(None)).all()
    clusters = []

    for p in parents:
        dupes = db.query(models.Complaint).filter(models.Complaint.duplicate_of_id == p.id).all()
        if dupes:
            group = [
                {
                    "id": p.id,
                    "title": p.title,
                    "description": p.description,
                    "category": p.category,
                    "priority": p.priority,
                    "location_name": p.location_name,
                    "status": p.status,
                    "created_at": p.created_at.strftime("%Y-%m-%d %H:%M")
                }
            ] + [
                {
                    "id": d.id,
                    "title": d.title,
                    "description": d.description,
                    "category": d.category,
                    "priority": d.priority,
                    "location_name": d.location_name,
                    "status": d.status,
                    "created_at": d.created_at.strftime("%Y-%m-%d %H:%M")
                }
                for d in dupes
            ]

            summary = generate_cluster_summary(group)
            clusters.append({
                "parent_id": p.id,
                "parent_title": p.title,
                "cluster_size": len(group),
                "ai_summary": summary,
                "complaints": group
            })

    return clusters
