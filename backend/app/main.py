from datetime import date
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .models import BirthDetails
from .bcp.engine import calculate_running_year, analyze_bcp
from .bsp.engine import analyze_bsp

app = FastAPI(title="BhriguSetu API", version="0.1.0")
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:3000"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

@app.get("/health")
def health():
    return {"status": "ok", "service": "bhrigusetu-api"}

@app.post("/api/analyze")
def analyze(birth: BirthDetails):
    running_year = calculate_running_year(birth.date_of_birth, date.today())
    return {
        "status": "foundation_ready",
        "methodology_status": "research_pending",
        "running_year": running_year,
        "bcp": analyze_bcp(running_year),
        "bsp": analyze_bsp(running_year),
        "warnings": ["This is a foundation build. No unverified BCP/BSP prediction rules are enabled."]
    }
