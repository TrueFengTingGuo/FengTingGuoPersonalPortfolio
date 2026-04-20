# "Code & Canvas" — Portfolio Redesign Spec

## Philosophy

Single-page scroll narrative charting an ethereal vertical journey. As the user scrolls down, they travel from outer space, descend into a sunset sky, pass through a dimensional door to a mirrored sea, and finally gaze back up at the dawn sky. Each section reveals on scroll with layered motion and animation, bridging digital art and solid engineering.

---

## Tech Stack

- **React 18+ / TypeScript** — each section is a self-contained component
- **Vite** — build tool
- **Tailwind CSS** — utility-first styling with custom theme tokens; scoped CSS modules for complex animations
- **framer-motion** — scroll-triggered animations, background crossfades, staggered reveals, spring physics
- **@react-three/fiber + drei** — powers a small interactive fluid WebGL effect used exclusively at the bottom of the Sea section to map the transition to Hand Upon Sky (the fluid effect is not used everywhere)
- **lenis** — smooth scroll with momentum

---

## Design Tokens

**Colors:** Dynamic and responsive to the background layer.
- *Outer Space*: Deep navy `#0a0b10`, stark white text `#ffffff`, sunset accent `#ff7b54`.
- *Sky*: Warm sunset hues `#ff9a76` → `#da9aed`, dark contrasting text `#1e1e24`.
- *Sea*: Ethereal blues `#a8d8ea`, bright white text `#ffffff`.
- *Hand Upon Sky*: Soft morning blue `#83a1d4`, serene `#fdf6f0`.

**Typography:** *Space Grotesk* headings, *Inter* body. Fluid `clamp()` sizing.

**Layout:** Centered `max-width: 1200px`, hero/dividers full-bleed. Padding: `120–160px` desktop, `80px` mobile.

---

## Section 1: Hero (Outer Space)

Full viewport, left-aligned desktop / centered mobile.

**Entrance sequence (on load):**
1. `Hello, my name is` — fade in from `translateY(20px)`, 600ms ease-out
2. **"Feng Ting Guo"** — split into `<span>` letters, stagger from `translateY(40px)` at 30ms/char, gradient via `background-clip: text` (sunset orange to stark white)
3. **"Software Developer · Digital Artist"** — `clip-path` mask-reveal from left, 800ms
4. CTA "View My Work ↓" — fade in last. Hover: border → sunset gradient fill + `scale(1.05)`

**Background layers:**
- Image: `astronaut sitting upside down` (deep outer space).
- Slower parallax to simulate zero-gravity weightlessness.
- Minimal floating SVG shapes (stars/dust) that drift extremely slowly.

**Scroll indicator:** Pulsing SVG chevron at bottom, fades out past `100vh`.

---

## Section 2: About & Skills (Sky)

Two-column desktop (image left, text and skills right), stacked mobile.

**Scroll reveal:**
1. Background crossfades to `Sky.jpg` capturing the transition from space to sunset clouds.
2. Title slides in from left with expanding horizontal line accent.
3. Profile image enters from `translateX(-60px)` with slight parallax offset.
4. About text fades in sequentially, followed by the Skills grid cascading in.

**Details:**
- Background: `Sky.jpg` (floating person transitioning through the clouds) with slight upward parallax (0.15×) to simulate the feeling of falling/descending.
- Merged layout: The "About" text and "Skills" progress bars/boxes share the right column (or stack vertically).
- Skill bars animate `width: 0→target%` over 1.2s ease-out upon scroll trigger.

---

## Section 3: Projects (Sea & Dimensional Door)

Full-width. Grid: 3 col desktop, 2 tablet, 1 mobile. Cards use screenshot/GIF backgrounds.

**Scroll reveal:** 
- Background transitions to `Sea.jpg` via a crossfade or CSS dimensional door effect. (Placeholder for now: `Sea.jpg` will act as a static backdrop before).
- Cards enter from `translateY(60px)` with ~80ms stagger.

