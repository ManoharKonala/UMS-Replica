"""
Academic service: business logic for courses, attendance, results, timetable.
"""
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.academics.models import Attendance, AttendanceStatus, Course, Enrollment, Result, TimetableSlot
from app.academics.schemas import (
    AttendanceBulkCreate, AttendanceCreate, AttendanceSummary,
    CourseCreate, ResultCreate, TimetableSlotCreate,
)
from app.core.exceptions import ConflictException, NotFoundException


# ─── Courses ───────────────────────────────────────────────
async def create_course(db: AsyncSession, data: CourseCreate) -> Course:
    existing = await db.execute(select(Course).where(Course.code == data.code))
    if existing.scalar_one_or_none():
        raise ConflictException(f"Course {data.code} already exists")
    course = Course(**data.model_dump())
    db.add(course)
    await db.flush()
    await db.refresh(course)
    return course


async def list_courses(
    db: AsyncSession, department: str | None = None, skip: int = 0, limit: int = 50
) -> tuple[list[Course], int]:
    query = select(Course).where(Course.is_active == True)
    count_q = select(func.count(Course.id)).where(Course.is_active == True)
    if department:
        query = query.where(Course.department == department)
        count_q = count_q.where(Course.department == department)

    total = (await db.execute(count_q)).scalar() or 0
    results = await db.execute(query.offset(skip).limit(limit))
    return list(results.scalars().all()), total


async def get_course(db: AsyncSession, course_id: int) -> Course:
    result = await db.execute(select(Course).where(Course.id == course_id))
    course = result.scalar_one_or_none()
    if not course:
        raise NotFoundException("Course")
    return course


# ─── Enrollment ────────────────────────────────────────────
async def enroll_student(db: AsyncSession, student_id: int, course_id: int) -> Enrollment:
    existing = await db.execute(
        select(Enrollment).where(
            Enrollment.student_id == student_id,
            Enrollment.course_id == course_id,
        )
    )
    if existing.scalar_one_or_none():
        raise ConflictException("Student already enrolled in this course")
    enrollment = Enrollment(student_id=student_id, course_id=course_id)
    db.add(enrollment)
    await db.flush()
    await db.refresh(enrollment)
    return enrollment


async def get_student_courses(db: AsyncSession, student_id: int) -> list[Course]:
    result = await db.execute(
        select(Course)
        .join(Enrollment, Enrollment.course_id == Course.id)
        .where(Enrollment.student_id == student_id)
    )
    return list(result.scalars().all())


# ─── Attendance ────────────────────────────────────────────
async def mark_attendance(
    db: AsyncSession, data: AttendanceCreate, marked_by: int
) -> Attendance:
    record = Attendance(
        student_id=data.student_id,
        course_id=data.course_id,
        date=data.date,
        status=data.status,
        marked_by=marked_by,
    )
    db.add(record)
    await db.flush()
    await db.refresh(record)
    return record


async def bulk_mark_attendance(
    db: AsyncSession, data: AttendanceBulkCreate, marked_by: int
) -> list[Attendance]:
    records = []
    for entry in data.records:
        record = Attendance(
            student_id=entry["student_id"],
            course_id=data.course_id,
            date=data.date,
            status=AttendanceStatus(entry["status"]),
            marked_by=marked_by,
        )
        db.add(record)
        records.append(record)
    await db.flush()
    for r in records:
        await db.refresh(r)
    return records


async def get_attendance_summary(
    db: AsyncSession, student_id: int
) -> list[AttendanceSummary]:
    """Get attendance percentage per course for a student."""
    courses = await get_student_courses(db, student_id)
    summaries = []
    for course in courses:
        result = await db.execute(
            select(Attendance.status, func.count(Attendance.id))
            .where(
                Attendance.student_id == student_id,
                Attendance.course_id == course.id,
            )
            .group_by(Attendance.status)
        )
        status_counts = {row[0]: row[1] for row in result.all()}
        total = sum(status_counts.values())
        present = status_counts.get(AttendanceStatus.PRESENT, 0)
        late = status_counts.get(AttendanceStatus.LATE, 0)
        absent = status_counts.get(AttendanceStatus.ABSENT, 0)
        percentage = ((present + late) / total * 100) if total > 0 else 0.0

        summaries.append(AttendanceSummary(
            course_id=course.id,
            course_name=course.name,
            total_classes=total,
            present=present,
            absent=absent,
            late=late,
            percentage=round(percentage, 1),
        ))
    return summaries


# ─── Results ──────────────────────────────────────────────
async def add_result(db: AsyncSession, data: ResultCreate) -> Result:
    result = Result(**data.model_dump())
    db.add(result)
    await db.flush()
    await db.refresh(result)
    return result


async def get_student_results(
    db: AsyncSession, student_id: int
) -> list[Result]:
    result = await db.execute(
        select(Result).where(Result.student_id == student_id).order_by(Result.year.desc())
    )
    return list(result.scalars().all())


# ─── Timetable ────────────────────────────────────────────
async def create_timetable_slot(db: AsyncSession, data: TimetableSlotCreate) -> TimetableSlot:
    slot = TimetableSlot(**data.model_dump())
    db.add(slot)
    await db.flush()
    await db.refresh(slot)
    return slot


async def get_timetable(db: AsyncSession, student_id: int) -> list[TimetableSlot]:
    """Get timetable for a student based on their enrolled courses."""
    result = await db.execute(
        select(TimetableSlot)
        .join(Enrollment, Enrollment.course_id == TimetableSlot.course_id)
        .where(Enrollment.student_id == student_id)
        .order_by(TimetableSlot.day, TimetableSlot.start_time)
    )
    return list(result.scalars().all())
