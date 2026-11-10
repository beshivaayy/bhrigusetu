# Birthplace search and timezone resolution

## User flow

1. The user types a birthplace and explicitly clicks **Find birthplace**.
2. The API performs one Nominatim search and returns up to five matching locations.
3. The user selects the intended result.
4. Latitude, longitude and the offline-detected IANA timezone are filled into the birth form.
5. The user may edit coordinates/timezone if the result is wrong or the location lies near a timezone border.

This is a one-shot search. It is deliberately not autocomplete.

## Geocoding provider and policy

The current low-volume provider is the public OpenStreetMap Nominatim service:
https://nominatim.openstreetmap.org/

The implementation:
- Sends a BhriguSetu-identifying User-Agent.
- Waits at least 1.1 seconds between uncached requests within the service process.
- Caches search results in memory for 30 days.
- Requests a maximum of five results per explicit search.
- Displays © OpenStreetMap contributors attribution.
- Runs as one Render instance by default to preserve the single-instance rate limit.

Official policy: https://operations.osmfoundation.org/policies/nominatim/

The public Nominatim service has limited donated capacity and no availability guarantee. It is suitable only for low-volume use under its policy. Do not add client-side autocomplete, parallel geocoding workers or horizontal scaling while using this public endpoint. For larger traffic, switch to a commercial geocoder or operate a properly provisioned Nominatim instance.

## Timezone detection

The selected coordinates are passed to `timezonefinder`'s offline `timezones_at` polygon lookup. A single land-zone match is selected automatically; multiple overlapping boundary candidates are returned without guessing and the user must choose one. The package version and its separate `timezonefinder-data` dataset are pinned in `backend/requirements.txt` so timezone polygon changes do not silently alter results between deployments.

- Package: MIT licence.
- Boundary dataset: ODbL licence.
- Package docs: https://timezonefinder.readthedocs.io/
- Timezonefinder code package (MIT): https://pypi.org/project/timezonefinder/\n- Separate boundary-data package (ODbL): https://pypi.org/project/timezonefinder-data/4.2026.6/

Timezone lookup is based on current geographic boundaries. The library documents that a small share of land coordinates can fall in overlapping zones; those candidates are shown for explicit user choice. Historical timezone rules are then applied to the selected birth date/time by Python's IANA `zoneinfo` database. The fallback `tzdata` package is pinned to 2026.6 for reproducibility on Windows hosts. If the polygon dataset returns more than one timezone for a point, the form asks the user to select one. If no land zone is returned, enter the timezone manually.

## Operational limitations

- Nominatim may return several nearby settlements with similar names; the user must choose the exact place.
- The geocoder's display name is not a substitute for user verification.
- Nominatim search results are not stored as personal birth records; only a short-lived in-memory query cache is used.
- A server restart clears the cache.
