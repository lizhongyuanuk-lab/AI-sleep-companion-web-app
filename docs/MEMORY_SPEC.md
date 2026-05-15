# Memory Page Main Document: PRD + Non-UI Delivery Specification

This document is the current single source of truth for the `/memory` page product definition, runtime behavior, content boundaries, page skeleton, and non-UI implementation requirements.

It defines what the Memory page is, what it must contain, what it must not contain, what upstream data it depends on, what downstream capabilities it enables, what fallback behaviors are allowed, and what qualifies as a correct implementation.

## 1. Document Role and Priority

Priority order for `/memory` is fixed as:

1. this document
2. [docs/MEMORY_UI_SPEC.md](/Users/zhongyuanli/Documents/Playground/ai-companion-web/docs/MEMORY_UI_SPEC.md)
3. app-level shared routing and approved data contracts
4. current implementation behavior

If any current implementation, old prototype, or historical note conflicts with this document, this document wins.

This document defines product boundaries, runtime shape, content organization, fallback rules, and page-level acceptance. It does not define detailed visual tokens or interaction styling.

## 2. Page Definition

The Memory page is the user's personal companionship memory space.

It is a calm reflective reading page.

It presents lightly processed, gently interpreted, and continuation-oriented companionship content so the user can:

- understand what has stayed with them recently without rereading every message
- see a small number of recurring themes
- feel remembered across sessions
- return to Talk with continuity instead of restarting from zero

The Memory page is not:

- a transcript-first page
- a chat history page
- a diagnosis page
- a dashboard or report page
- a settings surface
- a management console
- a productivity archive
- a sleep metrics page

The default Memory main page must prioritize edited, reduced, readable companionship reflection rather than raw conversation content.

## 3. User Goals, Product Goals, and Success Criteria

### 3.1 User Goals

Users should be able to:

- understand one clear main insight quickly
- see a few repeated themes without rereading every session
- feel continuity across sessions
- choose from a small set of optional next steps

### 3.2 Product Goals

The page must:

- strengthen continuity across Talk sessions
- reinforce the sense of being remembered and understood
- convert past interactions into reusable companionship context
- provide a low-pressure reflection surface
- support a closed loop back into Talk

### 3.3 Success Criteria

In a short visit, the user should be able to understand:

- what the main insight is
- what recurring themes appeared
- what they can optionally do next

The page succeeds if it feels edited, calm, lightly understanding, and readable.

The page fails if it feels like:

- raw logs
- psychological analysis
- scoring
- emotionally heavy confrontation
- dense data reading
- a dashboard card system

## 4. Scope

### 4.1 In Scope

- one hero insight block
- one recurring insights block with three surfaced items visible by default in the current main page
- same-page reveal of additional recurring items through a lightweight inline control
- lightweight inline expansion of one recurring memory item at a time
- lightweight local detail view content and lightweight per-item actions inside the expanded recurring item in the current UI-only phase
- one take-action module with exactly three equal-weight options in the current default main page
- lightweight empty states
- lightweight error and fallback states
- continuation back into Talk

### 4.2 Out of Scope

- full transcript as the default experience
- large chronological message lists
- diagnosis labels
- psychiatric terminology
- risk scores
- therapeutic scales
- deep journaling tools
- dashboard-like metrics panels
- media-led content blocks
- heavy sleep reports
- issue-frequency tables
- severity rankings
- default-visible management controls

If Deep History or transcript browsing exists later, it belongs to a secondary layer, not the default Memory main page.

## 5. Core Experience Principles

1. Process before display. Raw user messages must not be the main default surface.
2. Gentle, not diagnostic. The page may reflect patterns but must not classify the user clinically.
3. Readability over decoration. Text is the primary actor; containers and background support reading only.
4. Reduced by default. The page should show one main insight, a few repeated themes, and a small set of next steps.
5. Continuity over analysis. The main value is companionship continuity, not analysis.
6. Low pressure by default. The page must not require charts, scores, or specialist vocabulary.
7. No reclassification in the UI layer. The frontend must not invent new labels or analyses outside the approved contract.

## 6. Page Entry and Data Contract

Rendering the Memory main page must not depend on transcript data.

Required page-level inputs:

