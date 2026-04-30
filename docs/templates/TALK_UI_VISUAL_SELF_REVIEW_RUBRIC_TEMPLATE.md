# Talk UI Visual Self-Review Rubric Template

## 0. Document Role

This rubric is used after an implementation draft is complete and before final delivery.

It is not a redesign prompt.
It is not permission to expand scope.

It exists to force a stricter self-review of visual quality, structural clarity, and implementation honesty.

The reviewer must act as a critic, not as a defender of the implementation.

## 1. Review Mode

Review the current output against:

- the locked UI spec
- the current implementation brief
- cross-page consistency where relevant
- visible result, not merely code presence

Do not review based on "feature exists in code".
Review based on whether the result is visually and structurally successful.

## 2. Output Format

Output only these 3 sections:

- High priority issues
- Medium priority issues
- Low priority issues

If a section has no issues, write `None`.

Then revise only High priority issues unless explicitly instructed otherwise.

Do not redesign unrelated areas.
Do not add new features.
Do not use review as a reason to expand scope.

## 3. Core Review Dimensions

### 3.1 Spec alignment

Check:

- does the output match the locked UI spec?
- are the required zones, anchors, hierarchy, and structural elements present in the right way?
- was any requirement substituted with a visually different interpretation?

Failure examples:

- an element exists but in the wrong anchor system
- the layout is generally similar but key structure differs
- the result technically contains the required parts but not in the intended hierarchy

### 3.2 Hierarchy clarity

Check:

- is the primary focal point immediately clear?
- is the room name / room identity label correctly weighted where required?
- are secondary elements visibly subordinate?
- does the screen feel intentionally ordered?

Failure examples:

- everything has similar visual weight
- secondary elements compete with the main title or dock
- emphasis exists but does not change what the eye sees first

### 3.3 Readability

Check:

- are title and supporting text clearly readable on the intended background range?
- do bottom scrim and safe zone work structurally?
- is any text floating into unstable contrast regions?

Failure examples:

- text is technically present but hard to read
- readability depends on a lucky background crop
- the page still needs scene-specific rescue styling

### 3.4 Cleanliness

Check:

- does the page feel clean, calm, and low-noise?
- do glow, blur, gradients, and overlays feel intentional rather than messy?
- does any highlight effect create dirtiness, murkiness, or visual clutter?

Failure examples:

- muddy aura
- dirty blur cloud
- patchy bright spots
- stacked effects that look accidental

### 3.5 Emphasis effects

For any glow, aura, highlight, halo, or emphasis layer, check:

- is the effect visibly perceptible?
- does it improve hierarchy?
- is it soft and controlled?
- does it integrate naturally into the page?
- does it remain calm rather than decorative?

Failure examples:

- effect exists in code but is barely visible
- effect is too weak to change visual focus
- effect is too strong and looks like a spotlight
- effect hugs text edges instead of shaping a zone
- effect looks like dirt/fog rather than premium atmosphere

### 3.6 Motion quality

For any animated element, check:

- is the motion actually perceptible to the eye?
- is the motion calm and slow enough for the product tone?
- does it support emphasis or state clarity?
- does it avoid looking like generic decorative animation?

Failure examples:

- motion technically runs but cannot be felt visually
- motion is visible but distracting
- motion adds activity without improving hierarchy or state communication

### 3.7 Cross-page consistency

Check:

- does this page align with adjacent page systems where it should?
- are room name anchors, text alignment logic, and shell behavior consistent if the spec requires continuity?
- does the page feel like it belongs to the same product family?

Failure examples:

- room-name anchor changed between Room and Talk without product reason
- shell weight differs too much from the approved system
- this page looks like a different app

### 3.8 Mock honesty

Check:

- is anything still mock?
- is any fake state machine visually implying production-complete runtime?
- is placeholder content clearly separable from final behavior?

Failure examples:

- demo state presented as real runtime
- fake response flow presented as actual runtime behavior
- hardcoded values quietly acting as contract truth

### 3.9 Scope discipline

Check:

- did the implementation remain within the current task?
- did review-driven edits change unrelated areas?
- was any redesign smuggled in under cleanup or quality improvement?

Failure examples:

- unrelated page touched
- shared component changed without necessity
- visual review turned into product redesign

## 4. Priority Rules

### High priority issues

Use High when the issue:

- breaks the locked spec
- makes hierarchy fail
- makes the page hard to read
- makes the result visibly low quality
- causes likely future rework
- misrepresents mock behavior as real
- exceeds current scope in a risky way

### Medium priority issues

Use Medium when the issue:

- does not break the page
- but weakens quality, consistency, or polish
- would be noticeable in review
- should probably be fixed soon, but is not blocking this round

### Low priority issues

Use Low when the issue:

- is a minor polish problem
- does not change the core page judgment
- can safely wait for a later polish round

## 5. Review Behavior Rules

1. Do not defend the implementation just because an effect is technically present.
2. Do not assume "close enough" if the visual result still fails the intended hierarchy.
3. Do not hide important issues inside Medium or Low if they affect readability or emphasis.
4. Do not propose new features during review.
5. Do not redesign unrelated parts of the page.
6. Review visible success, not implementation effort.

## 6. Revision Rules After Review

After review:

- revise only High priority issues
- keep changes tightly scoped
- do not expand into Medium or Low unless explicitly requested
- preserve the task type and current phase
- preserve mock vs real honesty

If fixing a High priority issue would break the current task boundary or contradict a higher-priority source document, report it explicitly and stop rather than expanding scope.

## 7. Final Review Reminder

A UI task is not successful because the page contains the requested elements.

It is successful only if:

- the intended structure is clearly visible
- the intended hierarchy is clearly visible
- the page remains readable
- the page feels clean and controlled
- emphasis effects actually work
- motion is appropriate
- mock behavior is honestly reported
- the scope remains disciplined
