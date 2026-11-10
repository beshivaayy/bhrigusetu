"""Birth wall-time resolution with explicit IANA timezone/DST handling."""
from __future__ import annotations

from datetime import date, datetime, time, timezone
from zoneinfo import ZoneInfo

UTC = timezone.utc

def resolve_local_datetime(
    birth_date: date,
    birth_time: time,
    timezone_name: str,
    fold: int | None = None,
) -> datetime:
    """Resolve a local wall time to an aware datetime.

    Reject nonexistent DST wall times. Require fold=0 (earlier instant) or
    fold=1 (later instant) when a wall time occurs twice.
    """
    if birth_time.tzinfo is not None:
        raise ValueError("time_of_birth must be a local wall time without a UTC offset.")
    if fold not in (None, 0, 1):
        raise ValueError("time_fold must be 0 or 1.")

    zone = ZoneInfo(timezone_name)
    wall_time = datetime.combine(birth_date, birth_time)
    valid: dict[datetime, int] = {}

    for candidate_fold in (0, 1):
        local = wall_time.replace(tzinfo=zone, fold=candidate_fold)
        utc_instant = local.astimezone(UTC)
        round_trip = utc_instant.astimezone(zone).replace(tzinfo=None)
        if round_trip == wall_time:
            valid[utc_instant] = candidate_fold

    if not valid:
        raise ValueError(
            "This local birth time does not exist in the selected timezone because clocks move forward. "
            "Check the recorded time or timezone."
        )

    if len(valid) > 1:
        if fold is None:
            raise ValueError(
                "This local birth time occurs twice because clocks move backward. "
                "Set time_fold=0 for the earlier occurrence or time_fold=1 for the later occurrence."
            )
        for instant, candidate_fold in valid.items():
            if candidate_fold == fold:
                return instant.astimezone(zone)
        raise ValueError("The selected time_fold is not valid for this local birth time.")

    instant = next(iter(valid))
    return instant.astimezone(zone)
