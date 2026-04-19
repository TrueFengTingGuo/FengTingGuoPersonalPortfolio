# "Code & Canvas" — Modern Portfolio Redesign Specification

## Design Philosophy

The site is a **single-page narrative** — the user doesn't just browse, they *scroll through a story*. Each section transitions into the next like chapters in a book, using scroll-driven reveals, layered motion, and purposeful animation to keep the viewer engaged.

---

## Global Design Tokens

**Color palette:** A deep dark base (`#06070a`) paired with a warm gradient accent (coral `#ff6b4a` → magenta `#d946ef` → violet `#7c3aed`). Text in off-white (`#e8e4e0`), muted grey (`#8a8a8a`) for secondary copy. Sections alternate between dark and slightly lighter charcoal (`#111118`) to create visual rhythm.

**Typography:** *Space Grotesk* for headings (geometric, modern, techie), *Inter* for body text (clean legibility). Headings use `clamp()` fluid sizing so they scale from mobile to ultrawide without breakpoints.

**Layout:** A single column centered at `max-width: 1200px`, but hero and divider sections break out to full-bleed. Generous whitespace — `120px–160px` vertical padding between sections on desktop, `80px` on mobile.

**Cursor:** A custom soft-glow circle cursor (CSS `mix-blend-mode: difference`) that enlarges on interactive elements — a persistent **micro-interaction** that makes the entire page feel alive.

---

## Section 1: Hero — "The Arrival"

**Layout:** Full viewport height. Content vertically centered, left-aligned on desktop, centered on mobile.

**Scrollytelling:** The hero is the *opening frame*. Nothing moves until the user arrives; then everything staggers in.

**Motion Design:**
- On page load, the greeting line `Hello, my name is` fades in from `opacity: 0; translateY(20px)` over 600ms with an ease-out curve.
- 200ms later, the name **"Feng Ting Guo"** splits into individual `<span>` letters. Each letter staggers in from below (`translateY(40px)`) with a 30ms delay per character, creating a typewriter-wave effect. Letters have a subtle color gradient applied via `background-clip: text`.
- The subtitle **"Software Developer · Digital Artist"** slides in from the left with a mask-reveal (a `clip-path: inset(0 100% 0 0)` animating to `inset(0 0 0 0)` over 800ms).
- The CTA button ("View My Work ↓") fades in last. On hover, its border morphs into a filled gradient background with a scale bump (`scale(1.05)`) — a **micro-interaction**.

**Parallax Scrolling:** Behind the text sit 3–4 layers of floating **SVG geometric shapes** (circles, triangles, hexagons) drawn with thin strokes in the accent gradient colors. Each layer scrolls at a different rate (e.g., layer 1 at `0.2×`, layer 2 at `0.4×`, layer 3 at `0.6×` of scroll speed), creating depth. These shapes rotate slowly via CSS `@keyframes` (infinite, linear, ~60s per rotation).

**SVG Animation:** A large, semi-transparent SVG mesh/grid pattern covers the background. Its stroke-dasharray animates on load — lines "draw themselves in" over 2 seconds, giving the feel of a blueprint being sketched. The existing fluid canvas sits behind everything as the deepest layer, providing ambient movement.

**Scroll Indicator:** At the bottom center, a small animated SVG chevron pulses downward (translate + opacity loop). It fades out once the user scrolls past `100vh`.

---

## Section 2: About — "The Story"

**Layout:** Two-column on desktop (image left, text right). Single column stacked on mobile.

**Scrollytelling:** This section uses **scroll-triggered progressive reveal**. As the user scrolls into the section:
1. The section title `About Me` slides in from the left with a horizontal line that extends from `width: 0` to `width: 60px` beside it — acting as a decorative accent.
2. The profile image enters from the left (`translateX(-60px)`, `opacity: 0` → visible) and has a subtle parallax offset — it scrolls slightly slower than the text column, creating a layered feel.
3. Text blocks (name, quote, education, work experience) reveal **sequentially** as the user scrolls deeper. Each block fades in from below with a 100ms stagger.

**Motion Design:**
- The profile image has a soft animated gradient border (a pseudo-element rotating behind it with `conic-gradient` in accent colors, blurred).
- Work experience bullet points appear one by one as small timeline entries. A vertical SVG line draws itself downward connecting each entry — the line extends in sync with scroll position using `IntersectionObserver` thresholds.

**Micro-interactions:**
- Hovering the profile image applies a gentle `scale(1.03)` with a box-shadow bloom.
- Each work-experience bullet has a small dot indicator; on scroll-reveal, the dot plays a brief `scale(0 → 1.2 → 1)` pop animation.

