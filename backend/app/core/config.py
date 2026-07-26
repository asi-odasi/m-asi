from functools import lru_cache
from urllib.parse import quote_plus

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Hem backend/.env hem de proje kökündeki .env desteklenir (kökteki dosya varsa üzerine yazar).
    model_config = SettingsConfigDict(
        env_file=(".env", "../.env"), env_file_encoding="utf-8", extra="ignore"
    )

    # Gemini (LLM / Embedding)
    gemini_api_key: str = ""
    gemini_embedding_model: str = "gemini-embedding-001"
    embedding_dimensions: int = 768

    # Semantik filtre
    similarity_threshold: float = 0.75
    reference_concepts: str = "disinformation,fake news,misinformation,propaganda,information manipulation"

    # arXiv
    arxiv_search_query: str = "all:disinformation"
    arxiv_max_results: int = 50

    # Hugging Face
    hf_dataset_id: str = "iletisim/dezenformasyon-bultenleri"
    hf_dataset_config: str = "default"
    hf_dataset_split: str = "train"

    # Kaggle
    kaggle_username: str = ""
    kaggle_key: str = ""
    kaggle_default_query: str = "Turkish fake news"

    # PostgreSQL
    database_url: str = ""
    db_server: str = "localhost"
    db_port: int = 5432
    db_name: str = "masi"
    db_user: str = "postgres"
    db_password: str = ""

    # API
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    cors_origins: str = "http://localhost:3000"

    @property
    def reference_concepts_list(self) -> list[str]:
        return [c.strip() for c in self.reference_concepts.split(",") if c.strip()]

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    @property
    def sqlalchemy_database_uri(self) -> str:
        if self.database_url:
            return self.database_url
        return (
            f"postgresql+psycopg2://{quote_plus(self.db_user)}:{quote_plus(self.db_password)}"
            f"@{self.db_server}:{self.db_port}/{self.db_name}"
        )


@lru_cache
def get_settings() -> Settings:
    return Settings()
