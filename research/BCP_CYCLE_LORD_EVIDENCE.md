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

The implementation groups life years into twelve-year blocks and maps blocks 1–9 to the sequence above. This is consistent with the working specification already encoded in `backend/app/bcp/engine.py`.

## Evidence found in this audit

- M. Imran, “Bhrigu Chakra with Cycle Rulers,” Saptarishis Astrology (page dated 19 Jan 2023): https://saptarishisastrology.com/bhrigu-chakra-with-cycle-rulers-by-m-imran/. The article explicitly lists the nine 12-year cycle rulers in the same order as the working table and explains a further technique: count each year both from natal Lagna and from the natal sign of the current cycle ruler (Moon for years 1–12, Mercury for 13–24, etc.). This is useful documentation of a published BCP interpretation, but it is not the original Sunil John teaching source and its cycle-ruler reference-point extension is not yet independently confirmed.
- The article's house table says each cycle ruler's natal sign becomes the reference 1st house for that 12-year cycle. The current engine does **not** calculate that second reference point; it calculates the Lagna-based activated house only. Keep this as a separately versioned method variant until primary-source confirmation.

- M. Imran, “Bhrigu Chakra with Cycle Rulers,” Saptarishis Astrology (page dated 19 Jan 2023): https://saptarishisastrology.com/bhrigu-chakra-with-cycle-rulers-by-m-imran/. The article explicitly lists the nine 12-year cycle rulers in the same order as the working table and explains a further technique: count each year both from natal Lagna and from the natal sign of the current cycle ruler (Moon for years 1–12, Mercury for 13–24, etc.). This is useful direct documentation of a published BCP interpretation, but it is not the original Sunil John teaching source and its cycle-ruler reference-point extension is not yet independently confirmed.
- The article's house table says each cycle ruler's natal sign becomes the reference 1st house for that 12-year cycle. The current engine does **not** calculate that second reference point; it calculates the Lagna-based activated house only. Keep this as a separately versioned method variant until primary-source confirmation.

- A primary BCP teaching video by Sunil John, published by Saptarishis Astrology on 22 January 2017, is located: https://www.youtube.com/watch?v=5q5aTQIBnjk. Its public description confirms a BCP methodology lecture and live reading demonstration, but does not expose the cycle-lord sequence in the description. The sequence must be extracted from the lecture itself with exact timestamps before this counts as direct confirmation.
- An additional advanced BCP lecture by Sunil John is listed here: https://www.youtube.com/watch?v=tVpyuo-cxzI (15 April 2023). Exact statements and timestamps remain to be transcribed.

- A publicly accessible 17-page document titled *Bhrigu Chakra Paddhati Overview* reproduces the nine 12-year blocks and includes worked examples. It is hosted on Scribd by a third-party uploader, not a primary publication: https://www.scribd.com/document/549460315/BCP-CycleLords
- A commercial software methodology page independently displays the same nine blocks and twelve house-year divisions: https://mkundali.com/bcp-astrology-software/

## Evidence grade

**C — secondary corroboration only.** M. Imran's published article supports the nine cycle-lord sequence and documents a cycle-ruler reference-point extension. It does not establish original provenance or settle whether this extension is mandatory in every BCP school. They are not sufficient to upgrade the mapping to primary-source verified.

## Still required

Locate and cite the original Sunil John / Saptarishis BCP teaching material, with exact page, article section or lecture timestamp. Cross-check against the worked examples and record any divergence. Until then, the sequence remains labelled provisional in the API and UI.
