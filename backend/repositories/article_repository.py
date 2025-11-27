from sqlalchemy.orm import Session
from backend.models.article import Article


class ArticleRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_article(self, title: str, content: str):
        db_article = Article(title=title, content=content)
        self.db.add(db_article)
        self.db.commit()
        self.db.refresh(db_article)
        return db_article

    def get_articles(self):
        return self.db.query(Article).all()

    def get_article_by_id(self, article_id: int):
        return self.db.query(Article).filter(Article.id == article_id).first()
