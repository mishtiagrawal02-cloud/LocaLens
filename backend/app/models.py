from __future__ import annotations

import enum
import uuid
from datetime import datetime

from geoalchemy2 import Geography
from sqlalchemy import ARRAY, Boolean, CheckConstraint, DateTime, Enum, ForeignKey, Index, Integer, Text, func, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class UserRole(str, enum.Enum):
    traveler = "traveler"
    expert = "expert"
    admin = "admin"


class AudioSessionStatus(str, enum.Enum):
    matching = "matching"
    active = "active"
    completed = "completed"
    cancelled = "cancelled"


class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )


class User(TimestampMixin, Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    full_name: Mapped[str] = mapped_column(Text, nullable=False)
    email: Mapped[str] = mapped_column(Text, unique=True, index=True, nullable=False)
    role: Mapped[UserRole] = mapped_column(Enum(UserRole, name="user_role"), nullable=False)

    expert_profile: Mapped["ExpertProfile | None"] = relationship(
        back_populates="user",
        cascade="all, delete-orphan",
        uselist=False,
    )
    traveler_sessions: Mapped[list["AudioSession"]] = relationship(
        back_populates="traveler",
        foreign_keys="AudioSession.traveler_id",
    )
    expert_sessions: Mapped[list["AudioSession"]] = relationship(
        back_populates="expert",
        foreign_keys="AudioSession.expert_id",
    )


class ExpertProfile(TimestampMixin, Base):
    __tablename__ = "expert_profiles"
    __table_args__ = (
        Index("idx_expert_coverage", "coverage_location", postgresql_using="gist"),
        Index("idx_expert_online", "is_online", postgresql_where=text("is_online = true")),
        CheckConstraint("hourly_rate_cents >= 0", name="ck_expert_hourly_rate_non_negative"),
    )

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    languages: Mapped[list[str]] = mapped_column(ARRAY(Text), nullable=False, server_default="{}")
    hourly_rate_cents: Mapped[int] = mapped_column(Integer, nullable=False)
    is_online: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False, server_default="false")
    coverage_location: Mapped[str] = mapped_column(Geography(geometry_type="POINT", srid=4326), nullable=False)

    user: Mapped[User] = relationship(back_populates="expert_profile")


class AudioSession(TimestampMixin, Base):
    __tablename__ = "audio_sessions"
    __table_args__ = (
        CheckConstraint("total_cost_cents >= 0", name="ck_audio_session_total_cost_non_negative"),
        CheckConstraint(
            "end_time IS NULL OR start_time IS NULL OR end_time >= start_time",
            name="ck_audio_session_end_after_start",
        ),
        Index("idx_audio_sessions_traveler", "traveler_id"),
        Index("idx_audio_sessions_expert", "expert_id"),
        Index("idx_audio_sessions_status", "status"),
    )

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    traveler_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="RESTRICT"), nullable=False)
    expert_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("users.id", ondelete="RESTRICT"), nullable=True)
    status: Mapped[AudioSessionStatus] = mapped_column(
        Enum(AudioSessionStatus, name="audio_session_status"),
        nullable=False,
        default=AudioSessionStatus.matching,
        server_default=AudioSessionStatus.matching.value,
    )
    start_time: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    end_time: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    total_cost_cents: Mapped[int] = mapped_column(Integer, nullable=False, default=0, server_default="0")

    traveler: Mapped[User] = relationship(back_populates="traveler_sessions", foreign_keys=[traveler_id])
    expert: Mapped[User | None] = relationship(back_populates="expert_sessions", foreign_keys=[expert_id])
