from typing import List

from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from backend.schemas.article import ArticleCreate, ArticleResponse
from backend.services.article_service import ArticleService
from backend.repositories.article_repository import ArticleRepository
from backend.core.database import get_db

router = APIRouter()


def get_article_service(db: Session = Depends(get_db)) -> ArticleService:
    article_repository = ArticleRepository(db)
    return ArticleService(article_repository)


@router.post("/articles/", response_model=ArticleResponse)
def create_article(article: ArticleCreate, service: ArticleService = Depends(get_article_service)):
    """
    Endpoint to create a new article.
    """
    return service.create_article(article)


@router.get("/articles/", response_model=List[ArticleResponse])
def read_articles(service: ArticleService = Depends(get_article_service)):
    """
    Endpoint to get all articles.
    """
    return service.get_articles()


@router.get("/articles/search", response_model=List[ArticleResponse])
def search_articles(q: str, service: ArticleService = Depends(get_article_service)):
    """
    Search articles by title or content.
    """
    return service.search_articles(q)


@router.get("/articles/{article_id}", response_model=ArticleResponse)
def read_article(article_id: int, service: ArticleService = Depends(get_article_service)):
    """
    Endpoint to get a single article by its ID.
    """
    article = service.get_article_by_id(article_id)
    if article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    return article


@router.delete("/articles/{article_id}", status_code=204)
def delete_article(article_id: int, service: ArticleService = Depends(get_article_service)):
    """
    Delete an article by ID.
    """
    deleted = service.delete_article(article_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Article not found")
    return Response(status_code=204)
