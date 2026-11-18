# BCP cycle-lord sequence: evidence status

## Provisional sequence exposed in code — secondary extension

| Chakra | Running years | Provisional extension ruler |
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

The code groups life years into twelve-year blocks and exposes the sequence above only as provisional cycle-ruler metadata. Its traceable published source is M. Imran's 19 January 2023 article. The article explicitly says its objective is to “expand the horizon of Bhrigu Chakra” and search for a lord for each 12-year cycle. Treat this as a published secondary extension, not as established core/original BCP. No prediction is generated from this label.

## Direct source for the 12-house year rotation

- **Source:** Saptarishis Astrology, *Bhrighu Chakra Paddathi – 1*, page metadata credits Vinayak Bhatt, 24 January 2023: https://saptarishisastrology.com/bhrighu-chakra-paddathi-1-by-saptarishis-astrology/
- **Exact location:** method steps 1–4 and running-year example (article lines 62–78).
- **Directly stated:** 1st house corresponds to 1st year, 2nd to 2nd year, through 12th; the cycle repeats with 1st house in year 13. The worked example distinguishes the running year from the completed year and uses the birthday as the boundary.
- **Evidence grade:** B for the Lagna-based 12-house rotation and running-year convention as described by this Saptarishis publication. This does not verify the cycle-swami sequence or every predictive interpretation.

## Sources located

### Published secondary extension — M. Imran

- **Article:** “Bhrigu Chakra with Cycle Rulers”
- **Author:** M. Imran
- **Publisher:** Saptarishis Astrology
- **Page date:** 19 January 2023
- **URL:** https://saptarishisastrology.com/bhrigu-chakra-with-cycle-rulers-by-m-imran/

The article explicitly lists the nine 12-year cycle rulers in the same order as the provisional code table. Crucially, its opening states that the objective is to expand the horizon of Bhrigu Chakra and search for a lord of every 12-year cycle. The sequence should therefore be treated as M. Imran's published extension unless an earlier primary source is produced. The article also proposes a parallel count from natal Lagna and from the natal sign of the current cycle ruler (Moon for years 1–12, Mercury for 13–24, etc.). In this variant, the cycle ruler's natal sign becomes the reference first house for that 12-year cycle.

**Evidence grade: C — published secondary extension.** It documents the sequence and the cycle-ruler reference-point variant, but does not establish either as part of the original/core Sunil John BCP method. The article title attributes the piece to M. Imran; the page metadata separately credits Vinayak Bhatt as the page author. The reference-point variant is implemented only as a provisional mapping in the supplied-chart adapter; it is not promoted to a verified BCP rule or used to generate predictions.

### Primary teaching leads — Sunil John

- **Video:** “BCP {Bhrighu Chakra Paddathi} – Mentor Sunil John”, Saptarishis Astrology, 22 January 2017. https://www.youtube.com/watch?v=5q5aTQIBnjk
- **Video:** “Advance Techniques of Bhrigu Chakra Paddhati by Sunil John”, Saptarishis Astrology, 15 April 2023. https://www.youtube.com/watch?v=tVpyuo-cxzI

### Direct transcript evidence — Sunil John, 15 April 2023

**Source:** *Advance Techniques of Bhrigu Chakra Paddhati by Sunil John | BCP Techniques | BCP Concept*, Saptarishis Astrology Magazine, published 15 April 2023, duration 55:14.

**Transcript track:** English auto-generated captions (ASR), retrieved 19 November 2026. Technical words may be misrecognized; timestamps should be checked against the audio before turning a qualitative statement into executable logic.

**Video:** https://www.youtube.com/watch?v=tVpyuo-cxzI

