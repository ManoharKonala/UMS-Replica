"""
User management routes.
"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import CurrentUser, require_role
from app.users.models import UserRole
from app.users.schemas import UserCreate, UserListResponse, UserResponse, UserUpdate
from app.users import service

router = APIRouter(prefix="/users", tags=["Users"])


@router.post("/", response_model=UserResponse, status_code=201)
async def create_user(
    data: UserCreate,
    db: AsyncSession = Depends(get_db),
    _admin: None = Depends(require_role(UserRole.ADMIN)),
):
    """Admin-only: create a new user."""
    user = await service.create_user(db, data)
    return user


@router.get("/me", response_model=UserResponse)
async def get_current_profile(current_user: CurrentUser):
    """Get the authenticated user's profile."""
    return current_user


@router.patch("/me", response_model=UserResponse)
async def update_own_profile(
    data: UserUpdate,
    current_user: CurrentUser,
    db: AsyncSession = Depends(get_db),
):
    """Update the authenticated user's profile."""
    return await service.update_user(db, current_user.id, data)


@router.get("/", response_model=UserListResponse)
async def list_users(
    role: UserRole | None = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    _admin: None = Depends(require_role(UserRole.ADMIN)),
):
    """Admin-only: list all users with optional role filtering."""
    users, total = await service.list_users(db, role=role, skip=skip, limit=limit)
    return UserListResponse(users=users, total=total)


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    _admin: None = Depends(require_role(UserRole.ADMIN)),
):
    """Admin-only: get a user by ID."""
    return await service.get_user_by_id(db, user_id)


@router.delete("/{user_id}", response_model=UserResponse)
async def deactivate_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    _admin: None = Depends(require_role(UserRole.ADMIN)),
):
    """Admin-only: deactivate a user account (soft delete)."""
    return await service.deactivate_user(db, user_id)
