from typing import List
from backend.repositories.article_repository import ArticleRepository
from backend.schemas.article import ArticleCreate, ArticleResponse


class ArticleService:
    def __init__(self, article_repository: ArticleRepository):
        self.article_repository = article_repository

    def create_article(self, article_create: ArticleCreate) -> ArticleResponse:
        """
        Creates a new article and returns the ArticleResponse.
        """
        article = self.article_repository.create_article(
            article_create.title, article_create.content)
        return ArticleResponse(id=article.id, title=article.title, content=article.content)

    def get_articles(self) -> List[ArticleResponse]:
        """
        Fetches all articles and returns a list of ArticleResponse.
        """
        articles = self.article_repository.get_articles()
        return [ArticleResponse(id=article.id, title=article.title, content=article.content) for article in articles]

    def get_article_by_id(self, article_id: int) -> ArticleResponse:
        """
        Fetches a single article by its ID.
        """
        article = self.article_repository.get_article_by_id(article_id)
        if article is None:
            return None
        return ArticleResponse(id=article.id, title=article.title, content=article.content)

    def search_articles(self, query: str) -> List[ArticleResponse]:
        """
        Search articles by title or content containing the query string.
        """
        articles = self.article_repository.search_articles(query)
        return [ArticleResponse(id=article.id, title=article.title, content=article.content) for article in articles]

    def delete_article(self, article_id: int) -> bool:
        """
        Delete an article by ID. Returns True if deleted, False if not found.
        """
        return self.article_repository.delete_article(article_id)
