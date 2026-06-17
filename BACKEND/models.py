from sqlalchemy import Column, Integer, String
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)
    password = Column(String)
    role = Column(String)

from sqlalchemy import Column, Integer, String, ForeignKey

class WorkLog(Base):
    __tablename__ = "worklogs"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("users.id"))
    task = Column(String)
    hours = Column(String)
    issue = Column(String)
    status = Column(String)

    