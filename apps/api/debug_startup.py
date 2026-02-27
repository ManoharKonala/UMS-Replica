import sys
sys.path.insert(0, ".")
import traceback
try:
    print("Attempting to import app...")
    from main import app
    print("Import successful!")
except Exception:
    traceback.print_exc()
