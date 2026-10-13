from __future__ import annotations

import os
from dataclasses import dataclass, field


def _csv_env(name: str, default: str) -> list[str]:
    return [item.strip() for item in os.getenv(name, default).split(",") if item.strip()]


@dataclass(frozen=True)
class Settings:
    app_name: str = "Local Lens Backend"
    api_prefix: str = "/api/v1"
    database_url: str = os.getenv(
        "DATABASE_URL",
        "postgresql+asyncpg://locallens:locallens@localhost:5432/locallens",
    )
    cors_origins: list[str] = field(
        default_factory=lambda: _csv_env(
            "CORS_ORIGINS",
            "http://localhost:5173,http://127.0.0.1:5173",
        )
    )


settings = Settings()