| Video time | Direct teaching point | Evidence boundary |
|---|---|---|
| [02:29–03:00](https://youtu.be/tVpyuo-cxzI?t=149) | First year activates the 1st house; the sequence runs through the 12th year/12th house and returns to the 1st house in year 13. | Direct support for the repeating 12-house rotation. |
| [03:00–04:00](https://youtu.be/tVpyuo-cxzI?t=180) | The first year runs from birth until the day before the first birthday; after completion of that year, the second house-year begins. | Direct support for a birthday-based running-year boundary. |
| [34:03–34:26](https://youtu.be/tVpyuo-cxzI?t=2043) | Sunil John says that when the Rahu–Ketu axis is activated in the BCP focus year, it is a year of transformation. | Direct qualitative observation; the excerpt does not define what constitutes activation of the Rahu–Ketu axis. |
| [47:48–48:07](https://youtu.be/tVpyuo-cxzI?t=2868) | He says Jupiter and Rahu activated together in the BCP focus year make it “a year to remember”. | Direct qualitative rule; “activated together” is not formally defined as conjunction, aspect or another condition. |

**Evidence grade:** B — direct statement by the named BCP teacher in a published teaching video. The transcript is ASR, not a manual transcript, and this is teaching evidence rather than a classical-text citation or independent predictive validation.

**What this source establishes:** the basic 12-house rotation, birthday-based running-year convention, and two qualitative focus-year observations (Rahu–Ketu transformation; Jupiter–Rahu combined activation).

**What it does not establish:** the nine 12-year cycle-swami sequence; the natal-sign reference-point variant described by M. Imran; Bhrighu Chakra Bindu degree-to-day arithmetic; or a deterministic prediction rule. Keep the cycle-swami labels explicitly identified as a secondary extension and keep both qualitative observations research-only until their conditions and counterexamples are formalized.

### Coverage check of the two public Sunil John videos

- The 22 January 2017 video, *BCP {Bhrighu Chakra Paddathi} – Mentor Sunil John* (https://www.youtube.com/watch?v=5q5aTQIBnjk), was checked against its available transcript. The nine cycle-ruler sequence is not stated in that transcript.
- The 15 April 2023 *Advance Techniques* video was checked against its English auto-generated transcript. It states the 12-house rotation and the qualitative Rahu–Ketu / Jupiter–Rahu observations above, but does not state the nine cycle-ruler sequence or the parallel natal-cycle-ruler reference-house method.

This check is limited to these two public videos. It does not prove that the sequence is absent from every course, private recording, article or other teaching source.

### Other secondary corroboration

- *Bhrigu Chakra Paddhati Overview*, a third-party Scribd upload: https://www.scribd.com/document/549460315/BCP-CycleLords
- Mkundali BCP methodology page: https://mkundali.com/bcp-astrology-software/

These are secondary references and do not establish original provenance.

## Implementation boundary

The core `analyze_bcp` engine calculates the documented Lagna-based activated house:

`activated_house = ((running_year - 1) % 12) + 1`

A separate chart adapter (`backend/app/chart/manual.py`) can calculate the parallel reference sign/house from the supplied natal position of the provisional cycle ruler. The normal chart-analysis adapter can pass approximate Astronomy Engine positions into that mapping. The returned status remains `provisional_secondary_source_only`; this is an implementation of M. Imran's extension, not a verified core BCP rule and not a predictive interpretation. If the relevant planet position is absent, the adapter reports that it cannot calculate the reference house.

## Additional BCP source: Bhrighu Chakra Bindu

Saptarishis Astrology, *Bhrighu Chakra Paddathi – 2*, page metadata credits Vinayak Bhatt, 24 January 2023: https://saptarishisastrology.com/bhrighu-chakra-paddathi-2-by-saptarishis-astrology/. It describes trigger-point inputs and a degree-to-day calculation, but the arithmetic/degree notation is unresolved. See `BCP_TRIGGER_POINTS.md`; no date calculation is enabled.

## Still required

1. Find an earlier primary source or author clarification that establishes whether the nine cycle-ruler blocks belong to core BCP or are M. Imran's later extension.
2. Verify the nine cycle-ruler blocks against any primary source and worked examples before upgrading their status.
3. Determine whether the cycle-ruler reference-point variant is part of core BCP, a later extension, or a distinct school; current evidence places it in M. Imran's extension.
4. Confirm running-year boundaries and 29-February treatment in the primary BCP material.
5. Record conflicts rather than silently choosing one interpretation.
