from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from collections import defaultdict

import models
import schemas

from database import engine, SessionLocal
from models import User, WorkLog
from auth import hash_password, verify_password
from ai import extract_worklog

# Create database tables
models.Base.metadata.create_all(bind=engine)

# FastAPI app
app = FastAPI(
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ---------------------------------------------------
# HOME ROUTE
# ---------------------------------------------------

@app.get("/")
def home():
    return {
        "message": "AI WorkLog Backend Running"
    }

# ---------------------------------------------------
# REGISTER USER
# ---------------------------------------------------

@app.post("/register")
def register(user: schemas.UserCreate,
             db: Session = Depends(get_db)):

    existing_user = db.query(models.User).filter(
        models.User.name == user.name
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="User already exists"
        )

    hashed_pw = hash_password(user.password)

    new_user = models.User(
        name=user.name,
        password=hashed_pw,
        role=user.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User registered successfully"
    }

# ---------------------------------------------------
# LOGIN USER
# ---------------------------------------------------

@app.post("/login")
def login(user: schemas.UserLogin,
          db: Session = Depends(get_db)):

    db_user = db.query(models.User).filter(
        models.User.name == user.name
    ).first()

    if not db_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if not verify_password(
        user.password,
        db_user.password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid password"
        )

    return {
        "message": "Login successful",
        "role": db_user.role,
        "user_id": db_user.id
    }

# ---------------------------------------------------
# SUBMIT MANUAL WORK LOG
# ---------------------------------------------------

@app.post("/submit-log")
def submit_log(log: schemas.WorkLogCreate,
               db: Session = Depends(get_db)):

    new_log = models.WorkLog(
        employee_id=log.employee_id,
        task=log.task,
        hours=log.hours,
        issue=log.issue,
        status=log.status
    )

    db.add(new_log)
    db.commit()
    db.refresh(new_log)

    return {
        "message": "Work log submitted successfully"
    }

# ---------------------------------------------------
# AI WORK LOG SUBMISSION
# ---------------------------------------------------

@app.post("/ai-submit-log")
def ai_submit_log(chat: schemas.ChatLog,
                  db: Session = Depends(get_db)):

    extracted = extract_worklog(chat.message)

    new_log = models.WorkLog(
        employee_id=chat.employee_id,
        task=extracted.get("task", ""),
        hours=extracted.get("hours", ""),
        issue=extracted.get("issue", ""),
        status=extracted.get("status", "")
    )

    db.add(new_log)
    db.commit()
    db.refresh(new_log)

    return {
        "message": "AI work log stored",
        "structured_data": extracted
    }

# ---------------------------------------------------
# VIEW ALL LOGS
# ---------------------------------------------------

@app.get("/all-logs")
def get_all_logs(db: Session = Depends(get_db)):

    logs = db.query(models.WorkLog).all()

    result = []

    for log in logs:

        employee = db.query(models.User).filter(
            models.User.id == log.employee_id
        ).first()

        result.append({
            "employee_name": employee.name if employee else "Unknown",
            "task": log.task,
            "hours": log.hours,
            "issue": log.issue,
            "status": log.status
        })

    return result
# ---------------------------------------------------
# VIEW EMPLOYEE LOGS
# ---------------------------------------------------

@app.get("/employee-logs/{employee_id}")
def employee_logs(employee_id: int,
                  db: Session = Depends(get_db)):

    logs = db.query(models.WorkLog).filter(
        models.WorkLog.employee_id == employee_id
    ).all()

    return logs

# ---------------------------------------------------
# PRODUCTIVITY SUMMARY
# ---------------------------------------------------

@app.get("/productivity-summary")
def productivity_summary(db: Session = Depends(get_db)):

    logs = db.query(models.WorkLog).all()

    summary = {}

    for log in logs:

        employee = log.employee_id

        try:
            hours = int(log.hours) if log.hours else 0
        except:
            hours = 0

        if employee not in summary:
            summary[employee] = 0

        summary[employee] += hours

    return summary

# ---------------------------------------------------
# ISSUE SUMMARY
# ---------------------------------------------------

@app.get("/issue-summary")
def issue_summary(db: Session = Depends(get_db)):

    logs = db.query(models.WorkLog).all()

    issues = {}

    for log in logs:

        issue = log.issue

        if issue not in issues:
            issues[issue] = 0

        issues[issue] += 1

    return issues

