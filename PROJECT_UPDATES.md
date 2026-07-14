# Portfolio Project Updates & Refactoring Summary

This document summarizes the changes, layout corrections, and animation additions recently made to the Next.js portfolio project.

---

## 1. Continuous Shared Background Image
* **Objective:** Create a seamless, uninterrupted background transition from the **Selected Works** section down to the **Get in Touch** (Contact) section using the custom background asset:
  `/images/b8149f5d-5b0b-4940-80aa-c81d036bfe42.png`
* **Implementation:**
  - Enclosed the `Gallery` (Selected Works), `Welcome` (Client Love), and `Contact` (Get in Touch) components in a single shared parent `div` in `src/app/page.tsx`.
  - Set the background image on this wrapper with `backgroundPosition: "center 80px"`, `bg-cover`, and `bg-no-repeat` to align the design nicely and make it scroll naturally.
  - Removed separate backgrounds and solid color classes (`bg-luxury-bg`) from `Welcome.tsx` and `Contact.tsx` so the unified parent background image shines through.

---

## 2. Journey Stacking Context & Transition Alignment
* **Objective:** Prevent the last timeline card (B.Tech CSE) from being hidden or faded by the Selected Works transition overlay, and ensure a smooth cross-fade.
* **Implementation:**
  - Raised the stacking context of the Journey section container in `Journey.tsx` to `z-40` (from `z-20`).
  - Added a `100px` bottom fade-out `mask-image` linear-gradient directly on the background wrapper in `Journey.tsx`.
  - Removed the double-masks from the Selected Works wrapper in `page.tsx` so that Journey's background smoothly fades to transparent at its bottom edge, revealing the fully opaque Selected Works wrapper background underneath.
  - Since Journey is at `z-40` (on top of Selected Works at `z-30`), all cards and timeline text remain 100% visible and hoverable.

---

## 3. Selected Works Layout Refinement
* **Objective:** Remove the bento grid cards and filtering buttons from the Gallery section while keeping the layout and section structure as it is.
* **Implementation:**
  - Simplified `Gallery.tsx` by clearing out the Bento card rendering code, categories filter buttons, and all unused states and imports.
  - Retained the outer wrapper container, floating stars background, ambient radial gold gradient, and the main section header ("Selected Works").
  - Adjusted the top padding to `pt-[220px]` and bottom padding to `pb-8` to shrink the empty space left behind by the removed cards.

---

## 4. Scroll-Triggered Animated Jet Plane
* **Objective:** Introduce a premium motion detail where a jet plane flies upward across the Selected Works section on scroll.
* **Implementation:**
  - Added a responsive jet plane image `/images/69834ca922d650666343a7a4_img_jet.webp` inside `Gallery.tsx` under a `will-change-transform` absolute layer.
  - Configured a GSAP `ScrollTrigger` animation synced directly to the user's scroll speed (`scrub: 1` lag follow).
  - The plane starts at the bottom-left (`x: "15vw"`, `y: "650px"`) pointing upwards at `-35` degrees, and flies diagonally upward to the top-right (`x: "75vw"`, `y: "-350px"`) as the page scrolls.

