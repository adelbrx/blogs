from pydantic import BaseModel, ConfigDict


class ArticleCreate(BaseModel):
    title: str
    content: str

    model_config = ConfigDict(from_attributes=True)


class ArticleResponse(BaseModel):
    id: int
    title: str
    content: str

    model_config = ConfigDict(from_attributes=True)
