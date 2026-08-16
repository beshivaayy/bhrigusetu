from datetime import date

def calculate_running_year(dob: date, on_date: date) -> int:
    years = on_date.year - dob.year
    completed = years if (on_date.month, on_date.day) >= (dob.month, dob.day) else years - 1
    return completed + 1

def analyze_bcp(running_year: int) -> dict:
    return {
        "status": "research_pending",
        "running_year": running_year,
        "activated_house": None,
        "cycle": None,
        "cycle_ruler": None,
        "message": "BCP rules are awaiting source verification."
    }