**Parallax Scrolling:** The background of this section has a faint dot-grid pattern SVG that moves at `0.3×` scroll speed, adding subtle texture without distraction.

---

## Section 3: Skills — "The Toolbox"

**Layout:** Section title centered, skill items in a 2-column grid on desktop, single column on mobile. The illustration (the flower/girl painting) floats to the right as a decorative parallax element.

**Scrollytelling:** Skills are hidden (`width: 0`) until the section scrolls into the viewport (at `threshold: 0.2`). When triggered:
1. The section heading fades in with the same line-accent animation as the About section.
2. Skill boxes enter in a staggered grid — left column items come from the left, right column items come from the right, each with a 120ms stagger.
3. Skill bars animate from `width: 0` to their target percentage over 1.2 seconds with an `ease-out` curve. The percentage label counts up numerically (a counting **micro-interaction** using `requestAnimationFrame`).

**SVG Animation:** Behind the skill bars, faint SVG circuit-board-style paths are drawn. They animate their `stroke-dashoffset` as the section scrolls into view — thin lines connecting skill boxes as if wiring a system together.

**Micro-interactions:**
- Hovering a skill box lifts it slightly (`translateY(-4px)`) and increases its left border accent from `3px` to `5px` with a color shift to the gradient.
- The skill bar fill has a subtle shimmer — a pseudo-element with a diagonal `linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)` that slides across once after the fill animation completes.
- The illustration image has a slow `float` animation (up and down 8px over 4 seconds, infinite), and responds to scroll with a parallax `translateY` offset at `0.15×` rate.

---

## Section 4: Projects — "The Work"

**Layout:** Full-width section. Projects displayed in a responsive grid: 3 columns on desktop, 2 on tablet, 1 on mobile. Each project is a **card** with the screenshot/GIF as background.

**Scrollytelling:** Cards use `IntersectionObserver` with individual thresholds. They enter the viewport one by one from the bottom (`translateY(60px)` → `0`) with staggered delays. On a fast scroll, multiple cards appear nearly simultaneously but still stagger by ~80ms to maintain rhythm.

**Motion Design:**
- Each card has a **3D tilt** micro-interaction on hover: using `mousemove` position relative to the card, apply `rotateX()` and `rotateY()` transforms (max ±8°) and shift a radial highlight gradient overlay to follow the cursor. This gives a holographic/glass-card feel.
- The overlay (project title + GitHub button) is hidden by default (`opacity: 0`, `translateY(20px)`). On hover, it smoothly appears with a dark gradient backdrop. The title text staggers in letter-by-letter (faster than the hero — 15ms per character).
- The GitHub button uses the same gradient-fill hover animation as the hero CTA.

**SVG Animation:** A subtle SVG wave divider separates this section from the one above. The wave path morphs slowly between two shapes using CSS `@keyframes` animating the `d` attribute (or two overlapping paths cross-fading), giving a fluid, organic section boundary.

**Micro-interactions:**
- Cards that are partially in-view get a slight blur and scale-down (`scale(0.96)`, `filter: blur(1px)`), sharpening to `scale(1)` and `blur(0)` as they fully enter — a focus/defocus parallax effect.
- Clicking the GitHub button produces a brief ripple animation (expanding circle from click point) before navigating.

---

## Section 5: Paintings — "The Art"

**Layout:** Full-width immersive gallery. A large central painting display with smaller thumbnails below, or a horizontal scroll-snap carousel.

**Scrollytelling:** The section title and first painting slide in together. As the user scrolls further into the section, the gallery "unlocks" and becomes horizontally scrollable (or auto-advances).

**Motion Design:**
- The active painting has a **Ken Burns effect** — a very slow `scale(1 → 1.08)` and slight `translate` drift over 8 seconds, giving the static image a cinematic quality.
- Transitioning between paintings uses a crossfade with a slight horizontal parallax shift — the outgoing image shifts left while fading, the incoming shifts in from the right.
- Slide indicator dots have a **liquid morph** micro-interaction: the active dot stretches into a pill shape (`border-radius` + `width` transition), then shrinks back when another dot becomes active.

**Parallax Scrolling:** The painting section background uses a large blurred version of the current active painting as a dynamic backdrop, updating with each slide change. This background image scrolls at `0.5×` relative to the foreground carousel.

**SVG Animation:** Decorative SVG brush-stroke shapes frame the gallery — loose, hand-drawn-style bezier curves in muted accent tones that draw themselves in when the section enters the viewport.

**Micro-interactions:**
- Thumbnail hover: slight `scale(1.1)` with a bright border-glow in the accent color.
- Swiping/dragging the carousel has momentum physics — it decelerates naturally after release.
- The "Reference found from internet" caption fades in 500ms after the painting appears, as a gentle afterthought.

