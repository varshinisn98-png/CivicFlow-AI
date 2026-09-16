# 🚀 CivicFlow AI — Smart Grievance & Complaint Management System

CivicFlow AI is an end-to-end platform for municipal governments, universities, and smart communities. It automates complaint classification, priority prediction, duplicate ticket clustering, SLA deadline tracking, geospatial heatmap visualization, and official response drafting.

---

## ✨ Core Features

### 👤 Citizen Portal
- **User Authentication:** JWT token authentication with role-based routing (`Citizen` vs `Admin`).
- **AI-Assisted Complaint Submission:** Real-time category and priority prediction before filing.
- **Duplicate Ticket Alert:** Warns users if a similar issue was recently reported in the area.
- **Interactive Map Location Pinning:** Pinpoint exact complaint coordinates using map widgets.
- **Live Tracker & History:** Monitor status (`Pending`, `In Progress`, `Resolved`), inspect department resolution notes, and check SLA countdowns.
- **Citizen Feedback:** Submit 1-5 star ratings upon complaint completion.

### 🤖 AI Engine
- **Category Classification:** Automatically categorizes complaints into *Infrastructure, Electricity, Water, Cleanliness, Transport, Academic, Security, Other*.
- **Predictive Priority & SLA:** Scores urgency (*Low, Medium, High, Critical*) and calculates target SLA response windows (12h to 72h).
- **Vector Duplicate Detection:** Computes text similarities using vector embeddings across open cases.
- **AI Cluster Summaries:** Groups multiple duplicate complaints into single executive summaries.
- **AI Response Drafting:** Auto-generates official update drafts for department officers.

### 📊 Admin Dashboard
- **Telemetry Metrics:** Total Complaints, Pending, In Progress, Resolved, SLA Breached.
- **Analytics Visualizations:** Category distribution bar chart, Priority pie chart, Weekly resolution velocity area chart.
- **Geospatial Heatmap:** Color-coded interactive map displaying problem clusters.
- **Duplicate Cluster Manager:** Group and resolve duplicate cases simultaneously.
- **Status Dispatcher Drawer:** Update status and dispatch responses to citizens.

---

## 🛠️ Tech Stack

- **Backend:** FastAPI, Python 3.12+, SQLAlchemy, Pydantic v2, Scikit-learn, PyJWT.
- **Frontend:** React 18, Vite, Tailwind CSS, Lucide Icons, Leaflet, Recharts.
- **DevOps:** Docker, Docker Compose, Uvicorn.

---

## ⚡ Quick Start (Local Setup)

### 1. Backend Setup (FastAPI)
```bash
cd backend
python seed.py
uvicorn app.main:app --reload --port 8000
```
- **Backend API:** `http://127.0.0.1:8000`
- **Swagger Docs:** `http://127.0.0.1:8000/docs`

### 2. Frontend Setup (React + Vite)
```bash
cd frontend
npm run dev
```
- **Web Portal:** `http://localhost:5173`

---

## 🐳 Docker Setup

```bash
docker-compose up --build
```
