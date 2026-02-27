"""
Academic routes: courses, attendance, results, timetable.
"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.academics import service
from app.academics.schemas import (
    AttendanceBulkCreate, AttendanceCreate, AttendanceResponse, AttendanceSummary,
    CourseCreate, CourseListResponse, CourseResponse,
    ResultCreate, ResultResponse,
    TimetableSlotCreate, TimetableSlotResponse,
)
from app.core.database import get_db
from app.core.deps import CurrentUser, require_role
from app.users.models import UserRole

router = APIRouter(prefix="/academics", tags=["Academics"])


# ─── Courses ───────────────────────────────────────────────
@router.post("/courses", response_model=CourseResponse, status_code=201)
async def create_course(
    data: CourseCreate,
    db: AsyncSession = Depends(get_db),
    _admin: None = Depends(require_role(UserRole.ADMIN)),
):
    return await service.create_course(db, data)


@router.get("/courses", response_model=CourseListResponse)
async def list_courses(
    _user: CurrentUser,
    department: str | None = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    courses, total = await service.list_courses(db, department, skip, limit)
    return CourseListResponse(courses=courses, total=total)


@router.get("/courses/{course_id}", response_model=CourseResponse)
async def get_course(
    course_id: int,
    _user: CurrentUser,
    db: AsyncSession = Depends(get_db),
):
    return await service.get_course(db, course_id)


# ─── Enrollment ───────────────────────────────────────────
@router.post("/enroll/{course_id}", status_code=201)
async def enroll_in_course(
    course_id: int,
    current_user: CurrentUser,
    db: AsyncSession = Depends(get_db),
):
    enrollment = await service.enroll_student(db, current_user.id, course_id)
    return {"message": "Enrolled successfully", "enrollment_id": enrollment.id}


@router.get("/my-courses", response_model=list[CourseResponse])
async def get_my_courses(
    current_user: CurrentUser,
    db: AsyncSession = Depends(get_db),
):
    return await service.get_student_courses(db, current_user.id)


# ─── Attendance ────────────────────────────────────────────
@router.post("/attendance", response_model=AttendanceResponse, status_code=201)
async def mark_attendance(
    data: AttendanceCreate,
    current_user: CurrentUser,
    db: AsyncSession = Depends(get_db),
    _faculty: None = Depends(require_role(UserRole.FACULTY, UserRole.ADMIN)),
):
    return await service.mark_attendance(db, data, current_user.id)


@router.post("/attendance/bulk", response_model=list[AttendanceResponse], status_code=201)
async def bulk_mark_attendance(
    data: AttendanceBulkCreate,
    current_user: CurrentUser,
    db: AsyncSession = Depends(get_db),
    _faculty: None = Depends(require_role(UserRole.FACULTY, UserRole.ADMIN)),
):
    return await service.bulk_mark_attendance(db, data, current_user.id)


@router.get("/attendance/summary", response_model=list[AttendanceSummary])
async def get_my_attendance(
    current_user: CurrentUser,
    db: AsyncSession = Depends(get_db),
):
    return await service.get_attendance_summary(db, current_user.id)


# ─── Results ──────────────────────────────────────────────
@router.post("/results", response_model=ResultResponse, status_code=201)
async def add_result(
    data: ResultCreate,
    db: AsyncSession = Depends(get_db),
    _admin: None = Depends(require_role(UserRole.ADMIN, UserRole.FACULTY)),
):
    return await service.add_result(db, data)


@router.get("/results/me", response_model=list[ResultResponse])
async def get_my_results(
    current_user: CurrentUser,
    db: AsyncSession = Depends(get_db),
):
    return await service.get_student_results(db, current_user.id)


# ─── Timetable ────────────────────────────────────────────
@router.post("/timetable", response_model=TimetableSlotResponse, status_code=201)
async def create_timetable_slot(
    data: TimetableSlotCreate,
    db: AsyncSession = Depends(get_db),
    _admin: None = Depends(require_role(UserRole.ADMIN)),
):
    return await service.create_timetable_slot(db, data)


@router.get("/timetable/me", response_model=list[TimetableSlotResponse])
async def get_my_timetable(
    current_user: CurrentUser,
    db: AsyncSession = Depends(get_db),
):
    return await service.get_timetable(db, current_user.id)
