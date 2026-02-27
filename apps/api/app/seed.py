"""
Seed script: populates the database with sample data for development.
Run with: python -m app.seed
"""
import asyncio
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import AsyncSessionLocal, engine, Base
from app.core.security import hash_password
from app.users.models import User, UserRole
from app.academics.models import Course, Semester, TimetableSlot, DayOfWeek
from app.housing.models import Room, RoomType
from app.communication.models import ChatRoom, ChatRoomMember

# Import all models
from app.users import models as _  # noqa
from app.academics import models as __  # noqa
from app.housing import models as ___  # noqa
from app.communication import models as ____  # noqa


async def seed():
    # Create all tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as db:
        # ─── Users ─────────────────────────────────────────
        admin = User(
            email="admin@ums.edu",
            hashed_password=hash_password("Admin@123"),
            full_name="Dr. System Administrator",
            role=UserRole.ADMIN,
            department="Administration",
        )
        faculty1 = User(
            email="prof.sharma@ums.edu",
            hashed_password=hash_password("Faculty@123"),
            full_name="Prof. Anil Sharma",
            role=UserRole.FACULTY,
            department="Computer Science",
        )
        faculty2 = User(
            email="prof.gupta@ums.edu",
            hashed_password=hash_password("Faculty@123"),
            full_name="Prof. Priya Gupta",
            role=UserRole.FACULTY,
            department="Mathematics",
        )
        student1 = User(
            email="manohar.k@ums.edu",
            hashed_password=hash_password("Student@123"),
            full_name="Manohar Konala",
            role=UserRole.STUDENT,
            enrollment_no="2024CS001",
            department="Computer Science",
        )
        student2 = User(
            email="rahul.m@ums.edu",
            hashed_password=hash_password("Student@123"),
            full_name="Rahul Mehra",
            role=UserRole.STUDENT,
            enrollment_no="2024CS002",
            department="Computer Science",
        )
        student3 = User(
            email="priya.s@ums.edu",
            hashed_password=hash_password("Student@123"),
            full_name="Priya Singh",
            role=UserRole.STUDENT,
            enrollment_no="2024MT001",
            department="Mathematics",
        )

        db.add_all([admin, faculty1, faculty2, student1, student2, student3])
        await db.flush()

        # ─── Courses ──────────────────────────────────────
        cs101 = Course(
            code="CS101", name="Data Structures & Algorithms",
            credits=4, department="Computer Science",
            semester=Semester.FALL, faculty_id=faculty1.id,
            description="Fundamental data structures and algorithm design."
        )
        cs201 = Course(
            code="CS201", name="Database Management Systems",
            credits=4, department="Computer Science",
            semester=Semester.FALL, faculty_id=faculty1.id,
            description="Relational databases, SQL, normalization."
        )
        mt101 = Course(
            code="MT101", name="Linear Algebra",
            credits=3, department="Mathematics",
            semester=Semester.FALL, faculty_id=faculty2.id,
            description="Vectors, matrices, and linear transformations."
        )
        cs301 = Course(
            code="CS301", name="Operating Systems",
            credits=4, department="Computer Science",
            semester=Semester.SPRING, faculty_id=faculty1.id,
            description="Process management, memory, file systems."
        )

        db.add_all([cs101, cs201, mt101, cs301])
        await db.flush()

        # ─── Timetable ────────────────────────────────────
        from datetime import time
        timetable_slots = [
            TimetableSlot(course_id=cs101.id, day=DayOfWeek.MONDAY,
                start_time=time(9, 0), end_time=time(10, 30), room="A-101"),
            TimetableSlot(course_id=cs101.id, day=DayOfWeek.WEDNESDAY,
                start_time=time(9, 0), end_time=time(10, 30), room="A-101"),
            TimetableSlot(course_id=cs201.id, day=DayOfWeek.TUESDAY,
                start_time=time(11, 0), end_time=time(12, 30), room="B-204"),
            TimetableSlot(course_id=cs201.id, day=DayOfWeek.THURSDAY,
                start_time=time(11, 0), end_time=time(12, 30), room="B-204"),
            TimetableSlot(course_id=mt101.id, day=DayOfWeek.MONDAY,
                start_time=time(14, 0), end_time=time(15, 0), room="C-301"),
            TimetableSlot(course_id=mt101.id, day=DayOfWeek.FRIDAY,
                start_time=time(14, 0), end_time=time(15, 0), room="C-301"),
        ]
        db.add_all(timetable_slots)

        # ─── Housing ──────────────────────────────────────
        rooms = [
            Room(building="Hostel A", floor=1, room_number="A-101",
                 room_type=RoomType.DOUBLE, capacity=2, amenities='["WiFi","AC","Attached Bath"]'),
            Room(building="Hostel A", floor=1, room_number="A-102",
                 room_type=RoomType.DOUBLE, capacity=2, amenities='["WiFi","AC"]'),
            Room(building="Hostel A", floor=2, room_number="A-201",
                 room_type=RoomType.SINGLE, capacity=1, amenities='["WiFi","AC","Attached Bath","Study Desk"]'),
            Room(building="Hostel B", floor=1, room_number="B-101",
                 room_type=RoomType.TRIPLE, capacity=3, amenities='["WiFi","Fan"]'),
            Room(building="Hostel B", floor=1, room_number="B-102",
                 room_type=RoomType.SUITE, capacity=2, amenities='["WiFi","AC","Kitchen","Attached Bath"]'),
        ]
        db.add_all(rooms)

        # ─── Chat Rooms ───────────────────────────────────
        general = ChatRoom(name="General Discussion", room_type="group", created_by=admin.id)
        cs_room = ChatRoom(name="CS Department", room_type="group", created_by=faculty1.id)
        db.add_all([general, cs_room])
        await db.flush()

        # Add members
        members = [
            ChatRoomMember(room_id=general.id, user_id=admin.id),
            ChatRoomMember(room_id=general.id, user_id=faculty1.id),
            ChatRoomMember(room_id=general.id, user_id=student1.id),
            ChatRoomMember(room_id=general.id, user_id=student2.id),
            ChatRoomMember(room_id=cs_room.id, user_id=faculty1.id),
            ChatRoomMember(room_id=cs_room.id, user_id=student1.id),
            ChatRoomMember(room_id=cs_room.id, user_id=student2.id),
        ]
        db.add_all(members)

        await db.commit()
        print("✅ Database seeded successfully!")
        print(f"   👤 Users: 6 (1 admin, 2 faculty, 3 students)")
        print(f"   📚 Courses: 4")
        print(f"   🏠 Rooms: 5")
        print(f"   💬 Chat rooms: 2")
        print(f"\n   Login credentials:")
        print(f"   Admin:   admin@ums.edu / Admin@123")
        print(f"   Faculty: prof.sharma@ums.edu / Faculty@123")
        print(f"   Student: manohar.k@ums.edu / Student@123")


if __name__ == "__main__":
    asyncio.run(seed())
