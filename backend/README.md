# Local Lens Backend

FastAPI backend for the Local Lens real-time audio co-pilot platform.

## Run Locally

```bash
cd backend
python3.11 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
export DATABASE_URL="postgresql+asyncpg://locallens:locallens@localhost:5432/locallens"
export DATABASE_URL_SYNC="postgresql://locallens:locallens@localhost:5432/locallens"
psql "$DATABASE_URL_SYNC" -f schema.sql
uvicorn app.main:app --reload
```

`schema.sql` expects PostgreSQL with PostGIS enabled. `DATABASE_URL` is the async SQLAlchemy URL used by the app; `DATABASE_URL_SYNC` is the standard libpq URL used by `psql`.

## Key Endpoints

- `GET /healthz`
- `GET /api/v1/experts/nearby?lat=41.8902&lng=12.4922&radius_km=5`
- `POST /api/v1/sessions/create`
- `WS /ws/session/{session_id}?client_type=traveler`
- `WS /ws/session/{session_id}?client_type=expert`

WebSocket messages use this envelope:

```json
{
  "type": "sdp_offer",
  "payload": {}
}
```

Supported message types are `sdp_offer`, `sdp_answer`, `ice_candidate`, `gps_ping`, `audio_control`, and `session_status`.
