# Stage 3 Technical Constraints

## Purpose

This document defines the technical guardrails for Stage 3 data contract, mock data, and integration-preparation work.

Stage 3 is not a feature implementation stage. Its purpose is to define stable data boundaries, validate product data needs, and prepare the codebase for later integration.

## Scope Constraints

Agents may only work within the scope explicitly assigned in their task prompt.

Do not implement real backend APIs.
Do not introduce database logic.
Do not introduce authentication logic.
Do not introduce payment, analytics, notification, or AI service integrations.
Do not change production UI behavior unless explicitly requested.
Do not expand product scope beyond approved PRD and Stage 3 documents.

If a missing product decision blocks the work, document it as an open question instead of inventing behavior.

## File Modification Constraints

Agents must only modify files explicitly assigned in their task prompt.

Do not modify unrelated UI files, routing files, package configuration, build configuration, or global styles unless explicitly allowed.

If a required change appears outside the allowed file scope, document it as a blocker instead of modifying it.

## Dependency Constraints

Do not add new npm dependencies without explicit approval.

Use existing project dependencies and native TypeScript/React capabilities first.

If a new dependency is necessary, document:

- package name
- purpose
- reason existing tools are insufficient
- expected impact on bundle/runtime

## Architecture Constraints

Data contracts must live under:

`src/contracts/`

Mock data must live under:

`src/mocks/`

Stage 3 documentation must live under:

`docs/stage-3/`

Contracts should not import UI components.
Contracts should not import mock data.
Mocks may import contracts.
UI may import contracts and mocks only when explicitly allowed by the task.

Avoid circular dependencies.

## Data Contract Constraints

All domain objects must have stable IDs where applicable.

Avoid `any`.

Use finite union types when values are known and bounded.

Use explicit nullable fields when the UI needs to distinguish:

- not loaded
- empty
- unknown
- intentionally absent

Avoid vague catch-all fields unless they are documented.

Contract names should align with product domains:

- User
- Onboarding
- Sleep
- Conversation
- Memory
- Room

## Mock Data Constraints

Mock data must represent realistic MVP states.

Each mock object must map clearly to an existing contract type.

Do not encode UI presentation logic inside mock data.

Mock data should cover the most important app states:

- first launch state
- returning user state
- incomplete onboarding state
- completed onboarding state
- empty memory state
- populated memory state
- active sleep/session state where applicable

## UI Integration Constraints

Do not wire contracts or mocks into production UI unless explicitly requested.

If integration is requested, keep changes minimal, typed, and reversible.

UI should not define duplicate local types when shared contracts already exist.

## TypeScript Constraints

Use strict, readable TypeScript.

Prefer named exports for contract modules.

Do not use `any`.

Do not suppress TypeScript errors with `// @ts-ignore` or `// @ts-expect-error` unless the reason is documented.

## Review Requirements

Before marking Stage 3 work complete, verify:

- Contracts are type-safe.
- Mock data conforms to contracts.
- No unrelated files were modified.
- No new dependencies were added.
- No production UI behavior was changed unless explicitly requested.
- Open questions are documented instead of silently assumed.
