import datetime
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.database import Base

class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    code = Column(String(20), unique=True, nullable=False)
    contact_email = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)

    users = relationship("User", back_populates="department")
    complaints = relationship("Complaint", back_populates="department")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(120), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(100), nullable=False)
    role = Column(String(20), default="citizen", nullable=False)  # "citizen", "admin", "staff"
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    department = relationship("Department", back_populates="users")
    complaints = relationship("Complaint", back_populates="user", foreign_keys="Complaint.user_id")
    updates = relationship("ComplaintUpdate", back_populates="updated_by")
    notifications = relationship("Notification", back_populates="user")
    feedbacks = relationship("Feedback", back_populates="user")


class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    
    # AI-derived or user-selected fields
    category = Column(String(50), nullable=False) # Infrastructure, Electricity, Water, Cleanliness, Transport, Academic, Security, Other
    priority = Column(String(20), nullable=False) # Low, Medium, High, Critical
    status = Column(String(20), default="Pending", nullable=False) # Pending, In Progress, Resolved, Rejected
    
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    location_name = Column(String(200), nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    sentiment = Column(String(20), default="Negative", nullable=False) # Positive, Neutral, Negative
    image_url = Column(String(500), nullable=True)
    sla_hours = Column(Integer, default=48, nullable=False)
    
    # Duplicate tracking
    is_duplicate = Column(Boolean, default=False)
    duplicate_of_id = Column(Integer, ForeignKey("complaints.id"), nullable=True)

    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)

    # Relationships
    user = relationship("User", back_populates="complaints", foreign_keys=[user_id])
    department = relationship("Department", back_populates="complaints")
    parent_complaint = relationship("Complaint", remote_side=[id], backref="duplicates")
    updates = relationship("ComplaintUpdate", back_populates="complaint", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="complaint", cascade="all, delete-orphan")
    feedback = relationship("Feedback", back_populates="complaint", uselist=False, cascade="all, delete-orphan")


class ComplaintUpdate(Base):
    __tablename__ = "complaint_updates"

    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(Integer, ForeignKey("complaints.id"), nullable=False)
    update_text = Column(Text, nullable=False)
    status_from = Column(String(20), nullable=True)
    status_to = Column(String(20), nullable=False)
    updated_by_user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    complaint = relationship("Complaint", back_populates="updates")
    updated_by = relationship("User", back_populates="updates")


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    complaint_id = Column(Integer, ForeignKey("complaints.id"), nullable=True)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="notifications")
    complaint = relationship("Complaint", back_populates="notifications")


class Feedback(Base):
    __tablename__ = "feedbacks"

    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(Integer, ForeignKey("complaints.id"), unique=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    rating = Column(Integer, nullable=False) # 1 to 5
    comments = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    complaint = relationship("Complaint", back_populates="feedback")
    user = relationship("User", back_populates="feedbacks")
