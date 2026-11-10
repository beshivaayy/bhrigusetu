# Security Policy

## Supported branch

Security fixes are applied to the default `main` branch.

## Reporting a vulnerability

Please use GitHub's private vulnerability reporting feature for this repository rather than opening a public issue with exploit details:

https://github.com/beshivaayy/bhrigusetu/security/advisories/new

Include the affected version or commit, impact, reproduction steps and any available mitigation. Do not include real birth records or other personal data in public reports.

## Automated safeguards

The repository includes CodeQL static analysis, Gitleaks secret scanning, dependency review on pull requests, Dependabot update configuration and CI test/build checks. GitHub-side branch rulesets, secret scanning, push protection and private vulnerability reporting must also be enabled/verified in repository Settings. See [docs/REPOSITORY_PROTECTION.md](docs/REPOSITORY_PROTECTION.md).

## Current deployment status

BhriguSetu is a research prototype. It is not yet hardened for unrestricted public use. The API currently has no authentication, persistent abuse controls or rate limiting. Do not submit sensitive personal data to an untrusted deployment. Before public launch, add API rate limiting, abuse protection, request-size limits, a privacy notice, a retention/deletion policy and operational monitoring.
