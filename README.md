# Blogs App (Clean Code course)

FastAPI + SQLite backend with seeded articles, React/Vite frontend with search/create/delete.

## Run with Docker (recommended)
Prereqs: Docker daemon running (Docker Desktop/Colima).

```bash
# from repo root
docker compose build
docker compose up -d

# logs
docker compose logs -f backend
docker compose logs -f frontend
```

Apps:
- API & Swagger: http://localhost:8000/docs
- Frontend: http://localhost:5173

Notes:
- Backend seeds 6 demo articles at container start if the DB is empty.
- SQLite file lives in the `backend_data` volume (`/data/test.db` in the container).

## Run locally without Docker
Prereqs: Python 3.12+, Node 18+ (or 20+), npm.

Backend:
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python -m backend.seed_data   # optional: seed demo articles once
uvicorn backend.main:app --reload
# API at http://127.0.0.1:8000/docs
```

Frontend (new terminal):
```bash
cd frontend
npm install
# ensure the API URL points to your backend
export VITE_API_URL=http://localhost:8000
npm run dev  # http://localhost:5173
```

## Configuration
- Database: `DATABASE_URL` env var (defaults to `sqlite:///./test.db`). In Docker compose it is set to `sqlite:////data/test.db`.
- Frontend API URL: `VITE_API_URL` (used at build time). In compose it is set to `http://localhost:8000`.

## Useful commands
- Rebuild containers after changes: `docker compose build`
- Restart stack: `docker compose up -d --force-recreate`
- Tear down: `docker compose down`
