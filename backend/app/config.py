from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "Shop Backend"
    app_version: str = "0.1"
    debug: bool = True
    database_url: str = "sqlite:///./shop.db"
    cors_origins: list[str] = ["http://localhost:3000"]
    static_dir: str = "static"
    images_dir: str = "static/images"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()
