# BhriguSetu Implementation Audit

**Generated:** 2026-11-17
**Status:** 77 backend tests passing; frontend production build passing

---

## 2026-11-17 implementation update

- Added POST /api/chart/manual and MCP analyze_supplied_chart_tool. They map externally supplied sidereal longitudes to signs and whole-sign houses, then reuse the existing BCP/BSP research engines.
- Added a provisional, secondary-source-only cycle-lord parallel reference when the relevant natal cycle-lord longitude is supplied. It never promotes the reference to a verified BCP rule.
- Manual chart inputs explicitly record the caller-declared ayanamsha label; the service does not verify it or calculate an ephemeris.
- BSP candidates remain disabled. No predictive matching or event claims were enabled.
- Added boundary, validation, BCP-reference, BSP-safeguard, API and MCP tests. Backend suite: 77 passed.
- Installed frontend dependencies with a generated package-lock.json; Next.js production build and TypeScript checks pass.

## Executive Summary

The repository implements a **research-first** BCP/BSP Jyotish calculation system. Core infrastructure is solid (running year, BCP house activation, Kakshya lookup, birthplace search, timezone resolution, MCP server). However, **all predictive functionality is explicitly disabled** pending verification.

---

## Incomplete / Provisional / Disabled Functionality

### 1. BCP (Bhrigu Chakra Paddhati)

| Feature | Status | Gap |
|---------|--------|-----|
| Running year calculation | ✅ Complete | — |
| 12-house activation | ✅ Complete | — |
| Cycle calculation | ✅ Complete | — |
| **Chakra-swami (cycle ruler) mapping** | ⚠️ **Provisional** | Only 9 cycles documented (Moon→Ketu); cycle 10+ returns `None`. Needs primary source verification. |
| **Cycle ruler reference point** | PROVISIONAL | Available only when caller supplies the cycle lord's natal longitude; secondary-source-only, not primary-source verified. |
| **Predictive interpretation** | ❌ **Disabled** | `interpretation_status: "not_enabled_pending_rule_verification"` |

**Key Code:** `app/bcp/engine.py` lines 10-13, 37-53

---

### 2. BSP (Bhrigu Saral Paddhati) — Rule Engine

| Feature | Status | Gap |
|---------|--------|-----|
| Rule catalog loading/validation | ✅ Complete | — |
| Rule schema enforcement | ✅ Complete | — |
| **5 research candidates** | ⚠️ **All disabled** | None verified or enabled. See `rules/bsp_rules.json` |
| **Rule matching engine** | ❌ **Not implemented** | `analyze_bsp()` returns `triggered_rules: []` with "matching deliberately withheld" |
| **Chart data integration** | MANUAL INPUT ONLY | Caller-supplied positions can be mapped; no ephemeris or automated BSP matching exists. |

**Research Candidates (all `verified: false, enabled: false`):**
1. **BSP-MARS-10TH-27** — Mars activates 10th-from-Mars in year 27
2. **BSP-MARS-KAKSHYA-27** — Same-degree planet in 10th-from-Mars, fallback to Mars Kakshya lord
3. **BSP-SATURN-3RD-ASPECT-20** — Saturn's 3rd aspect in year 20
4. **BSP-JUPITER-5TH-ASPECT-32** — Jupiter's 5th aspect in year 32 (with modifiers)
5. **BSP-JUPITER-9TH-ASPECT-40** — Jupiter's 9th aspect + natal house in year 40

**Key Code:** `app/bsp/engine.py` lines 21-22, `app/rules/catalog.py`

---

### 3. BSP Kakshya (3°45′ slots)

| Feature | Status | Gap |
|---------|--------|-----|
| 8-slot lookup table | ✅ Complete | — |
| Same-degree comparison (integer degree) | ✅ Complete | — |
| **Integration with BSP-7 rule** | ❌ **Not connected** | `BSP-MARS-KAKSHYA-27` fallback requires Kakshya lord + owned houses/significations — not implemented |
| **Kakshya lord significations** | ❌ **Not defined** | Need mapping: Saturn/Jupiter/Mars/Sun/Venus/Mercury/Moon/Ascendant → houses/significations |

**Key Code:** `app/bsp/kakshya.py`

---

### 4. Birthplace / Timezone Resolution

| Feature | Status | Gap |
|---------|--------|-----|
| OSM Nominatim search | ✅ Complete | — |
| Caching + throttling | ✅ Complete | — |
| Timezone candidate lookup | ✅ Complete | — |
| **DST-aware wall-time resolution** | ✅ Complete | — |
| **Multiple timezone candidate disambiguation** | ⚠️ **Manual** | Returns `timezone: null` + `timezone_candidates` array — caller must choose |

**Key Code:** `app/places.py`, `app/astronomy/time.py`

---

### 5. Birth Analysis (API + MCP)

| Feature | Status | Gap |
|---------|--------|-----|
| Validated birth details model | ✅ Complete | — |
| Running year + BCP + BSP | ✅ Complete | — |
| **Birth-data chart calculation** | NOT IMPLEMENTED | No ephemeris-generated planetary positions or ascendant; manual mapping endpoint accepts external positions. |
| **Ephemeris integration** | ❌ **Missing** | No Swiss Ephemeris / PyEphem / Skyfield integration |
| **House system calculation** | ❌ **Missing** | No whole-sign, Placidus, etc. |
| **Natal planet positions** | ❌ **Missing** | Required for BSP rule preconditions |

