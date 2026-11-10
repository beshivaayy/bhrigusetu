# BSP source-backed rule register

This register separates a source's stated technique from the implementation's confidence and release status.

## BSP-MARS-10TH-27 — Mars tenth-from-itself rule

**Research candidate · disabled**

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

## Additional located rule candidates

All entries below are registered in `backend/app/rules/bsp_rules.json` as `verified=false` and `enabled=false`. They are visible for research only.

### BSP-MARS-KAKSHYA-27 — same-degree planet / Kakshya fallback

- **Source:** *Bhrighu Saral Paddathi – 7 by Venkat Ramana* — https://saptarishisastrology.com/bhrighu-saral-paddathi-7-by-venkat-ramana/
- **Exact location:** steps 1–3 and worked examples.
- The article defines eight equal Kakshya slots of 3°45′ each, with lords Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon and Ascendant.
- It states that a planet in the 10th from Mars at exactly the same degree is influenced by Mars in the 27th year; if no such planet is present, the Kakshya lord and its significations are activated.
- **Implementation:** the pure slot lookup is implemented in `backend/app/bsp/kakshya.py`; the predictive matching/fallback rule remains disabled. Exact-degree tolerance must not be invented.

### BSP-SATURN-3RD-ASPECT-20 — Saturn's 3rd aspect

- **Source:** *Bhrighu Saral Paddathi – 13 by Saptarishis Astrology* — https://saptarishisastrology.com/bhrighu-saral-paddathi-13-by-saptarishis-astrology/
- **Exact location:** opening rule and running-year explanation.
- The article says Saturn's 3rd aspect implements in the 20th year and defines the 20th year as after completing 19 years and before completing 20. It also notes that planetary strength and aspects may shift results by plus/minus 1–2 years.
- **Open issue:** the source's timing tolerance is qualitative; no numeric modifier is implemented.

### BSP-JUPITER-5TH-ASPECT-32 — Jupiter's 5th aspect

- **Source:** *Bhrighu Saral Paddathi – 11* — https://saptarishisastrology.com/wp-content/uploads/2023/01/Bhrighu-Saral-Paddathi-11-by-Venkat-Ramana-Saptarishis-Astrology-Research-Team.pdf
- **Exact location:** PDF page 1, BSP-11 statement and examples.
- The text describes Jupiter's 5th aspect in the 32nd year, possible implementation of Jupiter's own natal house, and the 7th-from-Jupiter house as a controller/influence.
- **Open issue:** the conditions for secondary natal-house activation and the 7th-house modifier require formal tests and more examples.

### BSP-JUPITER-9TH-ASPECT-40 — Jupiter's 9th aspect

- **Source:** *Bhrighu Saral Paddathi – 10 by Saptarishis Astrology Research Team* — https://saptarishisastrology.com/bhrighu-saral-paddathi-10-by-saptarishis-astrology-re-search-team/
- **Exact location:** BSP-10 rule statement and worked examples.
- The article states that in the 40th year Jupiter implements its 9th aspect in the 9th from its natal placement and also implements the house it occupies.
- **Open issue:** precedence and interpretation of the two activated houses need additional source-derived cases.

## Running-year evidence note

The BSP-13 article explicitly defines the "20th year" as the interval after completing 19 years and before completing 20. This supports the completed-years-plus-one interpretation of "running year" in that BSP context. It is corroboration for the running-year concept, not by itself proof that every BCP timing convention uses identical boundaries.
