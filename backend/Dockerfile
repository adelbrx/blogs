FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Keep the backend package layout intact
COPY backend ./backend

EXPOSE 8000

CMD ["sh", "-c", "python -m backend.seed_data && uvicorn backend.main:app --host 0.0.0.0 --port 8000"]
