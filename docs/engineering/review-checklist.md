# Technical Review Checklist

## Purpose

This checklist defines what technical reviewers should inspect before recommending merge for AI Sleep Companion changes.

## Architecture Boundary Checks

Check that:

1. code follows `contracts -> domain -> policies/config -> experience -> app/components`
2. domain logic is not embedded in page files or presentational components
3. product decision logic is not hidden inside UI components
4. future backend calls are not being wired directly into pages or components

## Contract Usage Checks

Check that:

1. canonical contract names are preserved
2. new fields are not invented silently
3. lifecycle states and fallback reasons are typed rather than magic strings
4. mock data matches the documented contract intent

## TypeScript Checks

Check that:

1. `any` is not used without an inline reason
2. overly broad unknown maps are not used where product contracts should exist
3. optional fields have clear meaning
4. product-specific names are used instead of vague generic names

## Fallback Checks

Check that:

1. product fallback behavior is explicit
2. fallback reasons are typed
3. fallback behavior is not hidden behind casual `||` or `??` usage when product meaning changes

## Source Trace Checks

Check that:

1. recommendations and other derived product outputs preserve source trace
2. reviewers can tell why an item appeared, whether it is fallback, and what input produced it

## Event and Observability Checks

Check that:

1. key user actions have typed event payloads or a documented omission reason
2. event names are not invented inline inside components
3. analytics or observability placeholders are not misrepresented as complete production wiring

## React Page and Component Checks

Check that:

1. page files stay thin
2. components receive typed props
3. UI state is separated from product state
4. presentational components are not deciding business rules

## Future Go Gin Readiness Checks

Check that:

1. the frontend change keeps a clear API boundary
2. backend DTO assumptions are not leaked into UI structure
3. mock behavior is clearly marked as mock when real backend integration is not present

## Maintainability Checks

Check that:

1. the change stays within the allowed task scope
2. the implementation is reviewable and not an unnecessary rewrite
3. copy, thresholds, or policy values are not duplicated across multiple files
4. the change does not create hidden coupling across routes

## What Usually Counts as a P1 Blocker

Typical P1 blockers include:

1. contract-breaking field renames or payload-shape changes without approval
2. domain or policy logic embedded directly in page or presentational component code
3. silent fallback that changes product behavior without a typed reason
4. implementation that violates explicit source-of-truth documents
5. scope violations, such as runtime code changes during a documentation-only task

## What Usually Counts as a P2 Concern

Typical P2 concerns include:

1. weak naming that will increase confusion later
2. partial event coverage for an otherwise valid feature
3. maintainability issues that do not yet break behavior
4. unclear mock-versus-real labeling
