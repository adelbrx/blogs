from pydantic import BaseModel


class ArticleCreate(BaseModel):
    title: str
    content: str

    class Config:
        orm_mode = True


class ArticleResponse(BaseModel):
    id: int
    title: str
    content: str

    class Config:
        orm_mode = True
