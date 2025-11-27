from fastapi import FastAPI
from .api import articles

app = FastAPI()

app.include_router(articles.router, prefix="/api", tags=["articles"])
