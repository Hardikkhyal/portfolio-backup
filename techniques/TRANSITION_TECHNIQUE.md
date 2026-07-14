# Cinematic Seamless Transition — Hero → Journey

A deep-dive into how the seamless background cross-dissolve between the **Hero canvas animation** and the **Journey section background** was achieved using pure CSS and zero JavaScript overhead.

---

## The Problem

The Hero section uses a `<canvas>` element playing a frame-by-frame animation sequence (90 frames). The Journey section has its own background image (`fetures.jpg`). When the user scrolls from one to the other, a **hard horizontal seam** appears — the canvas ends and the new background starts abruptly.

### Why it happens


Document layout (heights):
┌─────────────────────────────┐
│  Hero container  [0 → 400vh]│   Canvas: sticky top:0, h-screen
│  sticky canvas fills screen │   z-index: 10
└─────────────────────────────┘
         ↕ mt-[-100vh] overlap
┌─────────────────────────────┐
│  Journey section [300vh →]  │   z-index: 20
│  transparent zone [100vh]   │   Shows hero canvas below
│  fetures.jpg content starts │ ← HARD SEAM HERE at doc pos ~400vh
└─────────────────────────────┘

The canvas (after unsticking at scroll ~300vh) sits at document position `300vh–400vh`.
The Journey content div starts at document position `400vh`.
Both meet at exactly the same pixel row → **visible horizontal line**.

---

## The Solution — Single-Background Blend Wrapper

### Core Concept

Instead of having two separate background sources that meet at a hard edge, we declare `fetures.jpg` **once** on a wrapper div that spans **both** the transparent cross-fade zone and the content body.

A **5-stop eased `mask-image`** on this wrapper fades the image from fully transparent at the top to fully opaque at exactly `100vh` — the width of the overlap zone.

```
Scroll position in cross-fade zone:
  0vh   into Journey → fetures.jpg: 0% visible  → hero canvas: 100% shows through
  20vh  into Journey → fetures.jpg: 15% visible → cross-dissolve begins
  50vh  into Journey → fetures.jpg: 55% visible → midpoint blend
  80vh  into Journey → fetures.jpg: 88% visible → nearly full fetures.jpg
  100vh into Journey → fetures.jpg: 100% visible → content begins, zero seam
```

---

## Implementation

### 1. Journey Section — Blend Wrapper

**File:** `src/components/Journey.tsx`

```jsx
{/* 
  BLEND WRAPPER
  fetures.jpg declared ONCE here — spans both zones as one continuous background.
  mask-image fades it from invisible → opaque over exactly 100vh.
*/}
<div
  style={{
    backgroundImage: "url('/images/fetures.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center top",
    backgroundRepeat: "no-repeat",

    /* 5-stop eased gradient mask — mimics an ease-in-out curve */
    maskImage: `linear-gradient(to bottom,
      transparent          0vh,    /* 0%  — fully transparent */
      rgba(0,0,0,0.15)    20vh,   /* 20% — barely bleeds in */
      rgba(0,0,0,0.55)    50vh,   /* 50% — midpoint dissolve */
      rgba(0,0,0,0.88)    80vh,   /* 80% — nearly opaque    */
      black               100vh   /* 100% — fully opaque    */
    )`,
    WebkitMaskImage: `linear-gradient(...)`, /* Safari/Chrome prefix */
  }}
>
  {/* Cross-fade zone: hero canvas (z-10) shows through transparent mask */}
  <div className="h-[100vh] pointer-events-none" />

  {/* Content: fetures.jpg fully opaque here — same background, no restart */}
  <div ref={contentRef} className="py-20 pb-36 ...">
    {/* All Journey content */}
  </div>
</div>
```

