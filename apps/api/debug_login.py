import sys
import asyncio
import time
sys.path.insert(0, ".")

print("Importing security...")
from app.core.security import verify_password, hash_password
print("Security imported.")

def test_hashing():
    print("Testing hashing...")
    start = time.time()
    pwd = "Student@123"
    hashed = hash_password(pwd)
    print(f"Hashed '{pwd}' -> {hashed}")
    print(f"Hashing took {time.time() - start:.4f}s")
    
    start = time.time()
    valid = verify_password(pwd, hashed)
    print(f"Verification: {valid}")
    print(f"Verification took {time.time() - start:.4f}s")
    return hashed

async def check_db_user(expected_hash):
    print("Importing DB/Service...")
    from app.core.database import AsyncSessionLocal
    from app.users.service import get_user_by_email
    
    email = "manohar.k@ums.edu"
    print(f"Checking DB for {email}...")
    
    async with AsyncSessionLocal() as db:
        user = await get_user_by_email(db, email)
        if not user:
            print("❌ User not found in DB!")
            return

        print(f"User found: {user.email}")
        print(f"Stored Hash: {user.hashed_password}")
        
        # Check if stored hash is compatible
        is_valid = verify_password("Student@123", user.hashed_password)
        print(f"Stored hash valid? {is_valid}")

if __name__ == "__main__":
    hashed = test_hashing()
    asyncio.run(check_db_user(hashed))
