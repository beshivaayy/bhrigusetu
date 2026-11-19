# BSP-7 Kakshya slot lookup: evidence and implementation

## Direct source

- Article: *Bhrighu Saral Paddathi – 7 by Venkat Ramana*
- Saptarishis Astrology page: https://saptarishisastrology.com/wp-content/uploads/2023/01/SA-Vol-6-Part-2.pdf (printed pages 375–377)
- Exact section: article steps 1–3 and Table 1 (Kakshya-Slot Degrees / Lord of Kakshya).
- The original magazine PDF identifies Venkat Ramana as author and defines eight equal slots of 3°45′ each, with lords Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon and Ascendant (printed page 376).
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
- BSP-7 chart 2 gives Mars at 27°14′ and Venus at 27°50′ in the 10th-from-Mars house and treats them as matching. This supports comparison by whole-degree number, not exact minute/second equality. The source does not state a wider orb. The helper same_degree_number implements only this integer-degree interpretation.
- The source's Kakshya lord sequence must not be confused with BCP cycle swamis or the seven-planet Vimshottari sequence.
