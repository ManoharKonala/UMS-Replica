"""
UMS API – Main Application Entry Point.

Assembles all routers, middleware, and lifecycle events.
"""
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import get_settings
from app.core.database import engine, Base

# Import all models so Alembic / create_all can see them
from app.users import models as _user_models  # noqa: F401
from app.academics import models as _academic_models  # noqa: F401
from app.housing import models as _housing_models  # noqa: F401
from app.communication import models as _comm_models  # noqa: F401

# Import routers
from app.auth.router import router as auth_router
from app.users.router import router as users_router
from app.academics.router import router as academics_router
from app.housing.router import router as housing_router
from app.communication.router import router as communication_router

settings = get_settings()
logger = logging.getLogger("ums")



# ─── Lifecycle ─────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create tables on startup (dev convenience). Use Alembic in production."""
    logger.info("🚀 Starting UMS API v%s", settings.APP_VERSION)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("✅ Database tables ensured")
    yield
    await engine.dispose()
    logger.info("🛑 UMS API shut down")


# ─── App Factory ───────────────────────────────────────────
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="University Management System – Industrial Grade API",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# ─── Middleware ────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    # allow_origins=settings.CORS_ORIGINS,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Global Exception Handler ─────────────────────────────
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error("Unhandled exception: %s", str(exc), exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"},
    )


# ─── Health Check ──────────────────────────────────────────
@app.get("/health", tags=["System"])
async def health_check():
    return {
        "status": "healthy",
        "version": settings.APP_VERSION,
        "service": settings.APP_NAME,
    }


# ─── Register Routers ─────────────────────────────────────
app.include_router(auth_router, prefix=settings.API_PREFIX)
app.include_router(users_router, prefix=settings.API_PREFIX)
app.include_router(academics_router, prefix=settings.API_PREFIX)
app.include_router(housing_router, prefix=settings.API_PREFIX)
app.include_router(communication_router, prefix=settings.API_PREFIX)


@app.get("/", tags=["System"])
async def root():
    return {
        "message": "UMS API – University Management System",
        "docs": "/docs",
        "version": settings.APP_VERSION,
    }
