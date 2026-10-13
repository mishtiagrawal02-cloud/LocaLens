from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Literal

from fastapi import Depends, FastAPI, HTTPException, Query, WebSocket, WebSocketException, status
from fastapi.middleware.cors import CORSMiddleware
from geoalchemy2 import Geography
from geoalchemy2.functions import ST_Distance, ST_DWithin
from sqlalchemy import cast, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.database import get_db
from app.models import AudioSession, AudioSessionStatus, ExpertProfile, User, UserRole
from app.schemas import AudioSessionRead, CreateSessionRequest, NearbyExpert
from app.websockets.audio_relay import audio_session_manager

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/healthz")
async def healthz() -> dict[str, str]:
    return {"status": "ok"}


@app.websocket("/ws/session/{session_id}")
async def websocket_session(
    websocket: WebSocket,
    session_id: uuid.UUID,
    client_type: Literal["traveler", "expert"] = Query(...),
    db: AsyncSession = Depends(get_db),
) -> None:
    if client_type not in ("traveler", "expert"):
        raise WebSocketException(code=status.WS_1008_POLICY_VIOLATION, reason="Invalid client_type")

    session = await db.get(AudioSession, session_id)
    if not session:
        raise WebSocketException(code=status.WS_1008_POLICY_VIOLATION, reason="Session not found")

    await audio_session_manager.handle_connection(session_id, client_type, websocket)


@app.get(f"{settings.api_prefix}/experts/nearby", response_model=list[NearbyExpert])
async def nearby_experts(
    lat: float = Query(..., ge=-90, le=90),
    lng: float = Query(..., ge=-180, le=180),
    radius_km: float = Query(5.0, gt=0, le=100),
    db: AsyncSession = Depends(get_db),
) -> list[NearbyExpert]:
    user_point = cast(
        func.ST_SetSRID(func.ST_MakePoint(lng, lat), 4326),
        Geography(geometry_type="POINT", srid=4326),
    )
    radius_meters = radius_km * 1000
    distance = ST_Distance(ExpertProfile.coverage_location, user_point).label("distance_meters")

    stmt = (
        select(
            ExpertProfile.id.label("expert_id"),
            ExpertProfile.user_id,
            User.full_name,
            User.email,
            ExpertProfile.languages,
            ExpertProfile.hourly_rate_cents,
            distance,
        )
        .join(User, User.id == ExpertProfile.user_id)
        .where(
            User.role == UserRole.expert,
            ExpertProfile.is_online.is_(True),
            ST_DWithin(ExpertProfile.coverage_location, user_point, radius_meters),
        )
        .order_by(distance)
    )

    result = await db.execute(stmt)
    return [
        NearbyExpert(
            expert_id=row.expert_id,
            user_id=row.user_id,
            full_name=row.full_name,
            email=row.email,
            languages=row.languages,
            hourly_rate_cents=row.hourly_rate_cents,
            distance_meters=float(row.distance_meters),
        )
        for row in result
    ]


@app.post(f"{settings.api_prefix}/sessions/create", response_model=AudioSessionRead, status_code=201)
async def create_session(
    payload: CreateSessionRequest,
    db: AsyncSession = Depends(get_db),
) -> AudioSession:
    traveler = await db.get(User, payload.traveler_id)
    if not traveler or traveler.role != UserRole.traveler:
        raise HTTPException(status_code=404, detail="Traveler not found")

    status_value = AudioSessionStatus.matching
    if payload.expert_id:
        expert = await db.get(User, payload.expert_id)
        if not expert or expert.role != UserRole.expert:
            raise HTTPException(status_code=404, detail="Expert not found")
        status_value = AudioSessionStatus.active

    session = AudioSession(
        traveler_id=payload.traveler_id,
        expert_id=payload.expert_id,
        status=status_value,
        start_time=datetime.now(timezone.utc) if status_value == AudioSessionStatus.active else None,
    )
    db.add(session)
    await db.commit()
    await db.refresh(session)
    return session
