from datetime import timedelta
from fastapi import HTTPException, status

from backend.core import security
from backend.core.config import Config
from backend.repositories.auth_repository import AuthRepository
from backend.schemas.auth_schema import (
    TokenPayload,
    TokenResponse,
    UserCreate,
    UserLogin,
    UserResponse,
)


class AuthService:
    def __init__(self, auth_repository: AuthRepository):
        self.auth_repository = auth_repository

    def register_user(self, user_create: UserCreate) -> UserResponse:
        existing = self.auth_repository.get_by_email(user_create.email)
        if existing:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already exists")
        hashed_password = security.hash_password(user_create.password)
        user = self.auth_repository.create_user(
            email=user_create.email, full_name=user_create.full_name, hashed_password=hashed_password
        )
        return self._to_response(user)

    def login(self, credentials: UserLogin) -> TokenResponse:
        user = self.auth_repository.get_by_email(credentials.email)
        if not user or not security.verify_password(credentials.password, user.hashed_password):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
        if not user.is_active:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Inactive account")
        return self._issue_tokens(str(user.id))

    def refresh_tokens(self, refresh_token: str) -> TokenResponse:
        payload = self._decode_token(refresh_token, expected_type="refresh")
        user = self._get_user_from_payload(payload)
        if not user.is_active:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Inactive account")
        return self._issue_tokens(str(user.id))

    def get_current_user(self, token: str, csrf_header: str | None) -> UserResponse:
        payload = self._decode_token(token, expected_type="access")
        security.ensure_csrf(csrf_header, payload.csrf)
        user = self._get_user_from_payload(payload)
        if not user.is_active:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Inactive account")
        return self._to_response(user)

    def _issue_tokens(self, subject: str) -> TokenResponse:
        csrf_token = security.create_csrf_token()
        access_expires = timedelta(minutes=Config.ACCESS_TOKEN_EXPIRE_MINUTES)
        refresh_expires = timedelta(minutes=Config.REFRESH_TOKEN_EXPIRE_MINUTES)
        access_token = security.create_token(
            subject=subject,
            expires_delta=access_expires,
            token_type="access",
            csrf_token=csrf_token,
        )
        refresh_token = security.create_token(
            subject=subject,
            expires_delta=refresh_expires,
            token_type="refresh",
            csrf_token=csrf_token,
        )
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=int(access_expires.total_seconds()),
            csrf_token=csrf_token,
        )

    def _decode_token(self, token: str, expected_type: str) -> TokenPayload:
        payload_dict = security.decode_token(token)
        if payload_dict.get("type") != expected_type:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type")
        return TokenPayload(**payload_dict)

    def _get_user_from_payload(self, payload: TokenPayload):
        user_id = int(payload.sub)
        user = self.auth_repository.get_by_id(user_id)
        if not user:
            raise security.credentials_exception()
        return user

    @staticmethod
    def _to_response(user) -> UserResponse:
        return UserResponse(
            id=user.id,
            email=user.email,
            full_name=user.full_name,
            is_active=user.is_active,
            created_at=user.created_at,
        )
