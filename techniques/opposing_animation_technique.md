# Opposing Lateral Sections Animation Technique

This document provides a detailed technical breakdown of how we achieved the "Opposing Lateral Sections" animation in the `OpposingSections.tsx` component using **Next.js**, **Tailwind CSS**, and **GSAP (GreenSock)**.

## 1. The Core Concept

The visual illusion relies on pinning a full-screen container in place while simultaneously animating two internal columns in opposite vertical directions. 

Because the container has `overflow: hidden`, you only ever see exactly one "screen's worth" (1 viewport height) of the columns at any given time.

## 2. Layout Structure (Tailwind CSS)

The layout is built with three critical structural rules:

```tsx
<div id="verticalContainer" className="w-full h-screen overflow-hidden flex">
  
  <div className="w-1/2 h-[400vh]">
     {/* 4 Text Panels (100vh each) */}
  </div>

  <div className="w-1/2 h-[400vh]">
     {/* 4 Image Panels (100vh each) */}
  </div>

</div>
```

- **`h-screen overflow-hidden`**: The parent container exactly fills the browser window and hides anything outside of it.
- **`h-[400vh]`**: The columns are 4 times taller than the screen because they hold 4 panels (each being `100vh` tall).

## 3. GSAP Initialization (The Setup)

Before the animation even starts, we must manipulate the starting positions. 

By default, HTML flows from top to bottom. If we did nothing, both columns would start with their 1st panel visible. But we want them moving in opposite directions, meaning one column needs to start at the *beginning* (Panel 1), and the other needs to start at the *end* (Panel 4).

```javascript
// Example: Window is 1000px tall. Column is 4000px tall.
// y = 1000 - 4000 = -3000px
gsap.set(rightSection, {
  y: window.innerHeight - leftSection.clientHeight, 
});
```
This pushes the Right Column up by exactly 3 screen heights (`-300vh`), effectively making the **4th image** the one that is currently visible in the container.

## 4. ScrollTrigger pinning

We configure `ScrollTrigger` to hook into the user's scrollbar:

```javascript
scrollTrigger: {
  trigger: verticalContainer,
  start: "top top", // Starts when the container hits the top of the viewport
  end: "+=3000",    // The user must scroll 3000px down to finish the animation
  pin: true,        // Locks the container in place on the screen!
  scrub: true,      // Ties the animation progress to the scrollbar
  snap: snapPoints, // Forces the scrollbar to "rest" perfectly aligned on a panel
}
```

By setting `pin: true`, the webpage stops scrolling down normally. Instead, as the user scrolls, it scrubs through our GSAP timeline.

## 5. The Opposing Animation (The Timeline)

Finally, we define where the columns should travel:

```javascript
tl.to(leftSection, {
  y: window.innerHeight - leftSection.clientHeight, // Moves UP to -300vh
})
.to(rightSection, {
  y: 0, // Moves DOWN to 0vh
}, 0); // The "0" means start at the exact same time as the leftSection!
```

### What happens as you scroll:
- **Left Column:** Starts at `0` (Panel 1) and animates to `-300vh` (Panel 4). It is moving **UP**.
- **Right Column:** Starts at `-300vh` (Image 4) and animates to `0` (Image 1). It is moving **DOWN**.

Because they animate concurrently over the exact same distance (300vh) but targeting opposite coordinates, it creates a flawless opposing mirror effect.
