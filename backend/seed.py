from app.database import SessionLocal, engine, Base
from app import models, auth

def seed():
    # DO NOT drop tables! Ensure tables exist without wiping data.
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    print("[SEED] Ensuring database schema & core departments exist...")

    # 1. Seed Core Departments if missing
    departments_data = [
        {"name": "Electrical & Maintenance", "code": "ELEC", "contact_email": "elec@civicflow.ai", "description": "Handles streetlights, wiring, transformers, power outages."},
        {"name": "Civil & Infrastructure", "code": "CIVIL", "contact_email": "civil@civicflow.ai", "description": "Handles roads, potholes, pathways, building damage, benches."},
        {"name": "Water & Sanitation", "code": "WATER", "contact_email": "water@civicflow.ai", "description": "Handles water supply, pipe leaks, sewage, drinking water."},
        {"name": "Waste & Cleanliness", "code": "SANITA", "contact_email": "sanita@civicflow.ai", "description": "Handles garbage collection, litter, dustbins, campus sanitation."},
        {"name": "Transport & Parking", "code": "TRANS", "contact_email": "trans@civicflow.ai", "description": "Handles shuttle buses, traffic control, illegal parking."},
        {"name": "Academic Tech & IT", "code": "ACAD", "contact_email": "acad@civicflow.ai", "description": "Handles classroom projectors, lab computers, campus Wi-Fi."},
        {"name": "Campus Security", "code": "SEC", "contact_email": "sec@civicflow.ai", "description": "Handles CCTV cameras, security guards, safety concerns, theft."}
    ]

    for d_data in departments_data:
        existing_dept = db.query(models.Department).filter(models.Department.code == d_data["code"]).first()
        if not existing_dept:
            dept = models.Department(**d_data)
            db.add(dept)

    # 2. Seed Default Admin User if missing
    admin_email = "admin@civicflow.ai"
    existing_admin = db.query(models.User).filter(models.User.email == admin_email).first()
    if not existing_admin:
        admin_user = models.User(
            email=admin_email,
            hashed_password=auth.get_password_hash("admin123"),
            full_name="System Admin",
            role="admin"
        )
        db.add(admin_user)
    
    db.commit()
    print("[SUCCESS] Core departments and default admin verified. Existing user data preserved.")

if __name__ == "__main__":
    seed()