**Why this works:**
- `fetures.jpg` is one background on one element → no image restart, no seam
- `mask-image` transparency at the top allows the z-10 hero canvas to show through (Journey is z-20, but transparent pixels reveal what's below in the stacking context)
- By `100vh` into the wrapper, the mask is fully opaque → clean content area
- `backgroundPosition: center top` anchors the image to the Journey section's top edge, ensuring continuity as it scrolls

---

### 2. Hero Section — Bottom Vignette

**File:** `src/components/hero/HeroScroll.tsx`

```jsx
{/* Bottom cross-fade vignette — dissolves hero last frame into fetures.jpg blend zone */}
<div
  className="absolute bottom-0 left-0 w-full h-[200px] pointer-events-none z-15"
  style={{
    background: "linear-gradient(to bottom,
      transparent         0%,
      rgba(0,0,0,0.35)   60%,
      rgba(0,0,0,0.6)    100%
    )"
  }}
/>
```

This fades the bottom 200px of the hero canvas to ~60% dark, pre-softening the last animation frame so the fetures.jpg cross-dissolve appears even smoother.

---

### 3. Canvas Blur Edge Fix

**File:** `src/components/hero/HeroScroll.css`

```css
.hero-canvas {
  filter: blur(3px);

  /* 
    filter: blur() extends pixels OUTSIDE the element's own boundary.
    overflow-hidden on the parent clips that extension → dark border on all 4 edges.
    
    Fix: push canvas 6px outside the container (2× the blur radius).
    The clipped blur edges land outside the visible viewport.
  */
  top: -6px !important;
  left: -6px !important;
  width: calc(100% + 12px) !important;
  height: calc(100% + 12px) !important;
}
```

> **Rule:** Always extend a blurred element by at least `2 × blur-radius` on each side
> when it sits inside an `overflow: hidden` container.

---

## Layer Stack (during cross-fade scroll zone)

```
z-index  Element                         Behavior
───────  ──────────────────────────────  ─────────────────────────────────────
  20     Journey blend wrapper           fetures.jpg fading in via mask-image
  15     Hero bottom vignette            dark gradient softening canvas bottom
  10     Hero canvas (unsticked)         last animation frame, frozen at frame 90
   0     <main> bg-luxury-bg (#050505)   base dark background
```

The `mask-image` transparency at the top of the blend wrapper (z-20) lets the hero canvas (z-10) show through. As the mask fades from transparent → opaque, the canvas is smoothly replaced by `fetures.jpg`.

---

## Why Not Other Approaches

| Approach | Problem |
|---|---|
| Two separate background divs | Background restarts at the second div's top edge → always a seam |
| `background-attachment: fixed` | Creates a fixed/parallax effect — image doesn't scroll naturally |
| `opacity` on Journey div | Fades ALL content including text/cards, not just the background |
| Tall static image (2800px) | Requires a pre-composited image; any scroll misalignment breaks it |
| Canvas fade-out animation | Adds JS complexity; timing can desync with scroll |
| `clip-path` blending | Hard edges at clip boundaries; no smooth dissolve |

---

## Key Properties Used

| Property | Purpose |
|---|---|
| `mask-image` | Non-destructive alpha mask — fades background without affecting content |
| `-webkit-mask-image` | Safari / Chrome compatibility prefix |
| `backgroundPosition: center top` | Anchors background to element top — prevents image jump on scroll |
| `backgroundSize: cover` | Scales image to fill element, crop excess |
| `z-index` layering | Controls what shows through the transparent mask areas |
| `filter: blur(3px)` | Softens canvas animation frames for cinematic look |
| `overflow: hidden` + canvas overhang | Prevents blur edge artifacts on canvas boundary |

---

## Files Modified

| File | Change |
|---|---|
| [`src/components/Journey.tsx`](src/components/Journey.tsx) | Blend wrapper with `mask-image`, transparent zone, single background |
| [`src/components/hero/HeroScroll.tsx`](src/components/hero/HeroScroll.tsx) | Bottom vignette overlay for canvas dissolve |
| [`src/components/hero/HeroScroll.css`](src/components/hero/HeroScroll.css) | Canvas overhang fix for blur edge artifact |

---

## Performance

- **0 JavaScript** involved in the transition — pure CSS
- **0 additional network requests** — reuses already-loaded `fetures.jpg`
- **GPU-composited** — `mask-image` and `background` are handled by the compositor thread
- **60 FPS safe** — no layout thrashing, no JS scroll listeners added

---

*Technique developed for Hardik Khyal's portfolio — June 2026*
