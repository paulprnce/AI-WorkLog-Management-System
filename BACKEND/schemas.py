from pydantic import BaseModel

class UserCreate(BaseModel):
    name: str
    password: str
    role: str

class UserLogin(BaseModel):
    name: str
    password: str

class WorkLogCreate(BaseModel):
    employee_id: int
    task: str
    hours: str
    issue: str
    status: str    

class ChatLog(BaseModel):
    employee_id: int
    message: str    