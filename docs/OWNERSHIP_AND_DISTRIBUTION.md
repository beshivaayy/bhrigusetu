# Ownership and distribution policy

**Status date:** 2026-11-17  
**Product direction:** hybrid — private intellectual-property core, public product surface.

## 1. Executive decision

BhriguSetu is intended to be a product whose original software implementation is controlled by its owner. The target architecture is:

- **Private core:** calculation engines, proprietary orchestration, internal rule-evaluation implementation, non-public research datasets/annotations, service internals and deployment configuration.
- **Public surface:** product landing page, selected documentation, API/MCP contracts, client integration examples and any deliberately released client SDK.
- **Hosted access:** users consume the product through authenticated, rate-limited services under separately reviewed service terms.

This is the intended end state. It is **not yet implemented**: the current GitHub repository is public and contains application source code.

## 2. Current verified repository state

As checked on 2026-11-17:

- Repository: https://github.com/beshivaayy/bhrigusetu
- Visibility: **public**.
- Default branch: `main`; repository owner permissions include administration.
- No root `LICENSE` file was found on `main`; no project-level software licence has been declared.
- The repository has an active ruleset named `Protect main`; `main` is reported protected.
- The latest inspected main commit passed `backend`, `frontend`, `docker`, `Analyze (python)`, `Analyze (javascript-typescript)` and `gitleaks` checks.
- The public repository exposes source in its default branch and other public branches. Public branch refs include feature and security work.
- PR #24 (approximate chart engine) is merged. PR #25 (additional chart-engine/security/documentation changes) remains open and was reported as not mergeable at the time of audit. Do not merge it without reconciling it with current `main` and reviewing the complete diff.
- PR #27 (README refresh) is merged.
- No GitHub Releases were returned by the repository releases endpoint. Fork enumeration was not available through the connected GitHub read action; fork count is therefore unverified.

## 3. What public visibility means

The lack of a project-level licence does **not** mean the code is open source or that unrestricted commercial reuse has been granted. Default copyright rules apply to original project code. However, GitHub's platform terms allow users to view and fork public repositories on GitHub. A public repository should therefore be treated as exposed.

Changing a public repository to private later does not recall copies already cloned by users or turn existing public forks private. A visibility change can also affect stars/watchers and repository features. Do not assume a visibility change erases prior exposure.

No visibility change, licence grant, licence revocation, history rewrite or destructive branch cleanup is authorized by this document.

## 4. Intellectual-property boundaries

The project owner may assert rights over original BhriguSetu-authored software, original documentation, original UI assets, original database schemas and original research annotations, subject to applicable law and third-party rights.

The project must **not** claim exclusive ownership over:

- Classical Jyotish texts, traditional concepts, public-domain material or facts/ideas as such.
- The teachings, authored writings, lectures, recordings, translations or course material of Sunil John, Deepanshu Giri, Sanjay Rath or any other teacher. Attribute sources and obtain permission/licences where required.
- Third-party libraries, frameworks, ephemerides, datasets, APIs, trademarks or logos.
- User-submitted birth data, chart data or personal information.

Keep source quotations, teacher interpretations, BhriguSetu's own analysis and software rules in separate records. Respect dependency licences and external API terms.

## 5. Target repository split

### Private repository — proposed name: `bhrigusetu-core`

Keep private:

- Backend calculation and orchestration implementation.
- Internal BCP/BSP rule engine and non-public research annotations.
- Proprietary data structures, internal test fixtures and non-public datasets.
- Service deployment configuration and operational internals.
- Secrets only in hosting-provider secret stores, never in Git.

### Existing public repository — `bhrigusetu`

Retain as the public product surface:

- Product README, roadmap and selected public documentation.
- Public API/MCP schemas and integration examples.
- A deliberately selected client/interface or SDK, if its release is intentional.
- Contribution, security-reporting and public issue guidance.
- No production credentials, private research records or proprietary backend implementation after migration is complete.

The public API contract can remain documented without publishing the server implementation. API availability must be protected by authentication, rate limits, abuse controls, privacy notice and service terms.

## 6. Safe migration sequence

1. **Inventory and preserve:** record the current public commit, branches, open PRs, releases, deployment links and external dependencies. Do not rewrite or delete public history.
2. **Create a new private repository:** create `bhrigusetu-core` as private under the owner's GitHub account. Confirm owner-only access and multi-factor authentication.
3. **Migrate deliberately:** copy the current approved implementation into the private repository from a clean snapshot. Do not blindly import the entire public Git history if the goal is to stop future exposure of internal code; old public history remains public regardless.
4. **Separate deployment:** connect Render to the private repository with the minimum required GitHub access. Keep existing production services running until the private build, environment variables, health checks, MCP authentication and rollback path are verified.
5. **Verify production:** run backend tests, frontend build, Docker smoke tests, MCP authorization tests, deployment health checks and a controlled API regression set.
6. **Reduce the public repository:** replace server implementation with the approved public surface only after the private deployment is healthy. Keep API contracts and public docs accurate.
7. **Review legal terms:** choose and review a proprietary software licence/EULA and hosted-service terms before distributing binaries, granting commercial access or accepting external contributions.
8. **Document contributors:** obtain written IP assignment or a suitable contributor agreement before accepting contributions to proprietary components.

## 7. Security and service boundary

The remote Streamable HTTP MCP route `/mcp` requires a Bearer token configured as `BHRIGUSETU_MCP_TOKEN`. This does not automatically protect other FastAPI routes. The ordinary API endpoints must be assessed separately before public commercial access.

Never commit tokens, API keys, private keys, production environment files or real birth records. Store secrets in Render/Vercel secret settings. Keep personal birth data out of logs and synthetic fixtures in tests.

## 8. Licensing policy — intentionally unchanged

No new `LICENSE` file or licence grant is introduced by this policy. The project owner explicitly asked that visibility and licensing changes not be made without first explaining their consequences and receiving confirmation.

Before selecting a licence, decide whether:
- all core software remains proprietary and all rights are reserved;
- a limited public client SDK or schema is released under a separate open-source licence; and
- API access is governed by separate terms of service.

A repository copyright notice, software licence, API terms of service, privacy notice and trademark rights are different instruments. They should not be conflated. Obtain qualified legal advice for the final proprietary licence and contributor/IP arrangements.

## 9. Immediate blockers

- The current repository is still public and contains core implementation.
- Existing public branches and commit history remain visible.
- Existing public forks and local clones, if any, cannot be recalled.
- The private core repository has not yet been created.
- The deployment has not yet been migrated to a private source repository.
- No proprietary software licence or hosted-service terms have been adopted.

Until these blockers are resolved, treat the project as a public research prototype with reserved rights, not as a completed private-core hybrid product.
