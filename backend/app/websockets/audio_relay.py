from __future__ import annotations

import asyncio
import uuid
from dataclasses import dataclass, field
from typing import Literal

from fastapi import WebSocket
from pydantic import ValidationError
from starlette.websockets import WebSocketDisconnect, WebSocketState

from app.schemas import WebSocketEnvelope

ClientType = Literal["traveler", "expert"]


@dataclass
class SessionRoom:
    clients: dict[ClientType, WebSocket] = field(default_factory=dict)


class AudioSessionManager:
    """Routes WebRTC signaling and live telemetry between a traveler and an expert.

    Media should flow peer-to-peer via WebRTC. This manager only carries signaling,
    ICE candidates, GPS pings, and small session-control messages.
    """

    def __init__(self) -> None:
        self._rooms: dict[uuid.UUID, SessionRoom] = {}
        self._lock = asyncio.Lock()

    async def connect(self, session_id: uuid.UUID, client_type: ClientType, websocket: WebSocket) -> None:
        await websocket.accept()

        previous: WebSocket | None = None
        async with self._lock:
            room = self._rooms.setdefault(session_id, SessionRoom())
            previous = room.clients.get(client_type)
            room.clients[client_type] = websocket

        if previous and previous.application_state == WebSocketState.CONNECTED:
            await previous.close(code=4000, reason="A newer connection joined this session.")

        await self._send_json(
            websocket,
            {
                "type": "connection_ready",
                "session_id": str(session_id),
                "client_type": client_type,
                "peer_connected": await self.peer_connected(session_id, client_type),
            },
        )
        await self.broadcast_system_event(session_id, client_type, "peer_joined")

    async def disconnect(self, session_id: uuid.UUID, client_type: ClientType, websocket: WebSocket) -> None:
        should_delete_room = False
        async with self._lock:
            room = self._rooms.get(session_id)
            if not room:
                return

            if room.clients.get(client_type) is websocket:
                room.clients.pop(client_type, None)
                should_delete_room = not room.clients

            if should_delete_room:
                self._rooms.pop(session_id, None)

        if not should_delete_room:
            await self.broadcast_system_event(session_id, client_type, "peer_left")

    async def peer_connected(self, session_id: uuid.UUID, client_type: ClientType) -> bool:
        peer_type = self._peer_type(client_type)
        async with self._lock:
            peer = self._rooms.get(session_id, SessionRoom()).clients.get(peer_type)
        return peer is not None and peer.application_state == WebSocketState.CONNECTED

    async def relay(self, session_id: uuid.UUID, sender_type: ClientType, envelope: WebSocketEnvelope) -> None:
        peer_type = self._peer_type(sender_type)
        async with self._lock:
            peer = self._rooms.get(session_id, SessionRoom()).clients.get(peer_type)
            sender = self._rooms.get(session_id, SessionRoom()).clients.get(sender_type)

        if not peer or peer.application_state != WebSocketState.CONNECTED:
            if sender:
                await self._send_json(
                    sender,
                    {
                        "type": "peer_unavailable",
                        "session_id": str(session_id),
                        "target": peer_type,
                    },
                )
            return

        await self._send_json(
            peer,
            {
                "type": envelope.type,
                "session_id": str(session_id),
                "from": sender_type,
                "payload": envelope.payload,
            },
        )

    async def broadcast_system_event(self, session_id: uuid.UUID, source_type: ClientType, event_type: str) -> None:
        peer_type = self._peer_type(source_type)
        async with self._lock:
            peer = self._rooms.get(session_id, SessionRoom()).clients.get(peer_type)

        if peer and peer.application_state == WebSocketState.CONNECTED:
            await self._send_json(
                peer,
                {
                    "type": event_type,
                    "session_id": str(session_id),
                    "from": source_type,
                },
            )

    async def handle_connection(self, session_id: uuid.UUID, client_type: ClientType, websocket: WebSocket) -> None:
        await self.connect(session_id, client_type, websocket)

        try:
            while True:
                try:
                    raw_message = await websocket.receive_json()
                    envelope = WebSocketEnvelope.model_validate(raw_message)
                except ValidationError as exc:
                    await self._send_json(
                        websocket,
                        {
                            "type": "validation_error",
                            "errors": exc.errors(),
                        },
                    )
                    continue
                except ValueError:
                    await self._send_json(
                        websocket,
                        {
                            "type": "validation_error",
                            "errors": [{"msg": "Message must be valid JSON."}],
                        },
                    )
                    continue

                await self.relay(session_id, client_type, envelope)
        except WebSocketDisconnect:
            pass
        finally:
            await self.disconnect(session_id, client_type, websocket)

    @staticmethod
    def _peer_type(client_type: ClientType) -> ClientType:
        return "expert" if client_type == "traveler" else "traveler"

    @staticmethod
    async def _send_json(websocket: WebSocket, payload: dict[str, object]) -> None:
        if websocket.application_state == WebSocketState.CONNECTED:
            await websocket.send_json(payload)


audio_session_manager = AudioSessionManager()
