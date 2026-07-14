# Project Synopsis — Hardik Khyal Portfolio

## Overview

A **premium, cinematic personal portfolio** built for Hardik Khyal — a full-stack developer and designer. The site is designed to feel less like a traditional portfolio and more like an interactive experience, with scroll-driven storytelling, frame-by-frame canvas animations, and seamless visual transitions between sections.

---

## What It Is

A single-page portfolio website that showcases Hardik's skills, academic journey, and professional identity through immersive scroll-based animations and a luxury dark aesthetic.

---

## Key Sections

| Section | Description |
|---|---|
| **Hero** | A 90-frame canvas animation sequence plays as the user scrolls — mimicking a cinematic flythrough. Overlaid with animated typography. |
| **Journey** | An academic timeline rendered with a dynamic SVG path that draws itself on scroll (GSAP ScrollTrigger). Milestone cards animate in with blur-to-clear reveals. |
| **Welcome / Testimonials** | Client testimonials carousel with glassmorphism cards. |
| **Footer** | Interactive footer with contact links and branding. |

---

## What Makes It Special

- **Scroll-Driven Canvas Animation** — 90 JPEG frames are preloaded and painted to a `<canvas>` element in sync with scroll position via Framer Motion's `useTransform`. Gives the illusion of a video playing as you scroll.

- **Cinematic Hero → Journey Transition** — A CSS `mask-image` cross-dissolve blends the hero canvas last frame into the Journey background image seamlessly. No hard edge, no seam, pure CSS at 60 FPS.

- **Live SVG Path Drawing** — The academic timeline connector path is computed dynamically from DOM positions and animated stroke-by-stroke using GSAP ScrollTrigger.

- **Lenis Smooth Scroll** — Native scroll is replaced with Lenis for buttery inertia-based scrolling that keeps all GSAP and Framer Motion animations perfectly synced.

- **Performance-First** — All animation runs on the GPU compositor thread. No layout thrashing. Canvas frames are preloaded with a progress bar. `requestAnimationFrame` is used to lock canvas draws to monitor refresh rate (60fps+).

---

## Tech Stack (Summary)

```
Framework     →  Next.js 14  +  React 18  +  TypeScript 5
Animation     →  Framer Motion 12  +  GSAP 3  +  Lenis
Styling       →  Tailwind CSS 3  +  Vanilla CSS
Rendering     →  HTML5 Canvas API  +  CSS mask-image
Icons         →  Lucide React
Testing       →  Playwright
```

---

## Design Philosophy

> "Every pixel should feel intentional. Every scroll should feel earned."

The site uses a **luxury dark aesthetic** — near-black backgrounds (`#050505`), gold accents (`#D4AF37`), glassmorphism cards, and cinematic blur effects. Typography is bold and uppercase, drawing from editorial and fashion design conventions.

The goal is for visitors to *feel* the quality of work before reading a single word of content.

---

## Project Scale

| Metric | Value |
|---|---|
| Animation frames | 90 JPEG frames (canvas sequence) |
| Scroll height (Hero) | 400vh |
| Sections | 4 (Hero, Journey, Testimonials, Footer) |
| Lines of code (approx.) | ~1,500 TSX + CSS |
| External dependencies | 7 runtime packages |

---

*Built by Hardik Khyal — June 2026*
