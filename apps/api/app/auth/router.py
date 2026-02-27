"""
Authentication router: login, register, token refresh.
"""
import jwt
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.schemas import LoginRequest, RefreshRequest, RegisterRequest, TokenResponse
from app.core.database import get_db
from app.core.exceptions import UnauthorizedException
from app.core.security import create_access_token, create_refresh_token, decode_token, verify_password
from app.users.models import UserRole
from app.users.schemas import UserCreate, UserResponse
from app.users.service import create_user, get_user_by_email

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=TokenResponse)
async def login(data: LoginRequest, db: AsyncSession = Depends(get_db)):
    """Authenticate user and return JWT tokens."""
    user = await get_user_by_email(db, data.email)
    if not user or not verify_password(data.password, user.hashed_password):
        raise UnauthorizedException("Invalid email or password")
    if not user.is_active:
        raise UnauthorizedException("Account is deactivated")

    access_token = create_access_token({"sub": str(user.id), "role": user.role.value})
    refresh_token = create_refresh_token({"sub": str(user.id)})
    return TokenResponse(access_token=access_token, refresh_token=refresh_token)


@router.post("/register", response_model=UserResponse, status_code=201)
async def register(data: RegisterRequest, db: AsyncSession = Depends(get_db)):
    """Self-register as a student (default role)."""
    user_data = UserCreate(
        email=data.email,
        password=data.password,
        full_name=data.full_name,
        role=UserRole.STUDENT,
        enrollment_no=data.enrollment_no,
        department=data.department,
    )
    return await create_user(db, user_data)


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(data: RefreshRequest, db: AsyncSession = Depends(get_db)):
    """Exchange a valid refresh token for a new token pair."""
    try:
        payload = decode_token(data.refresh_token)
        if payload.get("type") != "refresh":
            raise UnauthorizedException("Invalid token type")
        user_id = payload.get("sub")
        if not user_id:
            raise UnauthorizedException("Invalid token")
    except jwt.ExpiredSignatureError:
        raise UnauthorizedException("Refresh token expired")
    except jwt.PyJWTError:
        raise UnauthorizedException("Invalid token")

    user = await get_user_by_email(db, user_id)
    if not user:
        # Fallback: user_id is stored as string ID
        from app.users.service import get_user_by_id
        user = await get_user_by_id(db, int(user_id))

    access_token = create_access_token({"sub": str(user.id), "role": user.role.value})
    new_refresh = create_refresh_token({"sub": str(user.id)})
    return TokenResponse(access_token=access_token, refresh_token=new_refresh)
