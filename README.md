# 🌍 LocaLens

**Real-time location-based guidance and expert assistance platform**

LocaLens connects travelers with local experts for real-time audio assistance, navigation help, translation services, and emergency support through an interactive map interface.

## 🎯 Features

### For Travelers
- 🗺️ **Interactive Map** - Real-time navigation with expert markers and route guidance
- 🎙️ **Live Audio Sessions** - Connect with local experts via WebRTC audio
- 🌐 **Translation Services** - Break language barriers with real-time translation
- 🚨 **Emergency Assistance** - Quick access to emergency help
- ♿ **Accessibility Filters** - Find wheelchair-accessible routes and locations
- 📍 **Location Tracking** - Real-time geolocation with turn-by-turn guidance

### For Local Experts
- 💰 **Earnings Dashboard** - Track your earnings from helping travelers
- 📞 **Incoming Request Queue** - Manage incoming traveler requests
- 🗺️ **Map Pin Pusher** - Push locations and routes to travelers in real-time
- ⚡ **Quick Tip Dispatcher** - Send instant tips and advice

## 🏗️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Leaflet** for interactive maps
- **WebRTC** for peer-to-peer audio communication
- **WebSocket** for real-time updates
- **Tailwind CSS** for styling

### Backend
- **FastAPI** (Python) for high-performance REST API
- **WebSocket** support for real-time communication
- **PostgreSQL** database
- **SQLAlchemy** ORM
- **Pydantic** for data validation

## 📁 Project Structure

```
LocaLens/
├── frontend/          # React + TypeScript frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── traveler/    # Traveler-specific components
│   │   │   ├── expert/      # Expert-specific components
│   │   │   └── common/      # Shared components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── context/         # State management
│   │   ├── pages/           # Main page components
│   │   └── types/           # TypeScript definitions
│   └── public/
│
└── backend/           # FastAPI backend
    ├── app/
    │   ├── core/            # Configuration
    │   ├── websockets/      # WebSocket handlers
    │   ├── models.py        # Database models
    │   ├── schemas.py       # Pydantic schemas
    │   ├── database.py      # Database connection
    │   └── main.py          # FastAPI app
    └── schema.sql           # Database schema
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+)
- **Python** (v3.9+)
- **PostgreSQL** (v13+)

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`

### Backend Setup

1. Create a virtual environment:
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
Create a `.env` file in the backend directory:
```env
DATABASE_URL=postgresql://user:password@localhost/localens
SECRET_KEY=your-secret-key-here
```

4. Set up the database:
```bash
# Create the database
createdb localens

# Run the schema
psql localens < schema.sql
```

5. Start the server:
```bash
uvicorn app.main:app --reload
```

The backend will run on `http://localhost:8000`

## 🔌 API Documentation

Once the backend is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 🗺️ Key Components

### Interactive Map (`InteractiveMap.tsx`)
- Real-time location tracking
- Expert markers
- Route visualization
- User location updates

### Session Management (`ActiveSessionProvider.tsx`)
- WebSocket connection management
- Session state tracking
- Audio stream handling

### WebRTC Audio (`useWebRTC.ts`)
- Peer-to-peer audio connection
- Microphone access
- Audio streaming

## 🌐 WebSocket Events

The application uses WebSocket for real-time communication:

**Client → Server:**
- `location_update` - Send traveler location
- `request_expert` - Request expert assistance
- `end_session` - End active session

**Server → Client:**
- `expert_joined` - Expert joined session
- `route_update` - New route data
- `session_ended` - Session terminated

## 📝 Environment Variables

### Frontend
Create `.env` in the frontend directory:
```env
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
```

### Backend
Create `.env` in the backend directory:
```env
DATABASE_URL=postgresql://user:password@localhost/localens
SECRET_KEY=your-secret-key-here
CORS_ORIGINS=http://localhost:5173
```

## 🧪 Testing

### Frontend
```bash
cd frontend
npm run test
```

### Backend
```bash
cd backend
pytest
```

## 📦 Building for Production

### Frontend
```bash
cd frontend
npm run build
```

### Backend
```bash
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## 🚢 Deployment

### Vercel (Frontend)
The frontend is optimized for Vercel deployment:
1. Import the `frontend` directory
2. Vercel will auto-detect Vite
3. Add environment variables in Vercel dashboard

### Backend Options
- **Render** - Easy Python deployment
- **Railway** - Simple deployment with PostgreSQL
- **AWS/GCP** - Full control and scalability

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

Built with ❤️ by the LocaLens team

## 🔗 Links

- **GitHub**: https://github.com/mishtiagrawal02-cloud/LocaLens
- **Documentation**: [Coming soon]
- **Live Demo**: [Coming soon]

---

**Note**: This is a prototype/MVP. Features are continuously being added and improved.
