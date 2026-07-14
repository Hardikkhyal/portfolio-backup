# Immersive Creative Portfolio

A state-of-the-art interactive scrollytelling portfolio built for Hardik Khyal, demonstrating high-performance web engineering, fluid canvas-based motion design, and responsive layouts.

## 🚀 Key Features

- **Interactive Canvas Scrollytelling:** A high-framerate sequence loading mechanism that renders responsive canvas-based image streams bound directly to scroll depth.
- **Cinematic Hero Overlay:** Highly polished scroll-linked typography and stat reveals using Framer Motion (for desktop) and a custom GSAP ScrollTrigger timeline (for mobile).
- **Dynamic Timeline (My Journey):** A center-aligned academic timeline featuring milestone cards and an SVG path connecting nodes that dynamically lights up, pulses, and draws itself as the user scrolls.
- **Responsive About Me Layout:** A two-column digital space segment showcasing a clean layout, emphasis quotes in custom gold accents, and a stack of bespoke feature cards with solid gold left-border details.
- **Smooth Scroll Integration:** Seamless viewport transitions managed by React Lenis.

---

## 🛠️ Technology Stack

This project is built using a modern front-end stack designed for performance, fluid motion, and pixel-perfect aesthetics:

|c

---

## 📂 Directory Structure

```text
├── public/                  # Static assets
│   ├── images/              # Custom brand image assets (journey background, etc.)
│   ├── phonee/              # Responsive canvas JPEG frames for mobile devices
│   └── sequence-1/          # High-resolution canvas JPEG frames for desktops
├── src/
│   ├── app/                 # Next.js App router pages, layouts, and global styles
│   ├── components/          # Core interactive components
│   │   ├── hero/            # HeroScroll canvas renderer and typography overlays
│   │   ├── layout/          # Navigation and scroll container layouts
│   │   ├── ui/              # Reusable UI component elements (Buttons, etc.)
│   │   └── Journey.tsx      # SVG-revealed Academic Timeline component
│   │   └── Welcome.tsx      # About Me grid and client testimonials
│   ├── hooks/               # Custom React hooks (preloading, resizing listeners)
│   └── lib/                 # Tailwind design style utilities
```

---

## 💻 Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed (version 18+ recommended).

### Installation

1. Install project dependencies:
   ```bash
   npm install
   ```

2. Start the development server locally:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser to view the portfolio.

### Build and Production

To optimize and build the project for production:
```bash
npm run build
```
To run the production build locally:
```bash
npm run start
```
