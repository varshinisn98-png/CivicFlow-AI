from fastapi.testclient import TestClient
from app.main import app
from seed import seed

def run_tests():
    print("[TEST] Testing Persistent User Registration, Login & Complaint Data...")
    client = TestClient(app)

    # 1. Register a new user
    email = "VARSH_TEST@civicflow.ai"
    password = "MySecurePassword123"
    
    res = client.post("/api/auth/register", json={
        "email": email,
        "password": password,
        "full_name": "Varsha User",
        "role": "citizen"
    })
    
    if res.status_code == 400 and "already exists" in res.text:
        # Already registered, log in directly
        res = client.post("/api/auth/login", json={"email": email, "password": password})
    
    assert res.status_code == 200, f"Registration/Login failed: {res.text}"
    token = res.json()["access_token"]
    user = res.json()["user"]
    headers = {"Authorization": f"Bearer {token}"}
    print(f"  [OK] User registered & authenticated: {user['email']} (ID: {user['id']})")

    # 2. Login with lowercase variant
    res = client.post("/api/auth/login", json={
        "email": "varsh_test@civicflow.ai",
        "password": password
    })
    assert res.status_code == 200, f"Normalized email login failed: {res.text}"
    print("  [OK] Login with normalized email passed")

    # 3. Submit a complaint
    res = client.post("/api/complaints", json={
        "title": "Persistent complaint test",
        "description": "Checking data persistence across app restarts.",
        "location_name": "Block B",
        "latitude": 12.9720,
        "longitude": 77.5950
    }, headers=headers)
    assert res.status_code == 200, f"Complaint creation failed: {res.text}"
    comp_id = res.json()["id"]
    print(f"  [OK] Complaint #CF-{comp_id} submitted successfully")

    # 4. Trigger seed() to verify data IS NOT wiped
    seed()

    # 5. Re-authenticate after seed()
    res = client.post("/api/auth/login", json={
        "email": email,
        "password": password
    })
    assert res.status_code == 200, "User account should persist after seed execution!"
    print("  [OK] User account persisted across seed execution")

    # Verify complaint still exists
    res = client.get(f"/api/complaints/{comp_id}", headers=headers)
    assert res.status_code == 200, "Complaint data should persist!"
    print(f"  [OK] Complaint #CF-{comp_id} verified intact in database")

    print("\n[SUCCESS] Authentication persistence bug completely resolved!")

if __name__ == "__main__":
    run_tests()
