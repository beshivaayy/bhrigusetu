# BhriguSetu Implementation Audit

**Generated:** 2026-11-17
**Status:** chart engine integrated; 86 backend tests passing; frontend production build passing

---

## 2026-11-17 implementation update

- Added POST /api/chart/manual and MCP analyze_supplied_chart_tool. They map externally supplied sidereal longitudes to signs and whole-sign houses, then reuse the existing BCP/BSP research engines.
- Added a provisional, secondary-source-only cycle-lord parallel reference when the relevant natal cycle-lord longitude is supplied. It never promotes the reference to a verified BCP rule.
- Manual chart inputs explicitly record the caller-declared ayanamsha label; the service does not verify it or calculate an ephemeris.
- BSP candidates remain disabled. No predictive matching or event claims were enabled.
- Added boundary, validation, BCP-reference, BSP-safeguard, API and MCP tests. Backend suite: 77 passed.
- Installed frontend dependencies with a generated package-lock.json; Next.js production build and TypeScript checks pass.

## 2026-11-17 chart engine implementation update

- Added Astronomy Engine 2.1.19 (MIT) for geocentric apparent ecliptic-of-date planetary longitudes.
- Added approximate Lahiri ayanamsha polynomial, mean lunar node, ascendant, whole-sign houses, nakshatra/pada and D1/D9 mapping.
- Integrated chart output into /api/analyze, added /api/chart/calculate, and exposed calculate_birth_chart_tool through MCP.
- Added explicit provider, time, ayanamsha, node and precision metadata. Swiss Ephemeris was not added because its AGPL/professional dual licence needs a separate project decision.
- Chart calculations are available but remain labelled approximate; BSP predictive rules remain disabled.
- Backend tests after integration and BCP chart mapping: 86 passed.

## Executive Summary

The repository implements a **research-first** BCP/BSP Jyotish calculation system. Core infrastructure is solid (running year, BCP house activation, Kakshya lookup, birthplace search, timezone resolution, MCP server). However, **BSP predictive functionality remains explicitly disabled** pending verification. The astronomy layer now calculates approximate natal D1/D9 charts.

---

## Incomplete / Provisional / Disabled Functionality

### 1. BCP (Bhrigu Chakra Paddhati)

| Feature | Status | Gap |
|---------|--------|-----|
| Running year calculation | ✅ Complete | — |
| 12-house activation | ✅ Complete | — |
| Cycle calculation | ✅ Complete | — |
| **Chakra-swami (cycle ruler) mapping** | ⚠️ **Provisional** | Only 9 cycles documented (Moon→Ketu); cycle 10+ returns `None`. Needs primary source verification. |
| **Cycle ruler reference point** | PROVISIONAL | Calculated from the natal chart using the secondary-source sequence; never promoted to a verified BCP rule. |
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
| **Chart data integration** | PARTIAL | Calculated D1/D9 chart is available; automatic BSP matching remains disabled. |

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
| **Birth-data chart calculation** | AVAILABLE WITH CAVEATS | Astronomy Engine calculates seven classical planets, mean nodes, sidereal ascendant, whole-sign houses, nakshatra/pada and D1/D9. |
| **Ephemeris integration** | PARTIAL | Astronomy Engine 2.1.19 (MIT); geocentric ecliptic-of-date positions; approx. ±1 arcminute claim. |
| **House system calculation** | PARTIAL | Whole-sign houses implemented; quadrant systems are not. |
| **Natal planet positions** | AVAILABLE WITH CAVEATS | Sun through Saturn plus mean Rahu/Ketu; true node and outer planets are not included. |

**Key Code:** `app/main.py` lines 82-85, `app/mcp_server/server.py` lines 172-175

---

### 6. MCP Server

| Feature | Status | Gap |
|---------|--------|-----|
| 12 tools exposed | COMPLETE | Includes calculated natal D1/D9 chart and caller-supplied chart mapping. |
| Resource + prompt | ✅ Complete | — |
| **Calculated birth chart tool** | EXPOSED | calculate_birth_chart_tool returns approximate Lahiri D1/D9 and whole-sign houses. |
| **Manual position mapping tool** | EXPOSED | Maps caller-supplied positions independently of the ephemeris engine. |
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

### Phase 1: Chart Calculation Foundation (INITIAL IMPLEMENTATION COMPLETE; VALIDATION CONTINUES)
**Goal:** Enable planetary positions, ascendant, and house calculation

1. Astronomy Engine 2.1.19 is integrated; Swiss Ephemeris remains excluded pending licence choice.
2. `app/astronomy/ephemeris.py` calculates geocentric longitudes, approximate Lahiri sidereal positions, ascendant, whole-sign houses, nakshatra/pada and D1/D9.
3. API and MCP expose the calculated chart; frontend renders D1, D9, houses and model metadata.
4. Expand golden tests across eras, locations, high latitudes and chart-boundary cases.
5. Compare ayanamsha values against Indian Astronomical Ephemeris/JHora reference values before claiming strict parity.

**Effort:** Validation ongoing
**Unblocks:** Chart-data consumers; BSP rules remain gated by source verification

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

**Next gate: expand astronomical golden tests and verify the ayanamsha model**

The first chart engine is integrated. The remaining work is to validate more dates and latitudes, document the exact Lahiri reference convention, and keep chart-derived BSP predictions disabled until primary-source rules are independently verified.
