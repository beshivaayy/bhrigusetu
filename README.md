# BhriguSetu

**BCP • BSP — Research-Based Vedic Prediction Engine**

A research-first application foundation for Bhrigu Chakra Paddhati (BCP) and Bhrigu Saral Paddhati (BSP).

This is intentionally a foundation: no unverified astrological rules are presented as production truth. The calculation layer is isolated so the verified research engine can be integrated later.

## Structure
- `frontend/` — Next.js + TypeScript UI
- `backend/` — FastAPI calculation API
- `research/` — methodology/source audit documents
- `docs/` — architecture/product notes

## Run

### Backend
```bash
cd backend
python -m venv .venv
.venv\\Scripts\\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`.
