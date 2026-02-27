"""
Housing Pydantic schemas.
"""
from datetime import datetime

from pydantic import BaseModel, Field

from app.housing.models import RequestPriority, RequestStatus, RoomStatus, RoomType


# ─── Room ──────────────────────────────────────────────────
class RoomCreate(BaseModel):
    building: str
    floor: int
    room_number: str
    room_type: RoomType
    capacity: int = Field(..., ge=1)
    amenities: str | None = None


class RoomResponse(BaseModel):
    id: int
    building: str
    floor: int
    room_number: str
    room_type: RoomType
    capacity: int
    status: RoomStatus
    amenities: str | None
    model_config = {"from_attributes": True}


class RoomListResponse(BaseModel):
    rooms: list[RoomResponse]
    total: int


# ─── Assignment ────────────────────────────────────────────
class AssignmentCreate(BaseModel):
    room_id: int
    student_id: int


class AssignmentResponse(BaseModel):
    id: int
    room_id: int
    student_id: int
    assigned_at: datetime
    check_in: datetime | None
    check_out: datetime | None
    model_config = {"from_attributes": True}


# ─── Maintenance ───────────────────────────────────────────
class MaintenanceCreate(BaseModel):
    room_id: int
    title: str = Field(..., max_length=200)
    description: str
    priority: RequestPriority = RequestPriority.MEDIUM


class MaintenanceUpdate(BaseModel):
    status: RequestStatus | None = None
    priority: RequestPriority | None = None


class MaintenanceResponse(BaseModel):
    id: int
    room_id: int
    reported_by: int
    title: str
    description: str
    priority: RequestPriority
    status: RequestStatus
    created_at: datetime
    resolved_at: datetime | None
    model_config = {"from_attributes": True}
