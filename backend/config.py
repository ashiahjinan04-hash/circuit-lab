from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Circuit Lab - Antigravity Backend"
    MONGODB_URL: str
    DATABASE_NAME: str = "circuit_lab"
    SECRET_KEY: str = "super-secret-antigravity-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    MAX_CIRCUIT_SIZE_BYTES: int = 200 * 1024  # 200KB

    class Config:
        case_sensitive = True

settings = Settings()