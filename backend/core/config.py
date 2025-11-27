import os


class Config:
    # Default to SQLite for development
    DATABASE_URL = "sqlite:///./test.db"
    SQLALCHEMY_DATABASE_URI = DATABASE_URL
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = "blogs-secret-key"
