"""
Housing service: room management, assignments, maintenance.
"""
from datetime import datetime, timezone

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import ConflictException, NotFoundException
from app.housing.models import (
    MaintenanceRequest, RequestStatus, Room, RoomAssignment, RoomStatus,
)
from app.housing.schemas import (
    AssignmentCreate, MaintenanceCreate, MaintenanceUpdate, RoomCreate,
)


# ─── Rooms ─────────────────────────────────────────────────
async def create_room(db: AsyncSession, data: RoomCreate) -> Room:
    existing = await db.execute(select(Room).where(Room.room_number == data.room_number))
    if existing.scalar_one_or_none():
        raise ConflictException(f"Room {data.room_number} already exists")
    room = Room(**data.model_dump())
    db.add(room)
    await db.flush()
    await db.refresh(room)
    return room


async def list_rooms(
    db: AsyncSession, building: str | None = None, status: RoomStatus | None = None,
    skip: int = 0, limit: int = 50,
) -> tuple[list[Room], int]:
    query = select(Room)
    count_q = select(func.count(Room.id))
    if building:
        query = query.where(Room.building == building)
        count_q = count_q.where(Room.building == building)
    if status:
        query = query.where(Room.status == status)
        count_q = count_q.where(Room.status == status)
    total = (await db.execute(count_q)).scalar() or 0
    result = await db.execute(query.offset(skip).limit(limit))
    return list(result.scalars().all()), total


# ─── Assignments ───────────────────────────────────────────
async def assign_room(db: AsyncSession, data: AssignmentCreate) -> RoomAssignment:
    room_result = await db.execute(select(Room).where(Room.id == data.room_id))
    room = room_result.scalar_one_or_none()
    if not room:
        raise NotFoundException("Room")
    if room.status != RoomStatus.AVAILABLE:
        raise ConflictException("Room is not available")

    assignment = RoomAssignment(room_id=data.room_id, student_id=data.student_id)
    db.add(assignment)
    room.status = RoomStatus.OCCUPIED
    await db.flush()
    await db.refresh(assignment)
    return assignment


async def get_student_room(db: AsyncSession, student_id: int) -> RoomAssignment | None:
    result = await db.execute(
        select(RoomAssignment)
        .where(RoomAssignment.student_id == student_id, RoomAssignment.check_out == None)
    )
    return result.scalar_one_or_none()


# ─── Maintenance ───────────────────────────────────────────
async def create_maintenance_request(
    db: AsyncSession, data: MaintenanceCreate, reported_by: int
) -> MaintenanceRequest:
    request = MaintenanceRequest(
        room_id=data.room_id,
        reported_by=reported_by,
        title=data.title,
        description=data.description,
        priority=data.priority,
    )
    db.add(request)
    await db.flush()
    await db.refresh(request)
    return request


async def update_maintenance_request(
    db: AsyncSession, request_id: int, data: MaintenanceUpdate
) -> MaintenanceRequest:
    result = await db.execute(
        select(MaintenanceRequest).where(MaintenanceRequest.id == request_id)
    )
    req = result.scalar_one_or_none()
    if not req:
        raise NotFoundException("Maintenance request")

    if data.status:
        req.status = data.status
        if data.status == RequestStatus.RESOLVED:
            req.resolved_at = datetime.now(timezone.utc)
    if data.priority:
        req.priority = data.priority
    await db.flush()
    await db.refresh(req)
    return req


async def list_maintenance_requests(
    db: AsyncSession, room_id: int | None = None, status: RequestStatus | None = None,
    skip: int = 0, limit: int = 50,
) -> tuple[list[MaintenanceRequest], int]:
    query = select(MaintenanceRequest)
    count_q = select(func.count(MaintenanceRequest.id))
    if room_id:
        query = query.where(MaintenanceRequest.room_id == room_id)
        count_q = count_q.where(MaintenanceRequest.room_id == room_id)
    if status:
        query = query.where(MaintenanceRequest.status == status)
        count_q = count_q.where(MaintenanceRequest.status == status)
    total = (await db.execute(count_q)).scalar() or 0
    result = await db.execute(query.offset(skip).limit(limit).order_by(MaintenanceRequest.created_at.desc()))
    return list(result.scalars().all()), total
