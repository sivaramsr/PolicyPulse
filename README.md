# PolicyPulse — Tamil Nadu Government Policy Feedback Platform

PolicyPulse is a digital public consultation and AI-driven sentiment analytics platform built for state legislative policy proposals.

---

## 🚀 Quick Start Guide

### 1. Backend Setup (Django REST Framework)
```bash
cd policy-feedback-backend
python -m venvs venv
venv\Scripts\activate
pip install django djangorestframework djangorestframework-simplejwt google-generativeai django-cors-headers python-dotenv
python manage.py migrate
python manage.py runserver 8001
```

### 2. Frontend Setup (React Vite)
```bash
cd policy-feedback-frontend
npm install
npm run dev
```

---

## 📌 Project Endpoints & Features

* **React Public Web App**: `http://localhost:5173/`
* **Staff Admin Console**: `http://127.0.0.1:8001/panel/` (*User: `admin` | Pass: `admin123`*)
* **Django REST API Root**: `http://127.0.0.1:8001/api/`
* **Django Fallback Admin**: `http://127.0.0.1:8001/admin/`

---

## 🛠 Tech Stack

* **Frontend**: React 19, React Router 7, Framer Motion 13, Vite 8, Vanilla CSS
* **Backend**: Python 3.10+, Django 5.2, Django REST Framework 3.17, SimpleJWT 5.5, SQLite
* **AI Analysis**: Google Gemini 3.6 Flash (`google-generativeai`) with rule-based fallback
