"""
Communication Pydantic schemas.
"""
from datetime import datetime

from pydantic import BaseModel, Field

from app.communication.models import LeaveStatus, LeaveType


# ─── Chat ──────────────────────────────────────────────────
class ChatRoomCreate(BaseModel):
    name: str = Field(..., max_length=200)
    room_type: str = "group"
    member_ids: list[int] = []


class ChatRoomResponse(BaseModel):
    id: int
    name: str
    room_type: str
    created_by: int
    created_at: datetime
    model_config = {"from_attributes": True}


class ChatMessageCreate(BaseModel):
    content: str = Field(..., min_length=1)


class ChatMessageResponse(BaseModel):
    id: int
    room_id: int
    sender_id: int
    content: str
    sent_at: datetime
    model_config = {"from_attributes": True}


class WSMessage(BaseModel):
    """WebSocket message format."""
    type: str = "message"  # "message", "typing", "read"
    content: str | None = None
    room_id: int | None = None


# ─── Leave ─────────────────────────────────────────────────
class LeaveCreate(BaseModel):
    leave_type: LeaveType
    start_date: str
    end_date: str
    reason: str


class LeaveUpdate(BaseModel):
    status: LeaveStatus


class LeaveResponse(BaseModel):
    id: int
    applicant_id: int
    leave_type: LeaveType
    start_date: str
    end_date: str
    reason: str
    status: LeaveStatus
    reviewed_by: int | None
    created_at: datetime
    model_config = {"from_attributes": True}
