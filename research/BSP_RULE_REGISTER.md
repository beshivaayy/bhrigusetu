# BSP source-backed rule register

This register separates a source's stated technique from implementation confidence and release status.

## BSP-MARS-10TH-27 — Mars tenth-from-itself rule

**Research candidate · disabled**

- **Source title:** *Bhrighu Saral Paddathi – 6*, *Sage Bhrighu’s Blessings*, Vol. 6.
- **Author:** Venkat Ramana, Saptarishis Astrology Re-Search Team.
- **Original magazine PDF:** https://saptarishisastrology.com/wp-content/uploads/2023/01/SA-Vol-6-Part-2.pdf (printed pages 368–374).
- **Exact location:** BSP-6 statement at printed page 368; chart examples begin at page 369.
- **Rule statement:** wherever natal Mars sits, it implements itself in the tenth house from itself in the 27th year.
- **Operational reading:** count the natal Mars-occupied house as 1; the tenth from Mars is a nine-house forward offset. This counting interpretation must be checked against every source chart.
- **Evidence grade:** B — direct magazine publication, named author, multiple worked examples. The publisher explicitly warns that success on many charts does not make the method a siddhanta and asks readers to test it.
- **Runtime status:** `verified=false`, `enabled=false`. No production prediction is generated.

### Source examples transcribed for later validation

| Birth date | Natal Mars house from Lagna | 10th from Mars from Lagna | Reported event |
|---|---:|---:|---|
| 13 Dec 1948 | 10 | 7 | Marriage, 6 Jan 1975 |
| 28 Mar 1946 | 8 | 5 | Marriage, 21 Mar 1973 |
| 26 Aug 1968 | 10 | 7 | Promotion, 24 Oct 1994; marriage, 27 Apr 1995 |
| 2 Jun 1969 | 5 | 2 | Promotion and financial gain, Sep 1995 |

The magazine contains additional cases and chart data. These four are a compact initial regression set, not proof of predictive validity.

## BSP-MARS-KAKSHYA-27 — same-degree planet / Kakshya fallback

**Research candidate · disabled**

- **Source:** *Bhrighu Saral Paddathi – 7*, *Sage Bhrighu’s Blessings*, Vol. 6, by Venkat Ramana — https://saptarishisastrology.com/wp-content/uploads/2023/01/SA-Vol-6-Part-2.pdf (printed pages 375–377).
- **Exact location:** Kakshya table and steps 1–3; worked examples follow.
- The source defines eight equal Kakshya slots of 3°45′ each, with lords Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon and Ascendant.
- It states that a planet in the 10th from Mars at the same degree is influenced by Mars in the 27th year; if no such planet is present, Mars activates the Kakshya lord and its significations.
- **Degree interpretation:** Chart 2 gives Mars at 27°14′ and Venus at 27°50′ and treats them as matching. This supports matching the integer degree number within the sign (27), not exact minute/second equality. Do not add a wider orb.
- **Implementation:** the pure slot lookup and whole-degree comparison helper are implemented in `backend/app/bsp/kakshya.py`; predictive matching/fallback remains disabled.

## BSP-SATURN-3RD-ASPECT-20 — Saturn's 3rd aspect

**Research candidate · disabled**

- **Source:** *Bhrighu Saral Paddathi – 13 by Saptarishis Astrology* — https://saptarishisastrology.com/bhrighu-saral-paddathi-13-by-saptarishis-astrology/
- **Exact location:** opening rule and running-year explanation.
- The article says Saturn's 3rd aspect implements in the 20th year and defines this as after completing 19 years and before completing 20. It also notes that planetary strength and aspects may shift results by plus/minus 1–2 years.
- **Open issue:** the source's timing tolerance is qualitative; no numeric modifier is implemented.

## BSP-JUPITER-5TH-ASPECT-32 — Jupiter's 5th aspect

**Research candidate · disabled**

- **Source:** *Bhrighu Saral Paddathi – 11* — https://saptarishisastrology.com/wp-content/uploads/2023/01/Bhrighu-Saral-Paddathi-11-by-Venkat-Ramana-Saptarishis-Astrology-Research-Team.pdf
- **Exact location:** PDF page 1, BSP-11 statement and worked examples.
- The text describes Jupiter's 5th aspect in the 32nd year, possible implementation of Jupiter's own natal house, and the 7th-from-Jupiter house as a controller/influence.
- **Open issue:** conditions for secondary natal-house activation and the 7th-house modifier require formal tests and more examples.

## BSP-JUPITER-9TH-ASPECT-40 — Jupiter's 9th aspect

**Research candidate · disabled**

- **Source:** *Bhrighu Saral Paddathi – 10 by Saptarishis Astrology Research Team* — https://saptarishisastrology.com/bhrighu-saral-paddathi-10-by-saptarishis-astrology-re-search-team/
- **Exact location:** BSP-10 rule statement and worked examples.
- The article states that in the 40th year Jupiter implements its 9th aspect in the 9th from its natal placement and also implements the house it occupies.
- **Open issue:** precedence and interpretation of the two activated houses need additional source-derived cases.

## Before enabling any candidate

1. Recompute all source charts independently with the source's own chart settings.
2. Confirm each event date falls within the correct running-year interval.
3. Formalize the exact house-counting and aspect semantics for that rule.
4. Record exceptions, modifiers and negative/failed cases.
5. Add deterministic tests and obtain independent review.

All five catalog entries remain `verified=false` and `enabled=false`. Generic Parashari aspects, house significations or planetary maturity concepts must not be silently converted into BSP rules.
