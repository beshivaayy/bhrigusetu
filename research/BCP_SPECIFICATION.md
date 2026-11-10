# BCP Specification

## Project definition
BCP means **Bhrigu Chakra Paddhati**.

## Implementation status
**PARTIAL — calculation arithmetic implemented; primary-source verification pending.**

The API currently implements:
- Running year = completed calendar years + 1.
- Activated house = ((running_year - 1) % 12) + 1.
- Cycle index = ((running_year - 1) // 12) + 1.
- Provisional cycle sequence for cycles 1–9: Moon, Mercury, Venus, Sun, Mars, Jupiter, Saturn, Rahu, Ketu.

The house rotation and running-year convention are encoded as the project's current working specification. The cycle-swami mapping is deliberately marked provisional until exact primary-source references are attached. It must not be represented as independently verified.

## Date convention
The running year changes on the birthday. For a 29-February birth in a non-leap year, this implementation uses 1 March as the anniversary. This is an explicit software convention and requires confirmation against the relevant BCP source before being treated as canonical.

## Not implemented
- Planetary/house interpretation.
- Monthly or sub-period progression.
- Aspect-based activation or modifiers.
- Any predictive result or event promise.

## Required evidence for production
For every mechanism, record the exact statement, author, source URL, page/section or lecture timestamp, computational condition, timing convention, exceptions, confidence and a reproducible validation case.
