from datetime import date, time, timezone
import pytest
from app.astronomy.time import resolve_local_datetime

def test_india_local_time_resolves_to_utc():
    resolved = resolve_local_datetime(date(2000, 1, 1), time(9, 40), "Asia/Kolkata")
    assert resolved.isoformat() == "2000-01-01T09:40:00+05:30"
    assert resolved.astimezone(timezone.utc).isoformat() == "2000-01-01T04:10:00+00:00"

def test_nonexistent_dst_time_is_rejected():
    with pytest.raises(ValueError, match="does not exist"):
        resolve_local_datetime(date(2024, 3, 10), time(2, 30), "America/New_York")

def test_ambiguous_dst_time_requires_fold():
    with pytest.raises(ValueError, match="occurs twice"):
        resolve_local_datetime(date(2024, 11, 3), time(1, 30), "America/New_York")

def test_ambiguous_dst_time_fold_selects_distinct_instants():
    earlier = resolve_local_datetime(date(2024, 11, 3), time(1, 30), "America/New_York", 0)
    later = resolve_local_datetime(date(2024, 11, 3), time(1, 30), "America/New_York", 1)
    assert earlier.utcoffset().total_seconds() == -4 * 3600
    assert later.utcoffset().total_seconds() == -5 * 3600
    assert earlier.astimezone(timezone.utc) != later.astimezone(timezone.utc)
