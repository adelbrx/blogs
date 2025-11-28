import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from backend.core.database import Base
from backend.models.article import Article
from backend.repositories.article_repository import ArticleRepository
from backend.schemas.article import ArticleCreate
from backend.services.article_service import ArticleService
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
def article_service(db_session):
    repo = ArticleRepository(db_session)
    return ArticleService(repo)


def test_create_and_get_article(article_service, db_session):
    payload = ArticleCreate(title="Hello", content="World")
    created = article_service.create_article(payload)
    assert created.title == payload.title
    assert created.content == payload.content

    fetched = article_service.get_article_by_id(created.id)
    assert fetched.id == created.id
    assert fetched.title == payload.title


def test_get_articles_returns_all(article_service, db_session):
    db_session.add_all(
        [Article(title="One", content="A"), Article(title="Two", content="B")]
    )
    db_session.commit()

    articles = article_service.get_articles()
    titles = {a.title for a in articles}
    assert titles == {"One", "Two"}


def test_delete_article(article_service, db_session):
    article = Article(title="Temp", content="To delete")
    db_session.add(article)
    db_session.commit()

    ok = article_service.delete_article(article.id)
    assert ok is True
    assert article_service.get_article_by_id(article.id) is None

    # deleting again should return False
    assert article_service.delete_article(article.id) is False


def test_search_articles(article_service, db_session):
    db_session.add_all(
        [
            Article(title="FastAPI Intro", content="great"),
            Article(title="React Tips", content="hooks"),
            Article(title="Unrelated", content="other"),
        ]
    )
    db_session.commit()

    results = article_service.search_articles("React")
    assert len(results) == 1
    assert results[0].title == "React Tips"
