from datetime import date
from app.bcp.engine import calculate_running_year

def test_birthday_boundary():
    assert calculate_running_year(date(2000, 1, 1), date(2026, 1, 1)) == 27
    assert calculate_running_year(date(2000, 1, 1), date(2025, 12, 31)) == 26
