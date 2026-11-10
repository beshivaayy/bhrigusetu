# BCP cycle-lord sequence: evidence status

## Working sequence in code

| Chakra | Running years | Working lord |
|---:|---:|---|
| 1 | 1–12 | Moon |
| 2 | 13–24 | Mercury |
| 3 | 25–36 | Venus |
| 4 | 37–48 | Sun |
| 5 | 49–60 | Mars |
| 6 | 61–72 | Jupiter |
| 7 | 73–84 | Saturn |
| 8 | 85–96 | Rahu |
| 9 | 97–108 | Ketu |

The code groups life years into twelve-year blocks and maps blocks 1–9 to the sequence above. This mapping remains provisional pending direct confirmation from the original Sunil John BCP teaching material.

## Sources located

### Published BCP interpretation — M. Imran

- **Article:** “Bhrigu Chakra with Cycle Rulers”
- **Author:** M. Imran
- **Publisher:** Saptarishis Astrology
- **Page date:** 19 January 2023
- **URL:** https://saptarishisastrology.com/bhrigu-chakra-with-cycle-rulers-by-m-imran/

The article explicitly lists the nine 12-year cycle rulers in the same order as the working table. It also describes an additional technique: count each year both from natal Lagna and from the natal sign of the current cycle ruler (Moon for years 1–12, Mercury for 13–24, etc.). In this variant, the cycle ruler's natal sign becomes the reference first house for that 12-year cycle.

**Evidence grade: C — published secondary interpretation.** It supports the sequence and documents a cycle-ruler reference-point variant, but it is not the original Sunil John teaching source. The variant is not implemented.

### Primary teaching leads — Sunil John

- **Video:** “BCP {Bhrighu Chakra Paddathi} – Mentor Sunil John”, Saptarishis Astrology, 22 January 2017. https://www.youtube.com/watch?v=5q5aTQIBnjk
- **Video:** “Advance Techniques of Bhrigu Chakra Paddhati by Sunil John”, Saptarishis Astrology, 15 April 2023. https://www.youtube.com/watch?v=tVpyuo-cxzI

The public descriptions establish these as BCP teaching sources, but the cycle-lord statements have not yet been extracted with exact lecture timestamps. They are primary-source leads, not yet direct proof of the table.

### Other secondary corroboration

- *Bhrigu Chakra Paddhati Overview*, a third-party Scribd upload: https://www.scribd.com/document/549460315/BCP-CycleLords
- Mkundali BCP methodology page: https://mkundali.com/bcp-astrology-software/

These are secondary references and do not establish original provenance.

## Implementation boundary

The current engine calculates the Lagna-based activated house only:

`activated_house = ((running_year - 1) % 12) + 1`

It returns the cycle-lord label provisionally, but does not calculate the second reference house from the natal cycle ruler. That requires chart placements and primary-source confirmation. The API and UI explicitly expose this limitation.

## Still required

1. Extract Sunil John's original BCP teaching with exact timestamps or page references.
2. Verify the nine cycle-lord blocks against the original source and worked examples.
3. Determine whether the cycle-ruler reference-point variant is part of the core BCP method, a later extension, or a distinct school.
4. Confirm running-year boundaries and 29-February treatment in the primary BCP material.
5. Record conflicts rather than silently choosing one interpretation.
