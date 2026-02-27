"""
Housing (RMS) routes.
"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import CurrentUser, require_role
from app.housing import service
from app.housing.models import RequestStatus, RoomStatus
from app.housing.schemas import (
    AssignmentCreate, AssignmentResponse,
    MaintenanceCreate, MaintenanceResponse, MaintenanceUpdate,
    RoomCreate, RoomListResponse, RoomResponse,
)
from app.users.models import UserRole

router = APIRouter(prefix="/housing", tags=["Housing (RMS)"])


# ─── Rooms ─────────────────────────────────────────────────
@router.post("/rooms", response_model=RoomResponse, status_code=201)
async def create_room(
    data: RoomCreate,
    db: AsyncSession = Depends(get_db),
    _admin: None = Depends(require_role(UserRole.ADMIN)),
):
    return await service.create_room(db, data)


@router.get("/rooms", response_model=RoomListResponse)
async def list_rooms(
    _user: CurrentUser,
    building: str | None = None,
    status: RoomStatus | None = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    rooms, total = await service.list_rooms(db, building, status, skip, limit)
    return RoomListResponse(rooms=rooms, total=total)


# ─── Assignments ───────────────────────────────────────────
@router.post("/assign", response_model=AssignmentResponse, status_code=201)
async def assign_room(
    data: AssignmentCreate,
    db: AsyncSession = Depends(get_db),
    _admin: None = Depends(require_role(UserRole.ADMIN)),
):
    return await service.assign_room(db, data)


@router.get("/my-room", response_model=AssignmentResponse | None)
async def get_my_room(
    current_user: CurrentUser,
    db: AsyncSession = Depends(get_db),
):
    return await service.get_student_room(db, current_user.id)


# ─── Maintenance ───────────────────────────────────────────
@router.post("/maintenance", response_model=MaintenanceResponse, status_code=201)
async def create_maintenance_request(
    data: MaintenanceCreate,
    current_user: CurrentUser,
    db: AsyncSession = Depends(get_db),
):
    return await service.create_maintenance_request(db, data, current_user.id)


@router.patch("/maintenance/{request_id}", response_model=MaintenanceResponse)
async def update_maintenance(
    request_id: int,
    data: MaintenanceUpdate,
    db: AsyncSession = Depends(get_db),
    _admin: None = Depends(require_role(UserRole.ADMIN)),
):
    return await service.update_maintenance_request(db, request_id, data)


@router.get("/maintenance", response_model=list[MaintenanceResponse])
async def list_maintenance(
    _user: CurrentUser,
    room_id: int | None = None,
    status: RequestStatus | None = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    requests, _ = await service.list_maintenance_requests(db, room_id, status, skip, limit)
    return requests
