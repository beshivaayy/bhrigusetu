# Research Conflicts and Open Method Decisions

This file records unresolved method choices and source variations. It is not a list of resolved facts.

## 1. BCP cycle-ruler reference point

- **Published interpretation:** M. Imran's “Bhrigu Chakra with Cycle Rulers” describes counting years both from natal Lagna and from the natal sign of the cycle ruler for each 12-year block.
- **Current implementation:** only the Lagna-based activated house is calculated. The cycle lord is displayed provisionally, but the second reference house is not calculated.
- **Impact:** a complete BCP chart report may need to show two parallel house activations, if the original BCP teaching confirms this.
- **Decision:** keep the cycle-ruler reference-point extension disabled pending primary-source confirmation from Sunil John / original Saptarishis teaching.
- **Source:** https://saptarishisastrology.com/bhrigu-chakra-with-cycle-rulers-by-m-imran/

## 2. BCP running-year and leap-day convention

- **Published corroboration:** BSP-13 defines the 20th year as after completing 19 years and before completing 20.
- **Current implementation:** running year = completed calendar years + 1; 29-February birthdays use 1 March in non-leap years.
- **Impact:** event-year classification near birthdays and for leap-day births can differ by convention.
- **Decision:** expose the date convention in documentation; do not call the leap-day rule canonical until an original BCP source confirms it.
- **Source:** https://saptarishisastrology.com/bhrighu-saral-paddathi-13-by-saptarishis-astrology/

## 3. BSP-7 same-degree matching

- **Source statement:** BSP-7 says a planet in the 10th from Mars at the same degree is influenced in the 27th year.
- **Worked example:** Mars at 27°14′ and Venus at 27°50′ are treated as matching.
- **Implementation interpretation:** compare integer degree numbers within the sign; do not require minute/second equality and do not invent a wider orb.
- **Remaining issue:** confirm this reading across the full source chart set and any later teaching material.
- **Source:** https://saptarishisastrology.com/wp-content/uploads/2023/01/SA-Vol-6-Part-2.pdf (printed pages 375–377).

## 4. BSP-6 rule is not presented as an established siddhanta

- **Source:** Venkat Ramana, *Bhrighu Saral Paddathi – 6*, *Sage Bhrighu’s Blessings*, Vol. 6, printed pages 368–374.
- **Source caution:** the publisher reports approximately 25 tested charts and explicitly cautions that even success on 100 charts does not make a rule a siddhanta; readers are asked to test it.
- **Impact:** the Mars tenth-from-itself rule remains a research candidate, not an enabled prediction rule.
- **Source:** https://saptarishisastrology.com/wp-content/uploads/2023/01/SA-Vol-6-Part-2.pdf

## 5. Astronomy dependency and licensing

- Swiss Ephemeris has an AGPL / professional dual-licensing model.
- The repository is public and may become a hosted product; selecting AGPL or a paid licence has business consequences.
- **Decision:** do not add pyswisseph until the licence decision is explicit. See `ASTRONOMY_AND_LICENSING.md`.

## Open verification backlog

1. Extract exact BCP cycle-lord statements from Sunil John's primary teaching videos with timestamps.
2. Confirm whether cycle-ruler-based parallel counting is part of the core BCP method or a later extension.
3. Confirm BCP running-year and leap-day rules from primary teaching material.
4. Recompute the source charts for BSP-6 and BSP-7 independently.
5. Formalize BSP-10, BSP-11 and BSP-13 modifiers from their source examples.
6. Confirm the house-counting convention for every BSP rule; do not assume one universal convention without evidence.
7. Obtain a source-approved ephemeris, ayanamsha, node and house-system specification before enabling chart-derived predictions.

When a conflict is found, record both source statements, publication context, practical implementation impact and the reason for any selected interpretation. Never silently average conflicting rules.
