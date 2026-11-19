# Deployment guide

BhriguSetu uses a split deployment:

- **Frontend:** Vercel, with frontend/ as the project root.
- **Backend and MCP:** Render, using the repository-root render.yaml and backend/Dockerfile.

A configuration file describes how to deploy; it does not by itself guarantee a live or healthy deployment.

## 1. Deploy the API on Render

1. Create a Blueprint deployment from this GitHub repository.
2. Render reads render.yaml and builds backend/Dockerfile.
3. Set CORS_ORIGINS to the exact public Vercel origin. Do not use a wildcard.
4. Set BHRIGUSETU_MCP_TOKEN as a secret environment variable. Use a strong random value and never commit it.
5. Keep the service at one instance while relying on the current process-local Nominatim throttle/cache.
6. Deploy and verify /health returns HTTP 200 with status ok.
7. Verify /mcp rejects requests without a valid Bearer token and accepts the configured token.

## 2. Deploy the frontend on Vercel

1. Import the repository.
2. Set the Vercel Root Directory to frontend.
3. Set NEXT_PUBLIC_API_BASE_URL to the deployed Render API origin.
4. Build with the package's existing npm run build script.
5. Verify the birth-details form calls the intended API origin.

## 3. Place search requirements

Birthplace search uses public OpenStreetMap Nominatim. It is a one-shot search, not autocomplete, and the interface displays attribution. Follow the Nominatim usage policy. For higher traffic, use a suitable hosted provider or operate your own geocoder. See [PLACE_SEARCH.md](PLACE_SEARCH.md).

## 4. MCP deployment

MCP is mounted inside the existing FastAPI process at /mcp; it does not need a separate Render service. The route is protected by BHRIGUSETU_MCP_TOKEN.

Clients must send an Authorization: Bearer header with the configured token. Keep the token in a secret manager or environment variable. Do not expose it in browser code, public logs, repository files or screenshots. See [MCP_SERVER.md](MCP_SERVER.md) for client setup.

## 5. Post-deployment verification

- Confirm the browser calls the intended API host, not localhost.
- Confirm CORS permits only the frontend origin.
- Test a normal Asia/Kolkata birth time.
- Test invalid timezone, nonexistent DST time and ambiguous DST time.
- Inspect chart metadata and warnings; the in-repo chart model remains approximate and is not JHora parity.
- Confirm remote MCP authentication behaviour.
- Run backend tests and inspect Render logs after releases.

## Important limitations

- This setup does not provision accounts, domains, secrets or paid plans.
- The API does not currently provide general user accounts or persistent chart storage.
- The MCP route has Bearer-token protection; this does not mean every API route has user authentication.
- The Nominatim throttle/cache is process-local. Keep one instance unless the geocoder architecture is changed.
- The in-repo astronomy engine is approximate. Do not present its results as JHora-validated until the reference validation gate is complete.
