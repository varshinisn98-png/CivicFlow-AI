# 🚀 CivicFlow AI — Smart Grievance & Complaint Management System

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Build-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Maps-Leaflet-199900?style=for-the-badge&logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![Docker](https://img.shields.io/badge/DevOps-Docker Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

**CivicFlow AI** is an end-to-end, production-grade AI platform designed for municipal governments, universities, and smart communities. It automates complaint classification, priority prediction, vector duplicate ticket clustering, SLA deadline tracking, geospatial heatmap visualization, and official response drafting.

---

## 🎯 Core Features

### 👤 Citizen / Student Portal
- **Secure Authentication:** JWT token authentication with role-based routing (`Citizen` vs `Admin`).
- **AI-Assisted Complaint Submission:** Real-time NLP category and priority prediction before filing.
- **Vector Duplicate Ticket Alert:** Warns users if a similar issue was recently reported in the area.
- **Interactive Map Location Pinning:** Pinpoint exact complaint coordinates using Leaflet map widgets.
- **Live Tracker & History:** Monitor status (`Pending`, `In Progress`, `Resolved`), inspect department resolution notes, and check SLA countdowns.
- **Citizen Feedback:** Submit 1-5 star ratings upon complaint completion.

### 🤖 AI Engine Features
1. **NLP Category Classification:** Categorizes complaints into *Infrastructure, Electricity, Water, Cleanliness, Transport, Academic, Security, Other*.
2. **Predictive Priority & SLA:** Scores urgency (*Low, Medium, High, Critical*) and calculates target SLA response windows (12h to 72h).
3. **Vector Duplicate Detection:** Computes text similarities using TF-IDF vector embeddings & Cosine Similarity matrices across open cases.
4. **AI Executive Summaries:** Clusters multiple duplicate complaints into single administrative executive summaries.
5. **AI Response Drafting:** Auto-generates official update drafts for department officers.

### 📊 Admin SaaS Telemetry Dashboard
- **5 Telemetry Cards:** Total Complaints, Pending, In Progress, Resolved, SLA Breached.
- **Interactive Recharts Visualizations:** Category distribution bar chart, Priority pie chart, Weekly resolution velocity area chart.
- **Geospatial Heatmap:** Color-coded Leaflet interactive map displaying problem clusters.
- **AI Duplicate Cluster Resolver:** Group and resolve duplicate cases simultaneously.
- **Status Dispatcher Drawer:** Change status and dispatch custom or AI-generated responses to citizens.

---

## 🧠 Tech Stack

- **Backend:** FastAPI, Python 3.12+, SQLAlchemy (SQLite default / PostgreSQL compatible), Pydantic v2, Scikit-learn, PyJWT.
- **Frontend:** React 18, Vite, Tailwind CSS, Lucide React Icons, Leaflet & React-Leaflet, Recharts.
- **DevOps:** Docker, Docker Compose, Uvicorn.

---

## ⚡ Quick Start Guide

### 1. Run Backend (FastAPI)
```bash
cd backend
python seed.py
uvicorn app.main:app --reload --port 8000
```
- **Backend API:** `http://127.0.0.1:8000`
- **Interactive Swagger Docs:** `http://127.0.0.1:8000/docs`

### 2. Run Frontend (React + Vite)
```bash
cd frontend
npm run dev
```
- **Frontend Web App:** `http://localhost:5173`

---

## 🐳 Docker Deployment

Launch the full system with a single command:
```bash
docker-compose up --build
```

---

## 🌐 Production Deployment Guide

1. **Frontend (Vercel):** Connect your GitHub repository, set Root Directory to `frontend`, Build Command to `npm run build`, Output Directory to `dist`.
2. **Backend (Render / Railway):** Deploy `backend` as a Web Service. Command: `uvicorn app.main:app --host 0.0.0.0 --port 8000`.
3. **Database (PostgreSQL):** Set environment variable `DATABASE_URL=postgresql://user:password@host/db`.
