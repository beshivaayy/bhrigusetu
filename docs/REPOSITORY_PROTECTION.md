# Repository Protection Baseline

This document defines the intended GitHub repository settings for BhriguSetu. Workflow files in the repository provide automated checks, but **they do not themselves enforce branch protection**. The ruleset below must be created in GitHub repository settings by an owner.

## 1. Main branch ruleset

Create a repository ruleset named `Protect main`:

- Enforcement status: **Active**
- Target: branch `main`
- Restrict deletions: enabled
- Block force pushes: enabled
- Require a pull request before merging: enabled
- Required approvals: **0** for the current single-maintainer project (raise to 1 when another trusted maintainer is available)
- Require conversation resolution: enabled
- Require status checks: enabled; select the checks actually reported by the workflows:
  - `backend`
  - `frontend`
  - `docker`
  - CodeQL analysis checks (after their first successful run)
  - Dependency Review (PR workflow)
- Require branches to be up to date: enabled once all checks are stable
- Require linear history: enabled (squash/rebase only)
- Do not allow force pushes or deletion, including for administrators, unless a documented emergency requires a temporary bypass.
- Bypass list: empty by default.

**Important:** GitHub only offers required checks after the workflow has reported them. Create the ruleset after the first successful run of each workflow and select the exact check names shown in the Checks tab. Do not guess check names.

## 2. Repository settings

Under Settings → General → Pull Requests:
- Allow squash merging: enabled; use squash as the default.
- Allow merge commits: disabled.
- Allow rebase merging: optional; preferably disabled for a simple, auditable history.
- Automatically delete head branches: enabled.

Under Settings → Actions → General:
- Workflow permissions: **Read repository contents and packages** by default.
- Disable GitHub Actions to create and approve pull requests.
- Allow only actions from GitHub-owned repositories and verified creators where practical; if restricting further, explicitly allow the actions used by this repository.
- Keep approval requirements for outside collaborators' workflow runs enabled.

Under Settings → Code security and analysis:
- Enable Dependabot alerts.
- Enable Dependabot security updates.
- Enable secret scanning and push protection when available for this repository/plan.
- Enable CodeQL code scanning; the repository workflow is included.
- Enable private vulnerability reporting.

## 3. Checks implemented in this repository

- CI: backend tests, frontend production build, npm high-severity audit, Docker image builds and backend runtime smoke test.
- CodeQL: Python and JavaScript/TypeScript static analysis.
- Dependency Review: blocks pull requests that introduce high-severity vulnerable dependencies and denies GPL-3.0/AGPL-3.0 dependencies pending an explicit project licensing decision.
- Gitleaks: scans repository history for accidentally committed secrets.
- Dependabot: monthly grouped minor/patch updates; major upgrades remain manual.
- Pull request checklist: tests, source evidence, personal-data and licensing review.

## 4. Data and application safety requirements

- Never commit API keys, access tokens, passwords, private keys, production environment files, or real users' birth records.
- Use synthetic fixtures in tests and examples.
- Treat date of birth, exact birth time, birthplace and coordinates as personal data. Minimise collection, retention and logging.
- Do not log full birth payloads. Avoid sending them to third-party services except the explicit place-search query needed for geocoding.
- Keep CORS origins explicit in production; do not use wildcard origins with credentials.
- Use HTTPS for deployed origins.
- Before public launch, add API rate limiting, abuse protection, request-size limits, privacy notice, retention/deletion policy and operational monitoring. Current prototype has no authentication or persistent rate limiting.
- Do not enable predictive rules merely because code exists. Require traceable primary-source evidence, explicit assumptions, deterministic test cases and independent chart validation.

## 5. Maintainer checklist

Before merging:
1. Confirm all required CI and security checks pass.
2. Review the diff for secrets and personal data.
3. Review new dependencies, licences and lockfile changes.
4. Check source citations and evidence grades for astrology rules.
5. Confirm no disabled research candidate was accidentally enabled.
6. Review deployment/configuration changes separately.

## 6. Limitations

This repository can store the intended ruleset policy and run security workflows, but a repository ruleset is a GitHub-side setting. It must be activated in Settings → Rules → Rulesets by a repository owner. Likewise, secret-scanning availability and some security features depend on GitHub plan and repository eligibility. Verify their status in GitHub rather than assuming they are active.
