"""
User Pydantic schemas for request/response validation.
"""
from datetime import datetime

from pydantic import BaseModel, EmailStr, Field

from app.users.models import UserRole


# ─── Request Schemas ───────────────────────────────────────
class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)
    full_name: str = Field(..., min_length=2, max_length=150)
    role: UserRole = UserRole.STUDENT
    enrollment_no: str | None = None
    department: str | None = None
    phone: str | None = None


class UserUpdate(BaseModel):
    full_name: str | None = None
    department: str | None = None
    phone: str | None = None
    avatar_url: str | None = None


# ─── Response Schemas ──────────────────────────────────────
class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    role: UserRole
    enrollment_no: str | None = None
    department: str | None = None
    phone: str | None = None
    avatar_url: str | None = None
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class UserListResponse(BaseModel):
    users: list[UserResponse]
    total: int
