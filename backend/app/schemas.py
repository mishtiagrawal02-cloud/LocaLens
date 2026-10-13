from __future__ import annotations

import uuid
from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

from app.models import AudioSessionStatus, UserRole


class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    full_name: str
    email: EmailStr
    role: UserRole


class NearbyExpert(BaseModel):
    expert_id: uuid.UUID
    user_id: uuid.UUID
    full_name: str
    email: EmailStr
    languages: list[str]
    hourly_rate_cents: int
    distance_meters: float


class CreateSessionRequest(BaseModel):
    traveler_id: uuid.UUID
    expert_id: uuid.UUID | None = None


class AudioSessionRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    traveler_id: uuid.UUID
    expert_id: uuid.UUID | None
    status: AudioSessionStatus
    start_time: datetime | None
    end_time: datetime | None
    total_cost_cents: int
    created_at: datetime


class WebSocketEnvelope(BaseModel):
    type: Literal[
        "sdp_offer",
        "sdp_answer",
        "ice_candidate",
        "gps_ping",
        "audio_control",
        "session_status",
    ]
    payload: dict[str, Any] = Field(default_factory=dict)

    @field_validator("payload")
    @classmethod
    def payload_must_be_object(cls, value: dict[str, Any]) -> dict[str, Any]:
        if not isinstance(value, dict):
            raise ValueError("payload must be a JSON object")
        return value
