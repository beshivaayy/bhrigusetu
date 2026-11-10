# BCP Bhrighu Chakra Bindu / trigger-point research

Source: Saptarishis Astrology, *Bhrighu Chakra Paddathi – 2*: https://saptarishisastrology.com/bhrighu-chakra-paddathi-2-by-saptarishis-astrology/

The article describes identifying the active running-year house, recording degrees of planets in that house, the house lord, conjunctions, aspects, upagrahas, arudhas, dispositor's dispositor, sahams and Ascendant. It proposes converting degrees to days at approximately 12.17 days per degree and adding the offset to the last birthday.

## Arithmetic ambiguity

Worked examples use values such as `24Ar32`, `16Cn45`, `20.15` and `19.39`. The displayed multiplication `24.32 × 12.17 = 298.89` is not reproducible if 24.32 is decimal degrees (it is about 295.97 days). Treating 24°32′ as sexagesimal gives about 298.57 days. The source does not consistently state how minutes are converted, and at least one displayed multiplication appears inconsistent. No trigger-date engine should silently select one interpretation.

## Status

Not implemented. The API currently calculates only the Lagna-based running-year house and does not return trigger dates.

## Validation needed

1. Obtain the original calculation worksheet or author clarification for degree notation.
2. Recompute worked examples with decimal-degree and sexagesimal interpretations.
3. Decide between 365.2425 days, 365 days and the rounded 12.17 constant.
4. Formalize retrograde handling and multi-trigger precedence.
5. Test both successful and missed cases.