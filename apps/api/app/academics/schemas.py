"""
Academic Pydantic schemas.
"""
from datetime import date, datetime, time

from pydantic import BaseModel, Field

from app.academics.models import AttendanceStatus, DayOfWeek, Semester


# ─── Course ────────────────────────────────────────────────
class CourseCreate(BaseModel):
    code: str = Field(..., max_length=20)
    name: str = Field(..., max_length=200)
    credits: int = Field(..., ge=1, le=10)
    department: str
    semester: Semester
    faculty_id: int
    description: str | None = None


class CourseResponse(BaseModel):
    id: int
    code: str
    name: str
    credits: int
    department: str
    semester: Semester
    faculty_id: int
    description: str | None
    is_active: bool
    model_config = {"from_attributes": True}


class CourseListResponse(BaseModel):
    courses: list[CourseResponse]
    total: int


# ─── Attendance ────────────────────────────────────────────
class AttendanceCreate(BaseModel):
    student_id: int
    course_id: int
    date: date
    status: AttendanceStatus


class AttendanceBulkCreate(BaseModel):
    """Mark attendance for multiple students at once."""
    course_id: int
    date: date
    records: list[dict]  # [{"student_id": 1, "status": "present"}, ...]


class AttendanceResponse(BaseModel):
    id: int
    student_id: int
    course_id: int
    date: date
    status: AttendanceStatus
    marked_by: int
    model_config = {"from_attributes": True}


class AttendanceSummary(BaseModel):
    course_id: int
    course_name: str
    total_classes: int
    present: int
    absent: int
    late: int
    percentage: float


# ─── Result ────────────────────────────────────────────────
class ResultCreate(BaseModel):
    student_id: int
    course_id: int
    semester: Semester
    year: int
    internal_marks: float = Field(0.0, ge=0)
    external_marks: float = Field(0.0, ge=0)
    grade: str | None = None
    gpa: float | None = None


class ResultResponse(BaseModel):
    id: int
    student_id: int
    course_id: int
    semester: Semester
    year: int
    internal_marks: float
    external_marks: float
    grade: str | None
    gpa: float | None
    published: bool
    model_config = {"from_attributes": True}


# ─── Timetable ─────────────────────────────────────────────
class TimetableSlotCreate(BaseModel):
    course_id: int
    day: DayOfWeek
    start_time: time
    end_time: time
    room: str


class TimetableSlotResponse(BaseModel):
    id: int
    course_id: int
    day: DayOfWeek
    start_time: time
    end_time: time
    room: str
    model_config = {"from_attributes": True}