```ts
type MemoryPageData = {
  user_id: string;
  memory_page_available: boolean;
  recent_memory_summary: {
    headline_summary: string;
    time_window_label: string;
    summary_confidence: "low" | "medium" | "high";
    source_session_count: number;
    supporting_line?: string | null;
  } | null;
  recurring_topics: Array<{
    memory_id: string;
    display_text: string;
    supporting_session_count: number;
    time_window_label: string;
    status: "active" | "hidden";
    exclude_from_personalization: boolean;
    continuation_hint?: string | null;
  }>;
  helpful_patterns: Array<{
    pattern_id: string;
    display_text: string;
    pattern_type:
      | "pacing"
      | "tone"
      | "room_preference"
      | "conversation_shape"
      | "general";
    evidence_strength: "light" | "medium" | "strong";
    supporting_line?: string | null;
  }>;
  continue_actions: Array<{
    action_id: string;
    action_type: "general" | "topic" | "style" | "deep_history";
    label: string;
    target_route: "/talk" | "/memory/history";
    target_payload?: {
      continuation_source: "memory";
      selected_memory_item_id?: string;
      continuation_mode?: "general" | "topic" | "style";
      soft_prefill_context?: string;
    };
    visual_priority: "primary" | "secondary" | "weak";
  }>;
  memory_items_version: string;
  deep_history_available: boolean;
  memory_hide_capability: boolean;
  last_memory_refresh_at: string;
};
```

Contract rules:

- `recent_memory_summary` must be processed rather than transcript-based
- the page renders `display_text` and at most one short support sentence for recurring insights
- upstream metadata fields may remain available in the contract, but the current default main page does not need to render them in the collapsed reading view
- `helpful_patterns` may remain part of upstream memory processing, but it is not a required standalone default section in the current main-page skeleton
- `continue_actions` may carry processed continuation payload but must not expose internal reasoning
- the frontend must not create new memory records locally
- the current default main page should surface exactly three equal-weight actions and must not render action hierarchy even if upstream contract includes `visual_priority`
- Stage 3 per-memory feedback is limited to `Agree`, `Disagree`, and `Hide`
- `Disagree` is correction feedback and must not be modeled as hide or delete
- `Hide` must set `status = "hidden"` and `exclude_from_personalization = true`
- if the upstream canonical `MemoryItem` includes `influenceWeight`, `Hide` must set it to `0`
- hidden memories must not be displayed on the main page and must not be used by Talk, Sleep, or Home personalization or CTA generation
- `memory_hide_capability` may remain part of the broader page contract to control whether the Stage 3 Hide action is available in the current surface
- any older Delete wording is deprecated historical context only and is not normative for Stage 3
- the current UI-only implementation may use local view-model detail content for expanded recurring items until a dedicated recurring-memory detail contract is defined

## 7. Runtime States

### 7.1 Initial Loading

- show loading placeholders matching the final reading hierarchy
- do not fall back to transcript
- do not fabricate content

### 7.2 Content Available

- render the default modules in the defined order

### 7.3 Partial Content

- render available modules
- provide lightweight fallback for missing sections
- do not blank the whole page because one module failed

### 7.4 No Memory Yet

- show a gentle empty state
- keep a direct path into Talk
- do not expose backend wording such as `insufficient signal`

### 7.5 Page Error / Summary Fetch Failure

- use section-level fallback when some content remains available
- use page-level fallback only when primary content cannot render
- keep a path back to Talk whenever appropriate

## 8. Default Page Composition

The Memory main page uses a single-column vertical structure.

The default top-to-bottom order is fixed:

1. Top Navigation
2. Hero Insight
3. Recurring Insights
4. Take Action
5. Bottom Safe Area

The default main page must not insert additional summary strips, recommendation blocks, charts, media cards, or utility modules between these sections unless explicitly approved in the PRD.

Fallback skeleton rules:

- if Hero Insight is missing, keep Recurring Insights -> Take Action beneath Top Navigation
- if Recurring Insights are missing, keep Hero Insight -> Take Action beneath Top Navigation
- if all structured content is missing, use Empty State -> Take Action beneath Top Navigation

## 9. Core Module Definitions

### 9.1 Hero Insight

The Hero Insight block is the single most important reading area on the page.

It contains exactly:

- one time label
- one hero insight sentence
- one support sentence

No additional paragraph is allowed by default.

The hero sentence must be the strongest line on the page and the first thing users notice after page entry.

The current default main page does not display a page title, subtitle, or additional section heading above the Hero Insight block.

### 9.2 Recurring Insights

Recurring Insights comes after Hero Insight.

It contains:

- three recurring insight items visible by default in the current main page
- a lightweight same-page reveal path for additional recurring memory items when more than three items are available

Each recurring insight item contains, in its collapsed reading state:

- one theme title
- one support sentence

The current default main page does not display a recurring-section title, metadata line, badges, or always-visible management controls in this block.

The current implementation allows one recurring item at a time to expand inline. The expanded state may reveal:

- one subtle hidden shell behind the current item only
- concise supporting detail groups
- lightweight local actions such as `Agree`, `Disagree`, and `Hide`

These expanded controls are secondary to the reading flow and must not turn the Recurring Insights block into a dashboard or management list.

### 9.3 Take Action

Take Action is the required closing module.

It must:

