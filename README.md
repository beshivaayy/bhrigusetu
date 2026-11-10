# BhriguSetu

**Bhrigu Chakra Paddhati (BCP) · Bhrigu Saral Paddhati (BSP)**

BhriguSetu is a research-first application for source-traceable BCP and BSP calculations. The project deliberately separates astronomical calculations, BCP logic, BSP rules, interpretation and presentation.

## Current implementation status

- Birth details API with coordinate and IANA timezone validation.
- Birth wall-time resolution to UTC with DST nonexistent/ambiguous-time safeguards.
- Exact seconds and optional DST fold selection supported by the frontend.
- Running-year calculation based on the birthday and the selected timezone's local date.
- BCP 12-house activation arithmetic and cycle index.
- Chakra-swami labels are exposed as provisional pending primary-source verification.
- BSP rule evaluator exposes five source-linked research candidates, all disabled pending verification.
- BSP-7 Kakshya slot lookup (eight 3°45′ divisions) is implemented as a standalone, non-predictive utility.
- Frontend is connected to the FastAPI analysis endpoint.
- Astronomical chart calculation (planetary positions, ascendant and houses) is not yet enabled.
- This release is a partial calculation foundation, not a complete horoscope or prediction service.

## Repository structure

- frontend/ — Next.js + TypeScript user interface
- backend/ — FastAPI API and calculation modules
- research/ — methodology, source matrix and conflicts
- docs/ — architecture and implementation notes

## Local development

### Backend (Windows PowerShell)

~~~powershell
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
~~~

### Frontend (new terminal)

~~~powershell
cd frontend
npm install
$env:NEXT_PUBLIC_API_BASE_URL="http://localhost:8000"
npm run dev
~~~

Open http://localhost:3000. API health: http://localhost:8000/health. Interactive API docs: http://localhost:8000/docs.

## Configuration

Backend:
- CORS_ORIGINS — comma-separated allowed frontend origins. Defaults to localhost:3000 and 127.0.0.1:3000.

Frontend:
- NEXT_PUBLIC_API_BASE_URL — public API base URL. Defaults to http://localhost:8000.

Do not commit secrets or private credentials. Use HTTPS for deployed API origins.

## Test backend

~~~powershell
cd backend
pip install -r requirements.txt
pytest -q
~~~

## Astronomy and licensing

See [research/ASTRONOMY_AND_LICENSING.md](research/ASTRONOMY_AND_LICENSING.md) before selecting an ephemeris dependency. Swiss Ephemeris has a dual-licensing requirement; it is not added until the project makes an explicit licence decision. The BCP cycle-lord sequence has secondary corroboration only; see [research/BCP_CYCLE_LORD_EVIDENCE.md](research/BCP_CYCLE_LORD_EVIDENCE.md).

## Research and accuracy policy

1. Sunil John / original Saptarishis BSP and BCP material receives highest priority for system-specific rules.
2. Deepanshu Giri is used for cross-checking and practical teaching context.
3. Sanjay Rath is used for foundational Jyotish corroboration where applicable.
4. Generic Parashari rules are not automatically treated as BSP rules.
5. Every production rule must have an exact source location, explicit preconditions, deterministic calculation, confidence rationale and reproducible test case.
6. Conflicts are documented, not silently averaged.

See research/BCP_SPECIFICATION.md, research/BSP_SPECIFICATION.md, research/SOURCE_MATRIX.md and research/CONFLICTS.md before enabling predictive logic.

## Run full stack with Docker

From the repository root:

~~~powershell
docker compose up --build
~~~

Open http://localhost:3000. Stop with Ctrl+C; remove the containers with:

~~~powershell
docker compose down
~~~

The frontend and API are separate services. The Docker setup is intended for local evaluation; production deployment still requires public HTTPS origins and explicit CORS configuration.
