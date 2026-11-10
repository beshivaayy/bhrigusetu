# BSP-7 Kakshya slot lookup: evidence and implementation

## Direct source

- Article: *Bhrighu Saral Paddathi – 7 by Venkat Ramana*
- Saptarishis Astrology page: https://saptarishisastrology.com/bhrighu-saral-paddathi-7-by-venkat-ramana/
- Exact section: article steps 1–3 and Table 1 (Kakshya-Slot Degrees / Lord of Kakshya).
- The article defines eight equal slots of 3°45′ each and names the lords in order: Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon, Ascendant.
- The article then uses natal Mars's Kakshya lord when no same-degree planet is present in the tenth from Mars, within the BSP-6 27th-year technique.

## Transcribed intervals

| Slot | Degree interval within sign | Lord |
|---:|---|---|
| 1 | 0°00′ to 3°45′ | Saturn |
| 2 | 3°45′ to 7°30′ | Jupiter |
| 3 | 7°30′ to 11°15′ | Mars |
| 4 | 11°15′ to 15°00′ | Sun |
| 5 | 15°00′ to 18°45′ | Venus |
| 6 | 18°45′ to 22°30′ | Mercury |
| 7 | 22°30′ to 26°15′ | Moon |
| 8 | 26°15′ to 30°00′ | Ascendant |

## Code

`backend/app/bsp/kakshya.py` implements a pure lookup only. Intervals are start-inclusive and end-exclusive, so an exact boundary belongs to the next slot. Degree 30° is invalid because it belongs to the next sign at 0°.

## Limitations

- The source table is legible and directly transcribed, but no prediction is made by this utility.
- The same-degree comparison rule in BSP-7 still needs an explicit numeric tolerance policy and chart-engine validation. The source says "exactly the same degree"; do not silently substitute a broad orb.
- The source's Kakshya lord sequence must not be confused with BCP cycle swamis or the seven-planet Vimshottari sequence.
