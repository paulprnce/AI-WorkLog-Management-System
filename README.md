# AI WorkLog Management System

## Overview

AI WorkLog Management System is a full-stack web application designed to simplify employee work tracking and manager reporting through Artificial Intelligence.

Employees can submit their daily work updates in natural language, and the system automatically extracts structured information such as tasks completed, hours worked, issues encountered, and work status using AI-powered processing.

Managers can monitor employee productivity, analyze reported issues, view work logs, generate reports, and gain insights through interactive dashboards and visual analytics.

---

## Features

### Employee Portal

* User Registration and Login
* Secure Authentication
* AI-Powered Work Log Submission
* Natural Language Work Reporting
* Automated Task Extraction
* Work History Tracking
* Chat-Based User Interface

### Manager Dashboard

* View All Employee Logs
* Productivity Monitoring
* Issue Tracking and Analysis
* Employee Performance Overview
* Interactive Charts and Visualizations
* Recent Activity Monitoring
* PDF Report Export

### AI Features

The application utilizes AI to automatically extract structured work information from employee messages, including:

* Task Description
* Hours Worked
* Reported Issues
* Work Status

Example:

Input:

"Today I fixed the dashboard API issue, worked for 5 hours, and deployment is still pending."

AI Output:

* Task: Dashboard API Issue Fix
* Hours: 5
* Issue: Deployment Pending
* Status: In Progress

---

## System Architecture

Frontend (React + Vite)

⬇

FastAPI Backend

⬇

SQLite Database

⬇

AI Extraction Engine

---

## Technology Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* Axios
* Recharts
* jsPDF
* html-to-image

### Backend

* FastAPI
* SQLAlchemy
* Pydantic
* Uvicorn

### Database

* SQLite

### AI Processing

* Custom AI Work Log Extraction Module

---

## Project Structure

```text
AI-WORKLOG/

├── backend/
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   ├── database.py
│   ├── auth.py
│   ├── ai.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── assets/
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## Installation

### Backend Setup

Navigate to backend folder:

```bash
cd backend
```

Create virtual environment:

```bash
python -m venv venv
```

Activate environment:

Windows

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run FastAPI server:

```bash
uvicorn main:app --reload
```

Backend runs at:

```text
http://127.0.0.1:8000
```

API Documentation:

```text
http://127.0.0.1:8000/docs
```

---

### Frontend Setup

Navigate to frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

---

## Dashboard Analytics

### Productivity Summary

Displays total hours worked by employees through interactive bar charts.

### Issue Analysis

Visualizes issue frequency and distribution using pie charts.

### Recent Employee Logs

Provides managers with a real-time view of employee activity and submitted work logs.

---

## Security Features

* Password Hashing
* User Authentication
* Role-Based Access Control
* Protected Manager Dashboard

---

## Future Enhancements

* JWT Authentication
* Cloud Database Integration
* Email Notifications
* Team Management
* Advanced AI Analytics
* Department-Level Reporting
* Monthly Performance Reports
* Multi-Manager Support
* Real-Time Notifications

---

## Author

Paul Prince

Master's Aspirant in Data Science & AI

Biotechnology Engineering Graduate

---

## License

This project is developed for educational, portfolio, and research purposes.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
