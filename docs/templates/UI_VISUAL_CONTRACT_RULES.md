# UI Visual Contract Rules

This template defines how UI specs should describe visually sensitive effects so implementation can be evaluated by visible outcome rather than by code presence.

Use or adapt these rules when writing new UI specs. Do not treat this template as the active source of truth for a page unless a page-level UI spec explicitly incorporates it.

## X. Visual Contract Rules

### X.1 UI spec must define visual result, not only design intent

Descriptive intent words such as:

- soft
- subtle
- calm
- premium
- atmospheric
- stronger highlight

are not sufficient on their own.

Whenever a visual effect materially affects implementation, the spec must also define:

- where the effect appears
- what it is attached to
- how strong it should feel
- what it must not look like
- what counts as visual failure

### X.2 Visual requirements must include fail conditions when necessary

For any effect that is easy to technically implement but easy to visually miss, the spec should define fail conditions.

Examples of fail conditions include:

- effect exists in code but is not visually perceptible
- effect is too weak to influence hierarchy
- effect is too strong and becomes distracting
- effect looks dirty, muddy, or patchy
- effect reduces readability
- motion technically exists but does not create a clear visual rhythm

### X.3 Effects must be judged by visible outcome, not implementation presence

A visual requirement is not considered satisfied merely because a class, gradient, blur, glow, or animation exists in code.

It is only satisfied if the visible result matches the intended hierarchy, readability, and atmosphere defined by the spec.

### X.4 UI spec should mark visual dependency level

Each major visual element should, where relevant, be marked as one of:

- locked
- flexible within range
- placeholder for current phase

This is especially important for:

- highlight layers
- glow / aura effects
- animated emphasis
- scene-dependent overlays
- bottom scrim and safe zone treatments

### X.5 Scene-dependent readability must be structurally guaranteed

If backgrounds vary significantly across scenes, the UI spec must define structural readability measures rather than relying only on runtime adaptation.

Examples include:

- fixed bottom scrim
- safe text zone
- stable text anchors
- fixed contrast strategy

The spec must state which text elements must remain readable across all approved scenes.
