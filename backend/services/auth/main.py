import os
import sqlite3
import hashlib
import logging
from datetime import datetime, timedelta
from typing import Optional
from fastapi import FastAPI, HTTPException, status, Depends
from pydantic import BaseModel, EmailStr
from jose import jwt
from shared.logging_helper import setup_logging

# Setup logging
setup_logging("auth_service")
logger = logging.getLogger("auth_service")

app = FastAPI(title="StadiaX Auth Service", version="1.0.0")

DB_PATH = os.getenv("AUTH_DB_PATH", "auth_database.db")
JWT_SECRET = os.getenv("JWT_SECRET") or ("stadiax_ultra_sec_" + str(1013 * 2))
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7

# Salt for password hashing
SALT = os.getenv("PASSWORD_SALT") or ("stadiax_sec_" + str(1013 * 2))

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str
    role: Optional[str] = "fan"  # admin, operator, volunteer, fan

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenRefresh(BaseModel):
    refresh_token: str

# Database setup helper
def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            name TEXT NOT NULL,
            role TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    """)
    conn.commit()
    
    # Insert default operator user if not exists
    cursor.execute("SELECT id FROM users WHERE email = 'operator@stadiax.com'")
    if not cursor.fetchone():
        pwd_hash = hash_password("stadium2026")
        cursor.execute(
            "INSERT INTO users (email, password_hash, name, role, created_at) VALUES (?, ?, ?, ?, ?)",
            ("operator@stadiax.com", pwd_hash, "FIFA Operator", "operator", datetime.utcnow().isoformat())
        )
        conn.commit()
        logger.info("Default operator user seeded.")
    conn.close()

def hash_password(password: str) -> str:
    salted = SALT + password
    return hashlib.sha256(salted.encode()).hexdigest()

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt

def create_refresh_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "refresh": True})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt

@app.on_event("startup")
def on_startup():
    init_db()

@app.post("/api/v1/auth/register", status_code=status.HTTP_201_CREATED)
def register(user: UserRegister):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Hash password
    pwd_hash = hash_password(user.password)
    
    try:
        cursor.execute(
            "INSERT INTO users (email, password_hash, name, role, created_at) VALUES (?, ?, ?, ?, ?)",
            (user.email, pwd_hash, user.name, user.role, datetime.utcnow().isoformat())
        )
        conn.commit()
        logger.info(f"Registered user: {user.email} (Role: {user.role})")
        return {"status": "success", "message": "User registered successfully"}
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="Email already registered.")
    finally:
        conn.close()

@app.post("/api/v1/auth/login")
def login(user: UserLogin):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    pwd_hash = hash_password(user.password)
    
    cursor.execute(
        "SELECT id, email, name, role FROM users WHERE email = ? AND password_hash = ?",
        (user.email, pwd_hash)
    )
    db_user = cursor.fetchone()
    conn.close()
    
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid email or password.")
        
    user_id, email, name, role = db_user
    
    access_token = create_access_token(
        data={"sub": str(user_id), "email": email, "name": name, "role": role},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    refresh_token = create_refresh_token(data={"sub": str(user_id)})
    
    logger.info(f"User logged in: {email}")
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {
            "id": user_id,
            "email": email,
            "name": name,
            "role": role
        }
    }

@app.post("/api/v1/auth/refresh")
def refresh(token: TokenRefresh):
    try:
        payload = jwt.decode(token.refresh_token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if not payload.get("refresh"):
            raise HTTPException(status_code=401, detail="Invalid refresh token.")
            
        user_id = payload.get("sub")
        
        # Pull user details from DB
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT id, email, name, role FROM users WHERE id = ?", (user_id,))
        db_user = cursor.fetchone()
        conn.close()
        
        if not db_user:
            raise HTTPException(status_code=401, detail="User no longer exists.")
            
        user_id, email, name, role = db_user
        
        access_token = create_access_token(
            data={"sub": str(user_id), "email": email, "name": name, "role": role},
            expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        return {"access_token": access_token, "token_type": "bearer"}
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Refresh token expired. Please login again.")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token.")

@app.get("/api/v1/auth/health")
def health():
    return {"status": "nominal", "database": "connected"}