**Key Code:** `app/main.py` lines 82-85, `app/mcp_server/server.py` lines 172-175

---

### 6. MCP Server

| Feature | Status | Gap |
|---------|--------|-----|
| 11 tools exposed | COMPLETE | Includes caller-supplied chart mapping. |
| Resource + prompt | ✅ Complete | — |
| **Manual position mapping tool** | EXPOSED | Maps caller-supplied positions; it is not an ephemeris chart calculator. |
| **Rule matching tool** | ❌ **Not exposed** | Would require BSP matching engine first |

**Key Code:** `app/mcp_server/server.py`

---

## Dependency Graph

```
Chart Engine (ephemeris + houses)
    │
    ├─→ BSP Rule Matching Engine (needs natal planet positions)
    │       │
    │       ├─→ BSP-MARS-10TH-27 (needs Mars house)
    │       ├─→ BSP-MARS-KAKSHYA-27 (needs Mars degree + 10th-from-Mars planets)
    │       ├─→ BSP-SATURN-3RD-ASPECT-20 (needs Saturn house)
    │       ├─→ BSP-JUPITER-5TH-ASPECT-32 (needs Jupiter house)
    │       └─→ BSP-JUPITER-9TH-ASPECT-40 (needs Jupiter house)
    │
    ├─→ BCP Cycle Ruler Reference (needs cycle lord natal sign)
    │
    └─→ Kakshya Lord Significations (needs planetary rulerships)
```

---

## Prioritized Implementation Plan

### Phase 1: Chart Calculation Foundation (HIGHEST PRIORITY)
**Goal:** Enable planetary positions, ascendant, and house calculation

1. **Add ephemeris dependency** — `swisseph` or `kerykeion` or `skyfield`
2. **Implement `app/astronomy/ephemeris.py`** — planetary longitude calculation
3. **Implement `app/astronomy/houses.py`** — house cusps (whole-sign first, then Placidus)
4. **Implement `app/chart/engine.py`** — assemble complete natal chart
5. **Add chart to `/api/analyze` and MCP `analyze_birth_details_tool`**
6. **Tests** for known reference charts (e.g., Raman, Saptarishis examples)

**Effort:** Medium-High
**Unblocks:** All BSP rules, BCP cycle ruler reference

---

### Phase 2: BSP Rule Matching Engine
**Goal:** Enable verified rules to trigger against calculated charts

1. **Implement `app/bsp/matching.py`** — rule precondition evaluation
2. **House counting utilities** — inclusive counting, aspect targets
3. **Integrate with chart engine** — fetch natal planet positions
4. **Enable one rule at a time** — start with `BSP-MARS-10TH-27` (simplest)
5. **Validation tests** against catalog `validation_case` examples

**Effort:** Medium
**Depends on:** Phase 1

---

### Phase 3: BCP Cycle Ruler Reference
**Goal:** Calculate the secondary reference point (natal sign of cycle lord)

1. **Extend `analyze_bcp()`** — accept optional chart data
2. **Calculate cycle lord's natal sign/house** — from chart
3. **Implement parallel year counting** — from cycle lord's natal sign
4. **Update MCP tool** — pass chart data when available

**Effort:** Low-Medium
**Depends on:** Phase 1

---

### Phase 4: Kakshya Lord Significations + BSP-7 Integration
**Goal:** Complete the Kakshya fallback for BSP-MARS-KAKSHYA-27

1. **Define Kakshya lord → house/signification mapping** (classical sources)
2. **Implement `app/bsp/kakshya_significations.py`**
3. **Wire into BSP-MARS-KAKSHYA-27** matching logic
4. **Test against BSP-7 worked examples**

**Effort:** Low
**Depends on:** Phase 1, 2

---

### Phase 5: Chakra-Swami Primary Source Verification
**Goal:** Resolve provisional status or document gaps

1. **Research classical sources** for 9-cycle chakra-swami sequence
2. **Either verify and promote, or expand documentation of uncertainty**
3. **Decide on cycle 10+ behavior** (wrap? extend? stop?)

**Effort:** Research (not code)

---

### Phase 6: Additional BSP Rules
**Goal:** Progressively enable remaining 4 rules

Priority order based on complexity:
1. `BSP-SATURN-3RD-ASPECT-20` — single aspect, simple precondition
2. `BSP-JUPITER-9TH-ASPECT-40` — two targets, no modifiers
3. `BSP-JUPITER-5TH-ASPECT-32` — conditional secondary + 7th-house modifier
4. `BSP-MARS-KAKSHYA-27` — requires Kakshya integration (Phase 4)

**Effort:** Medium per rule
**Depends on:** Phase 2

---

## Immediate Next Step

**Next gate: choose and validate an ephemeris before Phase 1 chart calculation**

This is the single highest-impact task — it unblocks everything else. I'll begin by:

1. Evaluating ephemeris library options (swisseph vs kerykeion vs skyfield)
2. Adding dependency to `requirements.txt`
3. Implementing planetary position calculation
4. Adding tests against known reference data