---

## Section 6: Contact / Footer — "The Invitation"

**Layout:** Centered, minimal. Section title, email address, and optional social icon links.

**Scrollytelling:** This final section triggers a closing sequence:
1. An SVG divider wave (mirroring the one above Projects) draws itself.
2. "Contact Me" fades in from below.
3. The email address types itself out character by character (typewriter effect, 40ms per character).

**Motion Design:**
- Social icons (if added) bounce in one by one with a spring-physics ease (`cubic-bezier(0.34, 1.56, 0.64, 1)`).

**Micro-interactions:**
- Hovering the email triggers a `color` shift to the gradient accent, with a subtle underline that slides in from the left.
- A "copy to clipboard" icon appears on hover; clicking it triggers a brief checkmark SVG animation (the checkmark path draws itself via `stroke-dashoffset`) and a tooltip that fades in/out: "Copied!"

**SVG Animation:** The background shows very faint, slowly orbiting SVG rings (like atomic orbits) — three ellipses at different angles, rotating at different speeds, stroke-only, barely visible, creating an ambient sense of motion even at the bottom of the page.

---

## Persistent Elements

### Navigation Bar
- Starts transparent over the hero. On scroll past `100vh`, it transitions to a frosted-glass style (`backdrop-filter: blur(12px)`, semi-transparent dark background) and sticks to the top.
- Nav links have an underline micro-interaction: a pseudo-element `::after` that `scaleX(0 → 1)` from center on hover, with the active link always showing its underline.
- Active section is tracked via `IntersectionObserver` — as the user scrolls through sections, the corresponding nav link highlights automatically.
- On mobile: a hamburger icon that morphs into an X using SVG path animation (the three lines rearrange into a cross).

### Cat Pet
Retained as-is — it's a charming signature element. It sits at the highest z-index and follows the user throughout. Consider adding one enhancement: when the cat is idle near a section boundary, it occasionally "bats" at nearby floating SVG shapes, pushing them slightly (a delightful easter-egg micro-interaction).

### Fluid Background Canvas
Retained as the deepest background layer across all sections. Its watercolor aesthetic ties beautifully into the "Code & Canvas" theme. Sections with dark backgrounds let it show through at reduced opacity; lighter sections overlay it with a semi-transparent panel.

### Scroll Progress Bar
A thin (3px) gradient bar fixed to the top of the viewport, its `scaleX` tied to `document.scrollTop / totalScrollHeight`. Uses the coral→violet gradient. A tiny glowing dot sits at the leading edge.

---

## Technical Implementation Notes

| Technique | Implementation |
|---|---|
| **Scrollytelling** | `IntersectionObserver` with multiple thresholds (`[0, 0.1, 0.2, ..., 1.0]`) on each section. Scroll-linked animations use `scroll` event + `requestAnimationFrame` with throttle for parallax values. CSS `animation-timeline: scroll()` where supported, with JS fallback. |
| **Motion Design** | CSS `@keyframes` for looping animations (float, rotate, pulse). CSS `transition` for state changes (hover, active). JS-driven spring physics for momentum-based interactions (carousel swipe, card tilt). Staggered reveals via CSS custom properties (`--delay: calc(var(--index) * 80ms)`). |
| **Micro-interactions** | CSS `:hover`, `:focus-visible`, `:active` pseudo-classes for instant feedback. `mousemove` event listeners for cursor-tracking effects (card tilt, custom cursor). `transitionend` events to chain multi-step animations. |
| **Parallax Scrolling** | Multiple layers with different `translateY` multipliers applied via JS on scroll. CSS `transform: translate3d()` for GPU-accelerated compositing. Background elements use `will-change: transform` to hint the browser. |
| **SVG/Vector Animation** | Inline SVGs for all decorative elements (no raster images for decoration). `stroke-dasharray` + `stroke-dashoffset` for draw-on effects. CSS `@keyframes` for path morphing (`d` property in modern browsers). SMIL or JS for complex path animations where CSS falls short. |

---

## Performance Guardrails

- All scroll-linked JS wrapped in `requestAnimationFrame` to prevent layout thrash.
- `IntersectionObserver` preferred over scroll-position calculations wherever possible.
- Parallax layers use `transform` exclusively (no `top`/`left` changes) to stay on the compositor thread.
- SVG animations use `will-change: transform, opacity` and are hidden (`visibility: hidden`) when off-screen.
- Images lazy-loaded with `loading="lazy"` and served in modern formats (WebP with JPEG fallback).
- The fluid WebGL background already runs at half resolution — keep this optimization.
- `prefers-reduced-motion` media query disables all parallax, stagger delays, and loops — showing static versions of everything instead.
