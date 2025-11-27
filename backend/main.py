from fastapi import FastAPI

import backend.models  # ensure models are imported so metadata is populated
from backend.api import articles
from backend.core.database import Base, engine

# Create database tables at startup (SQLite by default).
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(articles.router, prefix="/api", tags=["articles"])
