# 🚀 CivicFlow AI — Smart Grievance & Complaint Management System

CivicFlow AI is an end-to-end, production-grade AI platform for citizens and municipal/university administrations. It automates complaint classification, priority prediction, duplicate ticket clustering, SLA tracking, geospatial heatmap visualization, and official response drafting.

---

## 🔥 Features & Capabilities

### 👤 User / Citizen Side
- **Registration & Auth:** JWT authentication with instant demo role access.
- **AI-Powered Complaint Form:** Real-time NLP category and priority prediction before submission.
- **Duplicate Ticket Alert:** Detects existing open complaints in the area and warns users with match confidence scores.
- **Interactive Map Location Pinning:** Pinpoint complaint coordinates using Leaflet map widgets.
- **Live Tracker & History:** Monitor status (`Pending`, `In Progress`, `Resolved`), view department response logs, and check SLA countdowns.
- **Resolution Rating:** Submit 1-5 star feedback ratings upon complaint resolution.

### 🤖 AI Engine Features
1. **NLP Classification:** Automatically categorizes complaints into *Infrastructure, Electricity, Water, Cleanliness, Transport, Academic, Security, Other*.
2. **Predictive Priority & SLA:** Scores urgency (`Low`, `Medium`, `High`, `Critical`) and calculates target SLA hours (12h - 72h).
3. **Vector Duplicate Detection:** Computes text similarities using TF-IDF / Cosine Similarity vector models across open cases.
4. **AI Executive Summaries:** Clusters multiple duplicate complaints into single administrative executive summaries.
5. **AI Response Drafting:** Auto-generates courteous official updates for department officers to send to citizens.

### 📊 Admin SaaS Dashboard
- **5 Telemetry Cards:** Total Complaints, Pending, In Progress, Resolved, SLA Breached.
- **Interactive Recharts Visualizations:** Category distribution bar chart, Priority pie chart, Weekly resolution velocity area chart.
- **Geospatial Heatmap:** Color-coded Leaflet interactive map displaying problem clusters.
- **AI Duplicate Cluster Resolver:** Group and resolve duplicate cases simultaneously.
- **Status Update Drawer:** Change status and dispatch custom or AI-drafted responses.

---

## 🧠 Tech Stack

- **Backend:** FastAPI, Python 3.12+, SQLAlchemy (SQLite default / PostgreSQL compatible), Pydantic v2, Scikit-learn, PyJWT.
- **Frontend:** React 18, Vite, Tailwind CSS, Lucide React Icons, Leaflet & React-Leaflet, Recharts.
- **DevOps:** Docker, Docker Compose, Uvicorn.

---

## ⚡ Quick Start Guide (Local Setup)

### 1. Run Backend (FastAPI)
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
pip install -r requirements.txt

# Seed Database with sample complaints & users
python seed.py

# Start FastAPI server
uvicorn app.main:app --reload --port 8000
```
- **Backend API:** `http://127.0.0.1:8000`
- **Interactive Swagger Docs:** `http://127.0.0.1:8000/docs`

### 2. Run Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
- **Frontend Web App:** `http://localhost:5173`

---

## 🔑 Demo Login Credentials

You can test both roles using the **1-Click Demo Login** buttons on the login screen or manually:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@civicflow.ai` | `admin123` | Full SaaS Dashboard, Heatmap, AI Clusters & Resolution |
| **Staff** | `staff@civicflow.ai` | `staff123` | Electrical Department Queue & Status Updates |
| **Citizen** | `citizen@civicflow.ai` | `citizen123` | Submit complaints, view history, rate resolution |

---

## 🐳 Docker Deployment

To launch the full system with single command:
```bash
docker-compose up --build
```

---

## 🌐 Production Deployment Guide

1. **Frontend (Vercel):** Connect your GitHub repository, set Root Directory to `frontend`, Build Command to `npm run build`, Output Directory to `dist`.
2. **Backend (Render / Railway):** Deploy `backend` as a Web Service. Command: `uvicorn app.main:app --host 0.0.0.0 --port 8000`.
3. **Database (PostgreSQL):** Pass environment variable `DATABASE_URL=postgresql://user:password@host/db`.
