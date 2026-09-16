from fastapi.testclient import TestClient
from app.main import app
from app.database import Base, engine, SessionLocal
from app import models, auth

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["system"] == "CivicFlow AI"

def test_login_demo_admin():
    response = client.post("/api/auth/login", json={
        "email": "admin@civicflow.ai",
        "password": "admin123"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["role"] == "admin"

def test_ai_analysis_endpoint():
    response = client.post("/api/complaints/ai-analyze", json={
        "title": "Streetlight near Block A broken for 5 days",
        "description": "It is completely dark and dangerous at night near Block A pathway."
    })
    assert response.status_code == 200
    data = response.json()
    assert data["category"] in ["Electricity", "Infrastructure"]
    assert data["priority"] in ["High", "Critical"]
    assert data["sla_hours"] <= 24

def test_check_duplicates():
    response = client.post("/api/complaints/check-duplicates", json={
        "title": "Streetlight near Block A not working",
        "description": "Blackout near Block A pathway lights"
    })
    assert response.status_code == 200
    assert isinstance(response.json(), list)
