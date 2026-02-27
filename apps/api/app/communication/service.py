"""
Communication service: chat CRUD, WebSocket manager, leave management.
"""
from collections import defaultdict

from fastapi import WebSocket
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.communication.models import (
    ChatMessage, ChatRoom, ChatRoomMember, Leave, LeaveStatus,
)
from app.communication.schemas import ChatRoomCreate, LeaveCreate, LeaveUpdate
from app.core.exceptions import ForbiddenException, NotFoundException


# ─── WebSocket Connection Manager ──────────────────────────
class ConnectionManager:
    """Manages active WebSocket connections per chat room."""

    def __init__(self):
        self.active_connections: dict[int, list[WebSocket]] = defaultdict(list)

    async def connect(self, websocket: WebSocket, room_id: int):
        await websocket.accept()
        self.active_connections[room_id].append(websocket)

    def disconnect(self, websocket: WebSocket, room_id: int):
        self.active_connections[room_id].remove(websocket)
        if not self.active_connections[room_id]:
            del self.active_connections[room_id]

    async def broadcast(self, room_id: int, message: dict):
        for connection in self.active_connections.get(room_id, []):
            try:
                await connection.send_json(message)
            except Exception:
                pass  # silently skip disconnected clients


manager = ConnectionManager()


# ─── Chat Rooms ────────────────────────────────────────────
async def create_chat_room(
    db: AsyncSession, data: ChatRoomCreate, created_by: int
) -> ChatRoom:
    room = ChatRoom(name=data.name, room_type=data.room_type, created_by=created_by)
    db.add(room)
    await db.flush()

    # Add creator as member
    db.add(ChatRoomMember(room_id=room.id, user_id=created_by))
    # Add other members
    for member_id in data.member_ids:
        if member_id != created_by:
            db.add(ChatRoomMember(room_id=room.id, user_id=member_id))

    await db.flush()
    await db.refresh(room)
    return room


async def get_user_rooms(db: AsyncSession, user_id: int) -> list[ChatRoom]:
    result = await db.execute(
        select(ChatRoom)
        .join(ChatRoomMember, ChatRoomMember.room_id == ChatRoom.id)
        .where(ChatRoomMember.user_id == user_id)
    )
    return list(result.scalars().all())


async def get_room_messages(
    db: AsyncSession, room_id: int, skip: int = 0, limit: int = 50
) -> list[ChatMessage]:
    result = await db.execute(
        select(ChatMessage)
        .where(ChatMessage.room_id == room_id)
        .order_by(ChatMessage.sent_at.desc())
        .offset(skip)
        .limit(limit)
    )
    return list(result.scalars().all())


async def save_message(
    db: AsyncSession, room_id: int, sender_id: int, content: str
) -> ChatMessage:
    msg = ChatMessage(room_id=room_id, sender_id=sender_id, content=content)
    db.add(msg)
    await db.flush()
    await db.refresh(msg)
    return msg


# ─── Leave Management ─────────────────────────────────────
async def apply_leave(db: AsyncSession, data: LeaveCreate, applicant_id: int) -> Leave:
    leave = Leave(
        applicant_id=applicant_id,
        leave_type=data.leave_type,
        start_date=data.start_date,
        end_date=data.end_date,
        reason=data.reason,
    )
    db.add(leave)
    await db.flush()
    await db.refresh(leave)
    return leave


async def review_leave(
    db: AsyncSession, leave_id: int, data: LeaveUpdate, reviewed_by: int
) -> Leave:
    result = await db.execute(select(Leave).where(Leave.id == leave_id))
    leave = result.scalar_one_or_none()
    if not leave:
        raise NotFoundException("Leave request")
    leave.status = data.status
    leave.reviewed_by = reviewed_by
    await db.flush()
    await db.refresh(leave)
    return leave


async def get_leaves(
    db: AsyncSession, user_id: int | None = None, status: LeaveStatus | None = None,
    skip: int = 0, limit: int = 50,
) -> list[Leave]:
    query = select(Leave)
    if user_id:
        query = query.where(Leave.applicant_id == user_id)
    if status:
        query = query.where(Leave.status == status)
    result = await db.execute(query.order_by(Leave.created_at.desc()).offset(skip).limit(limit))
    return list(result.scalars().all())
