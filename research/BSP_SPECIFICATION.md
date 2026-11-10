# BSP Specification

## Project definition
BSP means **Bhrigu Saral Paddhati**.

## Implementation status
**NOT ENABLED — research and source audit required.**

The API currently returns an empty triggered-rule list by design. No BSP-specific rule is to be enabled from a generic Jyotish principle or an unattributed internet summary.

## Required rule record
Every production rule must include:
- Stable Rule ID and exact rule statement.
- Planet and natal placement conditions.
- House/sign counting convention.
- Running-year and/or transit trigger.
- Aspect and modifier conditions.
- Exceptions and conflicting source statements.
- Author, source title, URL, page/section or lecture timestamp.
- Evidence grade and confidence rationale.
- At least one source-derived test case with expected output.

## Rule activation policy
A rule may be enabled only when its source location and deterministic preconditions are recorded and its tests pass. Uncertain rules remain disabled and visible as research items.
