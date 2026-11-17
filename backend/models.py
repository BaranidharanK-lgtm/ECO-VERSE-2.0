"""
EcoVerse AI — Data Models
Supports both Pydantic (when installed) and Python standard library dataclasses.
"""
from typing import Optional, List, Dict, Any
from enum import Enum
from datetime import datetime

try:
    from pydantic import BaseModel, Field  # type: ignore
except ImportError:
    class BaseModel:
        def __init__(self, **kwargs):
            for k, v in kwargs.items():
                setattr(self, k, v)
        def dict(self):
            return self.__dict__

    def Field(*args, **kwargs):
        return kwargs.get('default', None)

class UserRole(str, Enum):
    STUDENT = "student"
    MAINTENANCE = "maintenance"
    ADMIN = "admin"

class IssueCategory(str, Enum):
    WATER = "water"
    ENERGY = "energy"
    WASTE = "waste"
    BIODIVERSITY = "biodiversity"
    MAINTENANCE = "maintenance"
    OTHER = "other"

class ReportStatus(str, Enum):
    SUBMITTED = "submitted"
    AI_ANALYSIS = "ai_analysis"
    AWAITING_ASSIGNMENT = "awaiting_assignment"
    ASSIGNED = "assigned"
    ACKNOWLEDGED = "acknowledged"
    IN_PROGRESS = "in_progress"
    AWAITING_VERIFICATION = "awaiting_verification"
    RESOLVED = "resolved"
    REOPENED = "reopened"

class UrgencyLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

# AI Analysis schema
class AIAnalysisResult(BaseModel):
    detected_category: IssueCategory
    confidence_score: float = Field(default=0.9, ge=0.0, le=1.0)
    urgency: UrgencyLevel
    suggested_department: str
    suggested_action: str
    evidence_summary: str
    requires_human_review: bool = False
    visual_keywords: List[str] = []

# Status history entry
class StatusHistoryEntry(BaseModel):
    id: str
    status: ReportStatus
    timestamp: str
    actor_name: str
    actor_role: UserRole
    comment: Optional[str] = None
    evidence_url: Optional[str] = None

# Report Create Request
class ReportCreateRequest(BaseModel):
    title: str = Field(default="", min_length=5, max_length=300)
    description: str = Field(default="", min_length=10)
    category: IssueCategory
    building: str
    location_details: str
    coord_x: Optional[float] = None
    coord_y: Optional[float] = None
    image_url: Optional[str] = None
    date_observed: str
    reporter_id: str
    reporter_name: str
    reporter_role: UserRole

# Report Response
class SustainabilityReportResponse(BaseModel):
    id: str
    title: str
    description: str
    category: IssueCategory
    building: str
    location_details: str
    coord_x: Optional[float] = None
    coord_y: Optional[float] = None
    image_url: Optional[str] = None
    date_observed: str
    date_reported: str
    reporter_id: str
    reporter_name: str
    reporter_role: UserRole
    status: ReportStatus
    assigned_department_id: Optional[str] = None
    assigned_department_name: Optional[str] = None
    urgency: UrgencyLevel
    ai_analysis: Optional[AIAnalysisResult] = None
    history: List[StatusHistoryEntry] = []
    resolution_evidence_url: Optional[str] = None
    resolution_notes: Optional[str] = None
    is_simulated: bool = True

# Status Update Request
class StatusUpdateRequest(BaseModel):
    new_status: ReportStatus
    actor_name: str
    actor_role: UserRole
    comment: Optional[str] = None
    evidence_url: Optional[str] = None

# Department
class DepartmentResponse(BaseModel):
    id: str
    name: str
    code: str
    lead_person: str
    contact_email: str
    active_staff_count: int
    open_tickets: int
    avg_resolution_hours: float
    categories_handled: List[IssueCategory]

# Waste Bin
class WasteBinResponse(BaseModel):
    id: str
    location: str
    building: str
    type: str
    fullness: int
    status: str
    collection_priority: str
    coordinates: Dict[str, float]

# Copilot Query Request
class CopilotQueryRequest(BaseModel):
    query: str
    current_role: UserRole = UserRole.STUDENT
    page_context: Optional[str] = "overview"

class CopilotQueryResponse(BaseModel):
    response_text: str
    sources_consulted: List[str]
    suggested_chips: List[str]
    is_simulated_notice: str = "Insight derived from campus demonstration telemetry."
