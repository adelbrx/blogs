from fastapi import APIRouter, Depends, Header, HTTPException, status
from sqlalchemy.orm import Session

from backend.core.security import credentials_exception
from backend.core.database import get_db
from backend.repositories.auth_repository import AuthRepository
from backend.schemas.auth_schema import (
    TokenRefreshRequest,
    TokenResponse,
    UserCreate,
    UserLogin,
    UserResponse,
)
from backend.services.auth_service import AuthService

router = APIRouter()


def get_auth_service(db: Session = Depends(get_db)) -> AuthService:
    return AuthService(AuthRepository(db))


def extract_bearer_token(authorization: str | None) -> str:
    if not authorization:
        raise credentials_exception()
    parts = authorization.split()
    if parts[0].lower() != "bearer" or len(parts) != 2:
        raise credentials_exception()
    return parts[1]


@router.post("/auth/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register_user(payload: UserCreate, auth_service: AuthService = Depends(get_auth_service)):
    auth_service.register_user(payload)
    return auth_service.login(UserLogin(email=payload.email, password=payload.password))


@router.post("/auth/login", response_model=TokenResponse)
def login(payload: UserLogin, auth_service: AuthService = Depends(get_auth_service)):
    return auth_service.login(payload)


@router.post("/auth/refresh", response_model=TokenResponse)
def refresh_tokens(
    payload: TokenRefreshRequest,
    auth_service: AuthService = Depends(get_auth_service),
):
    return auth_service.refresh_tokens(payload.refresh_token)


@router.get("/auth/me", response_model=UserResponse)
def read_profile(
    authorization: str | None = Header(None),
    x_csrf_token: str | None = Header(None),
    auth_service: AuthService = Depends(get_auth_service),
):
    token = extract_bearer_token(authorization)
    return auth_service.get_current_user(token, x_csrf_token)
