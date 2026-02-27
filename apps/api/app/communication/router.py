"""
Communication routes: chat (REST + WebSocket) and leave management.
"""
import json

from fastapi import APIRouter, Depends, Query, WebSocket, WebSocketDisconnect
from sqlalchemy.ext.asyncio import AsyncSession

from app.communication import service
from app.communication.models import LeaveStatus
from app.communication.schemas import (
    ChatMessageResponse, ChatRoomCreate, ChatRoomResponse,
    LeaveCreate, LeaveResponse, LeaveUpdate,
)
from app.communication.service import manager
from app.core.database import get_db
from app.core.deps import CurrentUser, require_role
from app.users.models import UserRole

router = APIRouter(prefix="/communication", tags=["Communication"])


# ─── Chat REST ─────────────────────────────────────────────
@router.post("/rooms", response_model=ChatRoomResponse, status_code=201)
async def create_room(
    data: ChatRoomCreate,
    current_user: CurrentUser,
    db: AsyncSession = Depends(get_db),
):
    return await service.create_chat_room(db, data, current_user.id)


@router.get("/rooms", response_model=list[ChatRoomResponse])
async def list_my_rooms(
    current_user: CurrentUser,
    db: AsyncSession = Depends(get_db),
):
    return await service.get_user_rooms(db, current_user.id)


@router.get("/rooms/{room_id}/messages", response_model=list[ChatMessageResponse])
async def get_messages(
    room_id: int,
    _user: CurrentUser,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    return await service.get_room_messages(db, room_id, skip, limit)


# ─── Chat WebSocket ───────────────────────────────────────
@router.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: int):
    """Real-time chat via WebSocket."""
    await manager.connect(websocket, room_id)
    try:
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)
            # Broadcast to all connected clients in the room
            await manager.broadcast(room_id, {
                "type": "message",
                "sender_id": payload.get("sender_id"),
                "content": payload.get("content"),
                "room_id": room_id,
            })
    except WebSocketDisconnect:
        manager.disconnect(websocket, room_id)


# ─── Leave Management ─────────────────────────────────────
@router.post("/leaves", response_model=LeaveResponse, status_code=201)
async def apply_leave(
    data: LeaveCreate,
    current_user: CurrentUser,
    db: AsyncSession = Depends(get_db),
):
    return await service.apply_leave(db, data, current_user.id)


@router.patch("/leaves/{leave_id}", response_model=LeaveResponse)
async def review_leave(
    leave_id: int,
    data: LeaveUpdate,
    current_user: CurrentUser,
    db: AsyncSession = Depends(get_db),
    _faculty: None = Depends(require_role(UserRole.ADMIN, UserRole.FACULTY)),
):
    return await service.review_leave(db, leave_id, data, current_user.id)


@router.get("/leaves", response_model=list[LeaveResponse])
async def list_leaves(
    current_user: CurrentUser,
    status: LeaveStatus | None = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    """Students see own leaves, admin/faculty see all."""
    user_id = current_user.id if current_user.role == UserRole.STUDENT else None
    return await service.get_leaves(db, user_id, status, skip, limit)


@router.get("/leaves/me", response_model=list[LeaveResponse])
async def my_leaves(
    current_user: CurrentUser,
    db: AsyncSession = Depends(get_db),
):
    return await service.get_leaves(db, current_user.id)
