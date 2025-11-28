import pytest
from fastapi import HTTPException
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from backend.core import security
from backend.core.database import Base
from backend.repositories.auth_repository import AuthRepository
from backend.schemas.auth_schema import TokenRefreshRequest, UserCreate, UserLogin
from backend.services.auth_service import AuthService
from backend.models.user import User
import backend.models  # noqa: F401 - ensure models are imported for metadata


@pytest.fixture
def db_session():
    engine = create_engine("sqlite:///:memory:")
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture
def auth_service(db_session):
    return AuthService(AuthRepository(db_session))


def test_register_and_login_returns_tokens(auth_service, db_session):
    payload = UserCreate(email="user@example.com", password="supersecret", full_name="User")
    user = auth_service.register_user(payload)
    assert user.email == payload.email

    db_user = db_session.query(User).filter_by(email=payload.email).first()
    assert db_user is not None
    assert security.verify_password(payload.password, db_user.hashed_password)

    tokens = auth_service.login(UserLogin(email=payload.email, password=payload.password))
    access_claims = security.decode_token(tokens.access_token)
    assert access_claims["sub"] == str(db_user.id)
    assert access_claims["type"] == "access"
    assert tokens.csrf_token == access_claims["csrf"]


def test_register_duplicate_email_raises(auth_service):
    payload = UserCreate(email="dup@example.com", password="password123")
    auth_service.register_user(payload)
    with pytest.raises(HTTPException) as exc:
        auth_service.register_user(payload)
    assert exc.value.status_code == 400


def test_login_invalid_credentials(auth_service):
    auth_service.register_user(UserCreate(email="user@example.com", password="supersecret"))
    with pytest.raises(HTTPException) as exc:
        auth_service.login(UserLogin(email="user@example.com", password="wrong"))
    assert exc.value.status_code == 401


def test_inactive_user_cannot_login(auth_service, db_session):
    auth_service.register_user(UserCreate(email="user@example.com", password="supersecret"))
    user = db_session.query(User).filter_by(email="user@example.com").first()
    user.is_active = False
    db_session.commit()
    with pytest.raises(HTTPException) as exc:
        auth_service.login(UserLogin(email="user@example.com", password="supersecret"))
    assert exc.value.status_code == 403


def test_refresh_token(auth_service):
    auth_service.register_user(UserCreate(email="user@example.com", password="supersecret"))
    tokens = auth_service.login(UserLogin(email="user@example.com", password="supersecret"))
    refreshed = auth_service.refresh_tokens(TokenRefreshRequest(refresh_token=tokens.refresh_token).refresh_token)
    refreshed_claims = security.decode_token(refreshed.access_token)
    assert refreshed_claims["type"] == "access"
    assert refreshed.csrf_token == refreshed_claims["csrf"]


def test_current_user_requires_csrf(auth_service):
    auth_service.register_user(UserCreate(email="user@example.com", password="supersecret"))
    tokens = auth_service.login(UserLogin(email="user@example.com", password="supersecret"))
    with pytest.raises(HTTPException) as exc:
        auth_service.get_current_user(tokens.access_token, csrf_header=None)
    assert exc.value.status_code == 403

    user = auth_service.get_current_user(tokens.access_token, csrf_header=tokens.csrf_token)
    assert user.email == "user@example.com"