**Card hover (3D tilt):**
- `mousemove` → `rotateX/Y` (max ±8°) + radial highlight follows cursor
- Overlay (title + GitHub link) appears from `translateY(20px)`. Title staggers letter-by-letter at 15ms/char

**Details:**
- Partially-visible cards: `scale(0.96)` + `blur(1px)`, sharpening on full entry.
- The bottom of the Sea section features a small interactive fluid WebGL effect representing the water's surface. Important: you don't have to use this fluid effect everywhere; it is used only here as a small interaction to simulate the transition from Sea to the Hand Upon Sky section.

---

## Section 4: Paintings (Hand upon Sky)

Full-width gallery. Large central display + thumbnails or horizontal scroll-snap carousel.

**Scroll reveal:** 
- Background transitions from the fluid bottom of the Sea section to `handUponSky` (reaching toward the dawn sky with roses). This WebGL fluid/water displacement effect links these two scenes, acting merely as a localized small interactive transition simulating "breaking the surface" rather than a global continuous effect.
- Title and first painting slide in. Gallery unlocks for horizontal scroll on deeper scroll.

**Motion:**
- Active painting: Ken Burns — slow `scale(1→1.08)` + drift over 8s
- Transitions: crossfade with horizontal parallax shift
- Indicator dots: active dot morphs into pill shape

**Details:**
- Theme: Represents reaching back up to the surface/sky after the descent.
- Thumbnail hover: `scale(1.1)` + accent border-glow
- Carousel: momentum physics on swipe
- Caption fades in 500ms after painting appears

---

## Section 5: Contact / Footer

Centered, minimal overlay.

**Sequence:**
1. "Contact Me" fades in from below
2. Email types out at 40ms/char

**Details:**
- Social icons bounce in with spring ease (`cubic-bezier(0.34, 1.56, 0.64, 1)`)
- Email hover: gradient color + underline slides from left
- Takes place fully within the bright base of the `handUponSky` dawn background.

---

## Persistent Elements

**Nav bar:** Transparent over hero → frosted-glass (`backdrop-filter: blur(12px)`) sticky after `100vh`. Links: `::after` underline `scaleX(0→1)` on hover. Active section tracked via `IntersectionObserver`. Mobile: hamburger→X SVG morph. Dynamic text color adapting to the brightness of the current background layer.

**Cat pet:** Retained at highest z-index. Easter egg: idle cat occasionally bats nearby floating UI elements.

**Ethereal Background Framework:** The core journey engine. Backgrounds transition via scroll-triggered crossfades. Note: the WebGL fluid shader is not used everywhere; it is added strictly as a small interactive transition linking the Sea bottom to the Hand Upon Sky section. 

**Scroll progress bar:** 3px gradient bar at viewport top, `scaleX` = scroll progress. Glowing dot at leading edge.

---

## Implementation

| Technique | Approach |
|---|---|
| Scroll triggers | `IntersectionObserver` with thresholds `[0, 0.1, ..., 1.0]`. CSS `animation-timeline: scroll()` with JS fallback. |
| Looping motion | CSS `@keyframes`. State changes via CSS `transition`. Spring physics via JS (carousel, card tilt). Stagger via `--delay: calc(var(--index) * 80ms)`. |
| Hover/focus | CSS `:hover`/`:focus-visible`/`:active`. `mousemove` for cursor-tracking. `transitionend` to chain animations. |
| Parallax | JS `translateY` multipliers on scroll via `rAF`. GPU-composited `translate3d()`. `will-change: transform`. |
| SVG animation | Inline SVGs only. `stroke-dasharray`/`dashoffset` for draw-on. CSS `@keyframes` path morph. JS/SMIL fallback. |

## Performance

- Scroll JS in `requestAnimationFrame`; prefer `IntersectionObserver`
- Parallax via `transform` only (compositor thread)
- SVGs: `will-change: transform, opacity`; `visibility: hidden` when off-screen
- Images: `loading="lazy"`, WebP with JPEG fallback
- WebGL canvas at half resolution
- `prefers-reduced-motion`: disable all parallax, staggers, loops
