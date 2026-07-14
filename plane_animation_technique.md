# Jet Plane Animation Technique

This document provides a detailed technical breakdown of how the background Jet Plane animation is achieved in the `Gallery.tsx` component using **Next.js**, **Tailwind CSS**, and **GSAP ScrollTrigger**.

## 1. The Core Concept

The animation is a classic "parallax fly-by" effect. As the user scrolls *down* the page, the plane image translates *upward* at a faster rate than the page is scrolling. Because the plane's movement is directly tied to the scrollbar position (via GSAP's `scrub`), it creates a physical, interactive feel.

## 2. Layout Structure

The layout provides a container for the plane to live within, and ensures the image scales responsively.

```tsx
<section ref={sectionRef} className="relative w-full pt-[400px] md:pt-[480px] pb-8 select-none z-30">
  
  {/* Sticky Header */}
  <div ref={headerRef} className="sticky top-[72px] z-10 py-6 text-center">
    <h2>Selected Works</h2>
  </div>

  {/* Plane Container */}
  <div ref={planeRef} style={{ willChange: "transform" }} className="flex flex-col items-center">
    <Image src="/images/...jet.webp" priority />
  </div>

</section>
```

- **`sectionRef`**: This is the "trigger" area. The animation starts when this section enters the screen and finishes when it leaves.
- **`willChange: "transform"`**: This CSS property hints to the browser that this element will be heavily animated, pushing the rendering to the GPU for buttery-smooth 60fps performance (`force3D: true` in GSAP does the same).

## 3. The GSAP Timeline & ScrollTrigger

We use a GSAP Timeline bound to a ScrollTrigger to orchestrate the animation:

```javascript
const planeTl = gsap.timeline({
  scrollTrigger: {
    trigger: section,
    start: "top bottom", // Starts when the TOP of the section hits the BOTTOM of the screen
    end: "bottom top",   // Ends when the BOTTOM of the section hits the TOP of the screen
    scrub: 1,            // Ties progress to scrollbar, with a 1-second smooth catch-up delay
  },
});
```

- **`start: "top bottom"`**: The exact millisecond the very top edge of the gallery section peaks into the bottom of your browser window, the animation timeline begins at `0%`.
- **`end: "bottom top"`**: As the very bottom edge of the gallery section leaves the top of your browser window, the timeline completes at `100%`.
- **`scrub: 1`**: Instead of playing automatically, the animation is locked to your mouse wheel. The `1` means it has a 1-second smoothing effect, so if you scroll quickly and stop, the plane glides to a halt rather than stopping instantly.

## 4. The Movements

There are two separate animations happening inside this timeline concurrently:

### The Plane Flight
```javascript
// Start position (120% of viewport height down)
gsap.set(plane, { y: "120vh", x: 0, rotate: 0, scale: 1, force3D: true });

// The Animation
planeTl.fromTo(
  plane,
  { y: "120vh" },
  { y: "-130vh", ease: "none", duration: 1 },
  0 // Start at timeline 0
);
```
The plane starts completely off-screen below the viewport (`120vh`). Over the course of the section, it flies straight up to completely off-screen above the viewport (`-130vh`). Because `ease: "none"` is used, its speed remains perfectly constant relative to your scrolling speed.

### The Header Fade
```javascript
planeTl.fromTo(
  header,
  { opacity: 1 },
  { opacity: 0, ease: "power1.inOut", duration: 0.2 },
  0.35 // Start at 35% through the timeline
);
```
The "Selected Works" header is sticky, so it stays fixed on the screen as you scroll. However, to get it out of the way before the plane passes behind it, we animate its opacity to `0`. 
The critical part is the `0.35` at the end—this tells GSAP to wait until you have scrolled 35% of the way through the section before fading the text out, taking exactly 20% (`0.2`) of the scroll distance to disappear completely.
