# BSP source-backed rule register

This register separates a source's stated technique from the implementation's confidence and release status.

## BSP-MARS-10TH-27 — Mars tenth-from-itself rule

<badge>Research candidate · disabled</badge>

- **Source title:** *Bhrighu Saral Paddathi – 6 by Venkat Ramana*.
- **Publication page metadata:** Saptarishis Astrology shows a byline credit to Vinayak Bhatt dated 25 January 2023, while the page title attributes the article to Venkat Ramana. Preserve this attribution ambiguity rather than guessing.
- **Source:** https://saptarishisastrology.com/bhrighu-saral-paddathi-6-by-venkat-ramana/
- **Exact location:** opening description and BSP-6 statement; worked examples and conclusion.
- **Rule statement in source:** wherever natal Mars sits, it implements itself in the tenth house from itself in the 27th year.
- **Operational reading:** count the natal Mars-occupied house as 1; the tenth from Mars is a nine-house forward offset. This counting interpretation must still be cross-checked against source charts.
- **Evidence grade:** B-/medium-low. Direct publication by Saptarishis Astrology and multiple worked examples; attribution is ambiguous and charts have not been independently recalculated.
- **Runtime status:** `verified=false`, `enabled=false`. No production prediction is generated.

### Source examples transcribed for later validation

| Birth date | Natal Mars house from Lagna | 10th from Mars from Lagna | Reported event |
|---|---:|---:|---|
| 13 Dec 1948 | 10 | 7 | Marriage, 6 Jan 1975 |
| 28 Mar 1946 | 8 | 5 | Marriage, 21 Mar 1973 |
| 26 Aug 1968 | 10 | 7 | Promotion, 24 Oct 1994; marriage, 27 Apr 1995 |
| 2 Jun 1969 | 5 | 2 | Promotion and financial gain, Sep 1995 |

The page contains additional cases. These four are a compact initial regression set, not proof of predictive validity.

### What must be checked before enabling

1. Obtain and record the full chart images/data and the source's own chart settings.
2. Recompute each natal chart independently using the selected ephemeris, ayanamsha and house convention.
3. Confirm the 27th running-year boundary against each event date using exact birth date/time and the source's age convention.
4. Determine whether Mars aspects, dignity, retrogression, yogakaraka status or other modifiers change the rule or only interpretation.
5. Seek corroboration in Sunil John's own BSP teaching material and record any differences.
6. Add deterministic unit tests from chart placements and event-year examples; only then consider a verified-but-still-disabled review state.

No other BSP rule is enabled. Generic Parashari aspects, house significations or planetary maturity concepts must not be silently converted into BSP rules.