- sit at the bottom of the main content area
- contain exactly three actions in the current default main page
- keep all three actions visually equal
- remain suggestion-oriented rather than funnel-oriented

It must not:

- introduce a primary CTA
- introduce secondary CTA hierarchy
- introduce a fixed bottom bar
- introduce explanatory subtext under action labels

Deep History is not part of the current default main-page skeleton.

## 10. Talk <-> Memory Handoff Contract

Minimum Talk -> Memory inputs:

- `session_id`
- `session_end_time`
- `session_valid_for_memory`
- `extracted_topic_candidates`
- `companionship_strategy_used`
- `interruption_pattern`
- `room_id`

Minimum Memory -> Talk continuation inputs:

- `continuation_source = memory`
- `selected_memory_item_id` when applicable
- `continuation_mode = topic | style | general`
- `soft_prefill_context`

Talk must treat these values as lightweight continuity context rather than as a script to continue verbatim.

## 11. Content and Copy Strategy

All Memory page copy must be:

- warm
- low-stimulus
- concise
- non-diagnostic
- non-judgmental
- emotionally safe by default

Allowed directions:

- recent companionship
- repeated themes
- what has been present lately
- how to continue gently

Disallowed directions:

- pathology language
- strong clinical labels
- risk stratification
- issue-count framing
- severity framing
- long AI-style explanation blocks

## 12. Error and Fallback Strategy

- if Hero Insight is unavailable but other sections are available, keep the other sections and use lightweight fallback text
- if Recurring Insights are unavailable, omit the section or use lightweight fallback; never fabricate themes
- if Take Action data is unavailable, provide up to three generic equal-weight paths back to Talk
- if there is not enough data yet, show a gentle empty state that explains Memory will form gradually through companionship, and keep a Talk entry point
- if all structured content fails, show a page-level fallback while retaining a path to Talk

The page must never fall back to a transcript-first page.

## 13. Technical Boundaries

The frontend must not:

- infer topics locally from transcript
- compute emotional severity
- compute helpful patterns locally
- generate clinical labels
- rewrite backend-provided memory semantics
- silently absorb journaling tools, therapy workflows, sleep analytics dashboards, or note-taking behavior

The current main page must not:

- use dashboard card grids
- use heavy management controls
- use decorative media blocks in the reading flow
- use background emphasis stronger than the main reading content

## 14. Current Implementation Decisions For This Repository

These decisions are confirmed for the current `/memory` implementation pass:

1. the page uses a dark atmospheric reading-first background
2. the first implementation uses local mock data while preserving the documented contract shape above
3. top navigation follows the shared app navigation system
4. the default main page uses exactly three major reading sections beneath the shared top navigation
5. the default main page does not render `helpful_patterns` as a standalone section
6. the current default main page does not render a content-area page title, subtitle, or recurring-section title
7. recurring insight items remain text-first and center-aligned in their collapsed state
8. the current default view shows the first three recurring insight items, plus a lightweight same-page reveal control when more items exist
9. the current implementation allows one recurring insight item at a time to expand inline inside a subtle shell
10. expanded recurring items may show local mock detail groups plus lightweight `Agree`, `Disagree`, and `Hide` actions
11. the current default main page surfaces exactly three equal-weight actions

## 15. Page-Level Acceptance Criteria

Acceptance requires all of the following:

- the default main page displays processed companionship memory rather than raw transcript
- the first thing users notice is one clear hero insight sentence
- the hero insight block contains exactly one label, one hero sentence, and one support sentence
- the current default main page does not display a content-area page title, subtitle, or recurring-section title
- recurring insight items contain only one title and one support line in the collapsed reading view
- the current default main page shows exactly three recurring insight items before the reveal-more control
- additional recurring items, when present, are revealed in the same page rather than by route change or modal
- at most one recurring insight item remains expanded at a time
- if expanded per-item feedback actions are shown, they are limited to `Agree`, `Disagree`, and `Hide`
- no user-facing Delete memory action appears in the Stage 3 default Memory main page
- the page contains Top Navigation -> Hero Insight -> Recurring Insights -> Take Action in the correct order
- the three action options appear visually equal and non-hierarchical
- no long default explanation blocks are introduced
- no metadata, badges, or management controls are required to understand recurring insights in their collapsed reading state
- the page feels edited, reduced, and calm

## 16. Responsibility Boundaries

- Memory is responsible for processed companionship reflection, recurring insights, and continuation entry points back to Talk
- Talk is responsible for live interaction, current-session experience, response generation, and immediate companionship flow
- Room is responsible for environment entry, atmosphere, and scene selection
- Sleep Monitoring is responsible for sleep tracking and sleep-specific records or indicators

Memory may still consume upstream helpful-pattern signals, but it must not rely on them to introduce an additional default standalone section unless the product spec explicitly changes again.
