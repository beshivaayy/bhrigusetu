# BCP Specification

## Project definition
BCP means **Bhrighu Chakra Paddathi / Bhrigu Chakra Paddhati**.

## Evidence status

**House-year rotation and birthday-based running-year convention: directly documented in Saptarishis BCP-1 and Sunil John's 2023 teaching video.**
**Rahu–Ketu focus-year transformation and Jupiter–Rahu combined activation: directly stated qualitative teaching observations; research-only, not enabled.**
**Cycle-swami sequence: M. Imran's published secondary extension; not verified as core/original BCP.**
**Bhrighu Chakra Bindu trigger-point dating: source-described, arithmetic notation unresolved.**

### Implemented arithmetic

The API currently implements:
- Running year = completed calendar years + 1.
- Activated Lagna house = `((running_year - 1) % 12) + 1`.
- 12-year cycle index = `((running_year - 1) // 12) + 1`.
- Provisional chakra-swami metadata for cycles 1–9: Moon, Mercury, Venus, Sun, Mars, Jupiter, Saturn, Rahu, Ketu. This sequence is sourced to M. Imran's published 2023 extension, not verified as core/original BCP; it is not used to generate predictions.

### Direct source for house-year rotation

Saptarishis Astrology, *Bhrighu Chakra Paddathi – 1*, page dated 24 January 2023:
https://saptarishisastrology.com/bhrighu-chakra-paddathi-1-by-saptarishis-astrology/

Exact source locations:
- Method steps 1–4: article lines 62–73 — Lagna 1st house = first year, 2nd house = second year, through 12th; the sequence rotates and 1st house repeats in year 13.
- Running-year example: article lines 76–78 — distinguishes the current running year from the completed year and maps it back to the activated house.
- The article describes the method as distinct from the three-lagna Sudarshana Chakra approach.

This source supports the Lagna-based 12-house rotation and birthday-based running-year convention implemented here. Sunil John's 15 April 2023 teaching video independently states the same rotation and adds qualitative focus-year observations; see [BCP cycle-lord evidence](BCP_CYCLE_LORD_EVIDENCE.md). Neither source states the nine cycle-swami sequence.

### Cycle-swami extension — secondary source only

The nine 12-year blocks are supported by M. Imran's published article “Bhrigu Chakra with Cycle Rulers” (19 Jan 2023):
https://saptarishisastrology.com/bhrigu-chakra-with-cycle-rulers-by-m-imran/

The article lists Moon, Mercury, Venus, Sun, Mars, Jupiter, Saturn, Rahu and Ketu as rulers for successive 12-year blocks. Its opening explicitly frames the work as an effort to “expand the horizon of Bhrigu Chakra” and search for cycle rulers. Treat it as M. Imran's published secondary extension, not as proof that the sequence is core/original BCP. The 2017 and 2023 public Sunil John video transcripts reviewed so far do not state this sequence. The API exposes it only as provisional metadata; no prediction is based on it.

### Direct teaching evidence for qualitative focus-year observations

Sunil John's *Advance Techniques of Bhrigu Chakra Paddhati* (Saptarishis Astrology, 15 April 2023) states:
- **34:03–34:26:** when the Rahu–Ketu axis is activated in the BCP focus year, it is a transformation year.
- **47:48–48:07:** Jupiter and Rahu activated together in the BCP focus year make it a memorable year.

Source: https://www.youtube.com/watch?v=tVpyuo-cxzI

Transcript: English auto-generated captions (ASR), retrieved 19 November 2026. The transcript wording and timestamps should be checked against the audio before implementation.

These are qualitative teaching observations, not executable rules. The video does not define the precise activation condition (conjunction, aspect, dispositorship or another mechanism), quantify strength, or establish the absence of counterexamples. Keep both observations research-only and do not enable predictions from them.

### Cycle-ruler reference-point extension — provisional implementation only

M. Imran's article describes counting each 12-year cycle in parallel from the natal sign of its cycle ruler (Moon for years 1–12, Mercury for 13–24, etc.) in addition to natal Lagna. The supplied-chart adapter implements this mapping when the relevant planet longitude is present; the standard chart-analysis adapter can supply its calculated chart positions. The output is explicitly marked `provisional_secondary_source_only`. This is M. Imran's published extension, not a verified core/original BCP rule, and it is not used to generate predictions. Missing cycle-ruler positions are not guessed. See [BCP cycle-lord evidence](BCP_CYCLE_LORD_EVIDENCE.md).

## Bhrighu Chakra Bindu / trigger-point dating — not implemented

Saptarishis BCP-2 describes a second-stage method that, after identifying the active year/house and possible event combinations, records degrees of planets in the active house, its lord, conjunctions, aspects, upagrahas, arudhas, dispositors, sahams and the Ascendant degree. It then converts degrees to days and adds the offset to the last birthday.

Source:
https://saptarishisastrology.com/bhrighu-chakra-paddathi-2-by-saptarishis-astrology/

The article gives a nominal conversion of one sign (30°) to one year (365.2425 days), or approximately 12.17 days per degree. However, worked examples use notations such as 24Ar32 and 16Cn45 with arithmetic that is not consistently reproducible from the displayed values. It is unclear whether the notation is decimal degrees, degrees-and-minutes, or a rounded manual convention; at least one displayed multiplication is arithmetically inconsistent. Therefore no trigger date is calculated by the API. See [BCP trigger-point research](BCP_TRIGGER_POINTS.md).

## Date convention

The running year changes on the birthday. For a 29-February birth in a non-leap year, this implementation uses 1 March as the anniversary. This is an explicit software convention and requires confirmation against the relevant BCP source before being treated as canonical.

## Not implemented

- Cycle-ruler parallel reference-house activation.
- Bhrighu Chakra Bindu trigger-point dates.
- Planetary/house interpretation.
- Monthly or sub-period progression.
- Aspect-based activation or modifiers.
- Rahu–Ketu transformation and Jupiter–Rahu combined-activation interpretations; these remain qualitative research candidates until the activation conditions, exceptions and counterexamples are formalized.
- Any predictive result or event promise.

## Required evidence for production

For every mechanism, record the exact statement, author, source URL, page/section or lecture timestamp, computational condition, timing convention, exceptions, confidence and a reproducible validation case.
