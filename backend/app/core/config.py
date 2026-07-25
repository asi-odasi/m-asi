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

    # MS SQL
    db_server: str = "localhost"
    db_port: int = 1433
    db_name: str = "masi"
    db_user: str = "sa"
    db_password: str = ""
    db_driver: str = "ODBC Driver 18 for SQL Server"

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
        odbc = (
            f"DRIVER={{{self.db_driver}}};"
            f"SERVER={self.db_server},{self.db_port};"
            f"DATABASE={self.db_name};"
            f"UID={self.db_user};"
            f"PWD={self.db_password};"
            "Encrypt=yes;"
            "TrustServerCertificate=yes;"
        )
        return f"mssql+pyodbc:///?odbc_connect={quote_plus(odbc)}"


@lru_cache
def get_settings() -> Settings:
    return Settings()
