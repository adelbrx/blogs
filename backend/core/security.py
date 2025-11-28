from datetime import datetime, timedelta
from typing import Any, Dict
import secrets

from fastapi import HTTPException, status
from jose import JWTError, jwt
from passlib.context import CryptContext

from backend.core.config import Config

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_csrf_token() -> str:
    return secrets.token_urlsafe(16)


def credentials_exception() -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )


def create_token(
    subject: str,
    expires_delta: timedelta,
    token_type: str,
    csrf_token: str,
    additional_claims: Dict[str, Any] | None = None,
) -> str:
    now = datetime.utcnow()
    payload: Dict[str, Any] = {
        "sub": subject,
        "iat": int(now.timestamp()),
        "exp": int((now + expires_delta).timestamp()),
        "type": token_type,
        "csrf": csrf_token,
    }
    if additional_claims:
        payload.update(additional_claims)
    return jwt.encode(payload, Config.SECRET_KEY, algorithm=Config.JWT_ALGORITHM)


def decode_token(token: str) -> Dict[str, Any]:
    try:
        return jwt.decode(token, Config.SECRET_KEY, algorithms=[Config.JWT_ALGORITHM])
    except JWTError as exc:
        raise credentials_exception() from exc


def ensure_csrf(header_token: str | None, claim_token: str) -> None:
    if not header_token or header_token != claim_token:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="CSRF token mismatch")
