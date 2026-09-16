from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# --- Auth Schemas ---
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: Optional[str] = "citizen"
    department_id: Optional[int] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: "UserOut"

class UserOut(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    department_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True

# --- Department Schemas ---
class DepartmentOut(BaseModel):
    id: int
    name: str
    code: str
    contact_email: Optional[str] = None
    description: Optional[str] = None

    class Config:
        from_attributes = True

# --- AI Prediction Schemas ---
class AIAnalysisRequest(BaseModel):
    title: str
    description: str

class AIAnalysisResponse(BaseModel):
    category: str
    priority: str
    suggested_department: str
    department_id: Optional[int] = None
    extracted_location: Optional[str] = None
    sentiment: str
    sla_hours: int

# --- Complaint Schemas ---
class ComplaintCreate(BaseModel):
    title: str
    description: str
    category: Optional[str] = None
    priority: Optional[str] = None
    department_id: Optional[int] = None
    location_name: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    image_url: Optional[str] = None

class ComplaintStatusUpdate(BaseModel):
    status: str
    update_text: str
    send_ai_response: Optional[bool] = True

class ComplaintUpdateOut(BaseModel):
    id: int
    complaint_id: int
    update_text: str
    status_from: Optional[str]
    status_to: str
    updated_by_user_id: int
    updated_by_name: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class FeedbackOut(BaseModel):
    id: int
    rating: int
    comments: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

class ComplaintOut(BaseModel):
    id: int
    user_id: int
    user_name: Optional[str] = None
    user_email: Optional[str] = None
    title: str
    description: str
    category: str
    priority: str
    status: str
    department_id: Optional[int] = None
    department_name: Optional[str] = None
    location_name: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    sentiment: str
    image_url: Optional[str] = None
    sla_hours: int
    is_duplicate: bool
    duplicate_of_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    resolved_at: Optional[datetime] = None
    updates: List[ComplaintUpdateOut] = []
    feedback: Optional[FeedbackOut] = None

    class Config:
        from_attributes = True

# --- Duplicate Alert Schema ---
class DuplicateCheckRequest(BaseModel):
    title: str
    description: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class DuplicateMatch(BaseModel):
    complaint_id: int
    title: str
    similarity_score: float
    status: str
    category: str
    created_at: datetime

# --- Admin Metrics & Analytics Schemas ---
class AdminMetrics(BaseModel):
    total_complaints: int
    pending_complaints: int
    in_progress_complaints: int
    resolved_complaints: int
    sla_breached_complaints: int

class CategoryCount(BaseModel):
    category: str
    count: int

class PriorityCount(BaseModel):
    priority: str
    count: int

class TrendData(BaseModel):
    date: str
    total: int
    resolved: int

class AnalyticsOut(BaseModel):
    metrics: AdminMetrics
    categories: List[CategoryCount]
    priorities: List[PriorityCount]
    trends: List[TrendData]
    avg_resolution_hours: float

# --- Feedback Create Schema ---
class FeedbackCreate(BaseModel):
    rating: int
    comments: Optional[str] = None

# --- Notification Schema ---
class NotificationOut(BaseModel):
    id: int
    user_id: int
    complaint_id: Optional[int]
    message: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True

Token.model_rebuild()
