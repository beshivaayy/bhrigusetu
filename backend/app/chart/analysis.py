"""Connect calculated chart positions to the existing BCP reference mapping.

The cycle-lord parallel reference remains secondary-source-only and is never
promoted to a verified BCP rule by this adapter.
"""
from __future__ import annotations

from app.chart.manual import SuppliedChartInput, analyze_supplied_chart


def analyze_chart_context(running_year: int, chart: dict) -> dict:
    """Apply existing BCP/BSP analysis to calculated sidereal longitudes."""
    positions = {
        name: item["longitude"]
        for name, item in chart["planets"].items()
    }
    mapped = analyze_supplied_chart(
        SuppliedChartInput(
            running_year=running_year,
            lagna_longitude=chart["lagna"]["longitude"],
            planetary_longitudes=positions,
            ayanamsha="Lahiri approximate (Astronomy Engine)",
        )
    )
    return {
        "bcp": mapped["bcp"],
        "bcp_cycle_reference": mapped["bcp_cycle_reference"],
        "bsp": mapped["bsp"],
    }
