# PRD Implementation Readiness Rules

This template defines what a non-UI delivery document or PRD should include so implementation does not rely on guesswork.

Use or adapt these rules when writing new product docs. Do not treat this template as the active source of truth for a page unless a page-level document explicitly incorporates it.

## X. Implementation Readiness Rules

### X.1 This document must define more than visual outcome

This document must not only describe what the page should look like or what the user should feel.

It must also define, where applicable:

- page responsibility
- upstream and downstream page relationships
- entry and exit actions
- required runtime states
- required data inputs
- data source ownership
- whether current phase allows mock or requires real wiring

### X.2 Data source must be explicit

If a UI element is required by the page, the document must specify its source whenever the source affects implementation.

At minimum, required fields should be marked as one of:

- route / navigation input
- local config
- session-level store
- backend contract
- derived view model
- mock only in current phase

A UI requirement is incomplete if it defines display result but leaves the data source fully implicit.

### X.3 Mock vs real boundary must be explicit

For each core page module, the document should state whether the current delivery phase is:

- visual prototype only
- front-end UI implementation with mock data
- data wiring against real contract
- runtime-complete feature

If a module is still mock, the document must say so explicitly.

This is required to reduce future rework and prevent demo behavior from being mistaken for production behavior.

### X.4 Page relationships must be implementation-usable

This document must explicitly define:

- where the page can be entered from
- what data or context it receives at entry
- what action causes exit
- which page consumes the current page output
- whether the next page reads, mutates, or only displays that output

### X.5 Business timing rules must be explicit

Where applicable, the document must define runtime timing rules such as:

- when a session is created
- when a session is consumed or expired
- when memory may be extracted
- when a room selection becomes active
- when fallback logic may replace the ideal path

If timing rules are not yet locked, the document must identify them as unresolved rather than leaving them implicit.
