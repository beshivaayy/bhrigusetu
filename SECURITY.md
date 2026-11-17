# Security Policy

## Supported branch

Security fixes are applied to the default `main` branch.

## Reporting a vulnerability

Please use GitHub's private vulnerability reporting feature for this repository rather than opening a public issue with exploit details:

https://github.com/beshivaayy/bhrigusetu/security/advisories/new

Include the affected version or commit, impact, reproduction steps and any available mitigation. Do not include real birth records or other personal data in public reports.

## Automated safeguards

The repository includes CodeQL static analysis, Gitleaks secret scanning, dependency review on pull requests, Dependabot update configuration and CI test/build checks. An active `Protect main` repository ruleset and successful main-branch CI, CodeQL and Gitleaks checks were observed on 2026-11-17. Secret-scanning push protection and private vulnerability reporting are separate GitHub settings and still require verification in repository Settings. See [docs/REPOSITORY_PROTECTION.md](docs/REPOSITORY_PROTECTION.md).

## Current deployment status

BhriguSetu is a research prototype. It is not yet hardened for unrestricted public use. The remote Streamable HTTP MCP route (`/mcp`) requires a configured `BHRIGUSETU_MCP_TOKEN` Bearer token. This does not authenticate the rest of the FastAPI API: ordinary API routes remain publicly reachable unless separately protected. Persistent abuse controls and general API rate limiting are not yet implemented. Do not submit sensitive personal data to an untrusted deployment. Before public launch, add API rate limiting, abuse protection, request-size limits, a privacy notice, a retention/deletion policy and operational monitoring.
