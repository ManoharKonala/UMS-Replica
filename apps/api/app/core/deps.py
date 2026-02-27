"""
FastAPI dependencies: authentication, authorization, DB session.
"""
from typing import Annotated

import jwt
from fastapi import Depends, Header
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.core.database import get_db
from app.core.exceptions import ForbiddenException, UnauthorizedException
from app.core.security import decode_token
from app.users.models import User, UserRole

settings = get_settings()


async def get_current_user(
    authorization: Annotated[str, Header()],
    db: AsyncSession = Depends(get_db),
) -> User:
    """Extract and validate the current user from the Authorization header."""
    if not authorization.startswith("Bearer "):
        raise UnauthorizedException("Invalid authorization header format")

    token = authorization.removeprefix("Bearer ")
    try:
        payload = decode_token(token)
        if payload.get("type") != "access":
            raise UnauthorizedException("Invalid token type")
        user_id: str | None = payload.get("sub")
        if user_id is None:
            raise UnauthorizedException("Token missing subject claim")
    except jwt.ExpiredSignatureError:
        raise UnauthorizedException("Token has expired")
    except jwt.PyJWTError:
        raise UnauthorizedException("Could not validate token")

    result = await db.execute(select(User).where(User.id == int(user_id)))
    user = result.scalar_one_or_none()
    if user is None:
        raise UnauthorizedException("User not found")
    if not user.is_active:
        raise ForbiddenException("User account is deactivated")
    return user


CurrentUser = Annotated[User, Depends(get_current_user)]


def require_role(*roles: UserRole):
    """Dependency factory: ensures current user has one of the allowed roles."""
    async def _check_role(user: CurrentUser) -> User:
        if user.role not in roles:
            raise ForbiddenException(
                f"Role '{user.role.value}' not allowed. Required: {[r.value for r in roles]}"
            )
        return user
    return _check_role
