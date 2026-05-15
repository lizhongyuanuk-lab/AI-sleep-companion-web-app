# Technical Review Writing Rules

## Purpose

This document defines how technical review findings must be written for the AI Sleep Companion repository so review output stays actionable, evidence-based, and within scope.

## Review Is Not Product Redesign

Technical review checks compliance against the current source of truth. It does not invent new product behavior, rewrite the PRD, or block merge for personal preference.

If the implementation conflicts with source-of-truth docs, call that out directly. If the source docs themselves conflict, mark `Needs Product Decision`.

## Evidence Is Required

Every issue must include evidence. Evidence may come from:

- a file path and code snippet summary
- a command result
- a failing type, lint, or build check
- a documented mismatch against an explicit source-of-truth rule

Do not write unsupported claims like "this feels wrong" or "this might break" without concrete evidence.

## Severity Levels

### P1 Blocker

Use for issues that must be fixed before merge because they create a clear correctness, contract, architecture, or scope violation.

### P2 Concern

Use for meaningful risks that should be addressed soon but do not automatically block merge on their own.

### P3 Note

Use for informational notes, follow-ups, or polish items.

## P1 Must Be Used Carefully

P1 blockers should be rare and well-supported. Do not use P1 for:

- future-stage work that is not part of the current task
- personal style preferences
- speculative backend needs
- requests to redesign the product beyond the approved source documents

## Required Issue Format

Every review issue should include:

- `Title`
- `File`
- `Evidence`
- `Violated rule`
- `Risk`
- `Required fix`
- `Validation`

For P1 blockers, all fields above are mandatory.

## Required Review Output Format

Every technical review must include:

- `Status: pass / pass-with-notes / blocked`
- `Scope reviewed`
- `Summary`
- `P1 blockers`
- `P2 concerns`
- `P3 notes`
- `Architecture compliance`
- `Merge recommendation`
- `Open questions`

Recommended additions when relevant:

- `Contract compliance`
- `Mock vs real behavior check`
- `Commands run`

## Future-Stage Blocking Rule

Reviewers must not block merge for future-stage requirements unless the current task explicitly requires them.

Examples of non-blocking future-stage gaps when out of scope:

- real Go Gin backend integration
- real database wiring
- production authentication
- real analytics provider hookup
- real LLM provider integration

If such a gap matters later, record it as a P2 concern or open question rather than a P1 blocker unless the current task explicitly requires that capability.
