# Deployment guide

This repository contains deployment configuration, but no public service is provisioned by this file alone.

## Recommended split deployment

- Frontend: Vercel, using the `frontend/` directory as the project root.
- API: Render, using the repository-root `render.yaml` blueprint and the backend Dockerfile.

## 1. Deploy the API on Render

1. Create a new Blueprint deployment from this GitHub repository.
2. Render detects `render.yaml` and builds `backend/Dockerfile`.
3. Set `CORS_ORIGINS` to the exact public Vercel origin, for example `https://your-project.vercel.app`. Do not include a trailing slash or wildcard.
4. Keep the Render API at one instance while using the public Nominatim endpoint. The service's 1.1-second process-wide throttle and cache assume one instance; do not enable horizontal scaling.
4. Deploy and verify `https://YOUR-API-HOST/health` returns HTTP 200 and JSON status `ok`.
5. Verify `/docs` is reachable only as intended for the public API.

## 2. Deploy the frontend on Vercel

1. Import the same repository.
2. Set the Vercel project Root Directory to `frontend`.
3. Add environment variable `NEXT_PUBLIC_API_BASE_URL` with the deployed Render API origin, e.g. `https://YOUR-API-HOST`.
4. Build using the package's existing `npm run build` script.
5. Deploy and test the birth-details form against the API.

## 3. Place search requirements

The birthplace search uses public OpenStreetMap Nominatim under its usage policy. It is a one-shot search, not autocomplete, sends a BhriguSetu User-Agent, caches results and displays attribution. For high traffic, switch to a commercial provider or operate your own geocoder. See [PLACE_SEARCH.md](PLACE_SEARCH.md).

## 4. Post-deployment verification

- Confirm the browser's Network panel shows requests to the intended API host, not localhost.
- Confirm CORS permits only the frontend origin.
- Test a normal Asia/Kolkata birth time.
- Test invalid timezone, nonexistent DST time and ambiguous DST time.
- Confirm the API returns `partial_calculation`; no planetary chart or prediction is currently promised.
- Check the Render logs and GitHub Actions after every release.

## Important limitations

- This setup does not provision accounts, domains, secrets or paid plans.
- Do not publish a frontend until the backend URL and CORS origin are configured.
- No production ephemeris is installed. Chart and prediction outputs remain disabled pending the methodology and licence gate in `research/ASTRONOMY_AND_LICENSING.md`.
- The API currently has no authentication, rate limiting, persistent storage or abuse controls. Treat it as a research prototype, not a hardened public service.
