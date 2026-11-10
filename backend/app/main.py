import os
from datetime import datetime
from zoneinfo import ZoneInfo
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .models import BirthDetails
from .bcp.engine import calculate_running_year, analyze_bcp
from .bsp.engine import analyze_bsp
from .rules import load_catalog, enabled_rules

app = FastAPI(
    title="BhriguSetu API",
    version="0.2.0",
    description="Research-first BCP and BSP application. Unverified predictive rules are disabled.",
)
_default_origins = ["http://localhost:3000", "http://127.0.0.1:3000"]
_configured_origins = [item.strip() for item in os.getenv("CORS_ORIGINS", "").split(",") if item.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=_configured_origins or _default_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

@app.get("/health")
def health():
    return {"status": "ok", "service": "bhrigusetu-api", "version": app.version}

@app.get("/api/rules/status")
def rule_status():
    catalog = load_catalog()
    return {
        "method": catalog["method"],
        "total_rules": len(catalog["rules"]),
        "enabled_rules": len(enabled_rules()),
        "status": "research_pending" if not enabled_rules() else "rules_available",
    }

@app.post("/api/analyze")
def analyze(birth: BirthDetails):
    local_today = datetime.now(ZoneInfo(birth.timezone)).date()
    analysis_date = birth.as_of_date or local_today
    running_year = calculate_running_year(birth.date_of_birth, analysis_date)
    return {
        "status": "partial_calculation",
        "methodology_status": "research_pending",
        "analysis_date": analysis_date.isoformat(),
        "birth_details": {
            "date_of_birth": birth.date_of_birth.isoformat(),
            "time_of_birth": birth.time_of_birth.isoformat(),
            "place_name": birth.place_name,
            "latitude": birth.latitude,
            "longitude": birth.longitude,
            "timezone": birth.timezone,
        },
        "running_year": running_year,
        "bcp": analyze_bcp(running_year),
        "bsp": analyze_bsp(running_year),
        "chart": {
            "status": "not_calculated",
            "reason": "Astronomical chart calculation is not enabled until ephemeris settings and reference test cases are verified.",
        },
        "warnings": [
            "This is a research foundation, not a complete horoscope or prediction.",
            "BCP house activation follows the current working arithmetic; chakra-swami mapping still requires primary-source verification.",
            "No BSP prediction rules are enabled.",
            "Planetary positions, ascendant and houses have not been calculated.",
        ],
    }
