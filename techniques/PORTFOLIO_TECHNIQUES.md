# Advanced Engineering Techniques & Solutions in the Hardik Khyal Portfolio

This document provides a detailed breakdown of the high-end front-end engineering techniques, mathematics, layout structures, and bug fixes implemented throughout the codebase.

---

## 📖 Table of Contents
1. [High-Performance Canvas Scrollytelling (Sequence scrubbing)](#1-high-performance-canvas-scrollytelling-sequence-scrubbing)
2. [Isolating Entry Staggers from Active State Transforms (Double Stacking Context)](#2-isolating-entry-staggers-from-active-state-transforms-double-stacking-context)
3. [Typography Wrapping and Line-Break Optimization in Scroll Reveals](#3-typography-wrapping-and-line-break-optimization-in-scroll-reveals)
4. [Responsive Image Binding for GSAP Timelines via HTML5 `<picture>`](#4-responsive-image-binding-for-gsap-timelines-via-html5-picture)
5. [Real-time CSS Custom Property Theme Syncing](#5-real-time-css-custom-property-theme-syncing)
6. [Dynamic SVG Scroll-Drawn Lightpaths](#6-dynamic-svg-scroll-drawn-lightpaths)
7. [Nested pointer-events Override Layering](#7-nested-pointer-events-override-layering)

---

## 1. High-Performance Canvas Scrollytelling (Sequence scrubbing)
* **File Reference**: [HeroScroll.tsx](file:///d:/portfolio-backup-main/src/components/hero/HeroScroll.tsx)
* **Target Issue**: Traditional video scrubbing on scroll yields low framerates, video codec lag, and heavy layout layout recalculation. Rendering hundreds of separate Next.js `<Image>` tags causes massive DOM bloat and resource exhaustion.
* **Technique**:
  - We pre-render the sequence as separate JPEG frames (optimized for mobile in `/phonee` and desktop in `/sequence-1`).
  - A custom React preloader (`useImagePreloader.ts`) cache-loads all JPEG frames as `HTMLImageElement` objects into browser memory before removing the loading screen.
  - A single HTML5 `<canvas>` element handles the display. When the scroll triggers, GSAP’s ScrollTrigger scrubs a virtual `frameIndex` value from `0` to `totalFrames - 1`.
  - An `onUpdate` listener triggers a high-efficiency draw call drawing the cached image frame onto the canvas:
    ```javascript
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    ```
  - **Cover Math**: The image aspect ratio is matched to the dynamic canvas aspect ratio using crop-math (similar to CSS `object-fit: cover`), ensuring images are scaled and centered without distortion regardless of screen rotation.

---

## 2. Isolating Entry Staggers from Active State Transforms (Double Stacking Context)
* **File Reference**: [Web.tsx](file:///d:/portfolio-backup-main/src/components/Web.tsx#L141-L165)
* **Target Issue**: The Projects section folders must slide up on scroll in a staggered entry, but must also expand to cover the viewport when clicked. In CSS, mixing scroll entry offsets (`translateY`) with local click-state expansions on the same DOM element causes them to override each other, producing layout breaks and card "blinking/flickering" due to GPU compositor re-layering.
* **Technique**:
  - **Separation of Concerns**: We wrap the folder in two nested elements:
    - **Outer Wrapper (`motion.div`)**: Responsible exclusively for scroll detection, stagger delay, and initial spring-based slide-in (`y: 320` -> `y: 0` and `opacity: 0` -> `opacity: 1`).
    - **Inner Container (`div`)**: Responsible exclusively for interactive click-state translates (`translateY` to expand) and hover offsets.
  - **GPU Stacking Isolation**: The CSS `zIndex` property is passed to both the parent `<motion.div>` and the child. Because GPU accelerated elements create their own stacking contexts during transitions, placing `zIndex` directly on the parent wrapper ensures that the browser's GPU compositor maintains correct layer positioning (Front card = 3, Middle card = 2, Back card = 1) at all times, completely eliminating folder blinking when animations finish.

---

## 3. Typography Wrapping and Line-Break Optimization in Scroll Reveals
* **File Reference**: [aboutsection.tsx](file:///d:/portfolio-backup-main/src/components/aboutsection.tsx#L152-L170)
* **Target Issue**: Splitting text into single character spans (`span` with `display: inline-block`) for scroll-based fade-in reveals causes words to break awkwardly at the end of text lines. This happens because the browser cannot recognize spaces inside custom spans, causing words like "experience" to split into "expe-" and "rience" across lines.
* **Technique**:
  - We split the text by space boundaries into **words** first:
    `const words = paragraphText.split(" ");`
  - Each word is rendered in a dedicated `inline-block whitespace-nowrap` container `span`. This forces the browser to treat the entire word as a single typography block.
  - Inside each word wrapper, we map over the characters and render the animated character spans.
  - Standard text space characters (`" "`) are placed *outside* the word wrappers.
  - A global character index is tracked during mapping to pass the absolute position to the scroll reveal calculation.
  - **Result**: The browser wraps text cleanly on word boundaries, while preserving character-by-character animations.

---

## 4. Responsive Image Binding for GSAP Timelines via HTML5 `<picture>`
* **File Reference**: [myslide.tsx](file:///d:/portfolio-backup-main/src/components/myslide.tsx#L100-L105)
* **Target Issue**: GSAP timelines targeting elements by static classes or indices break if different elements are rendered for desktop and mobile (e.g. conditional rendering `{isMobile ? <MobileImg /> : <DesktopImg />}`).
* **Technique**:
  - We use standard HTML5 `<picture>` wrappers:
    ```html
    <picture>
      <source media="(max-width: 767px)" srcset="/about/mobile.jpg" />
      <source media="(min-width: 768px)" srcset="/about/img1.jpg" />
      <img src="/about/img1.jpg" alt="Parallax slide" />
    </picture>
    ```
  - This provides a single DOM selector (`picture img` or `.creative-hero img`) for GSAP animation timelines, while allowing the browser to swap source files at the GPU level based on media-query dimensions without changing the DOM structure.

---

## 5. Real-time CSS Custom Property Theme Syncing
* **File Reference**: [DesignStudioListener.tsx](file:///d:/portfolio-backup-main/src/components/layout/DesignStudioListener.tsx)
* **Target Issue**: Custom styling values modified in the external Design Studio customizer app must propagate in real-time to the main portfolio without requiring code compiles or page refreshes.
* **Technique**:
  - The Design Studio communicates styles via JSON configurations. We set up an event listener tracking layout updates.
  - When styles are modified, the JSON key-value pairs are translated to root CSS Custom Properties:
    ```javascript
    document.documentElement.style.setProperty(`--${key}`, value);
    ```
  - Components throughout the portfolio utilize tailwind utility classes bound to custom properties (e.g. `bg-[var(--projects-bg)]` or `text-[var(--luxury-gold)]`). This triggers instant, repaint-free visual updates across the screen.

---

## 6. Dynamic SVG Scroll-Drawn Lightpaths
* **File Reference**: [Journey.tsx](file:///d:/portfolio-backup-main/src/components/Journey.tsx)
* **Target Issue**: Drawing a connecting visual path down a long scrolling timeline that lights up and traces itself as the user travels down the page.
* **Technique**:
  - An SVG `<path>` is defined in the background, tracing the coordinates between the timeline cards.
  - We measure the total length of the SVG path using:
    `const pathLength = path.getTotalLength();`
  - We configure CSS properties `strokeDasharray = pathLength` and `strokeDashoffset = pathLength` to hide the path initially.
  - GSAP ScrollTrigger links scroll progress directly to the path's `strokeDashoffset`, animating it towards `0` as the user scrolls. This creates the illusion of a light-beam drawing itself.

---

## 7. Nested pointer-events Override Layering
* **File Reference**: [Overlay.tsx](file:///d:/portfolio-backup-main/src/components/hero/Overlay.tsx) and [footer.tsx](file:///d:/portfolio-backup-main/src/components/footer.tsx)
* **Target Issue**: HUD overlay layouts (like the Hero overlays, floating background marquees, or absolute footer elements) must overlay the screen but cannot block clicks on underlying features.
* **Technique**:
  - The parent containers are styled with `pointer-events-none`, allowing all cursor actions, scrolls, and drag gestures to pass right through to elements underneath.
  - Any interactive element inside (such as the mobile **Contact Me** button, nav links, or WhatsApp selector modal cards) is explicitly styled with `pointer-events-auto`. This restores full mouse \hover, active clicks, and touch gestures to the buttons without blocking the rest of the viewport.
