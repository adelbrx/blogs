from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api import articles, auth
from backend.core.database import Base, engine

# ensure models are imported so Base has metadata
import backend.models

app = FastAPI()

# create tables from models
Base.metadata.create_all(bind=engine)

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api", tags=["auth"])
app.include_router(articles.router, prefix="/api", tags=["articles"])
