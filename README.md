# Hardik Khyal — Immersive Creative Portfolio

A state-of-the-art interactive scrollytelling portfolio built for **Hardik Khyal**, demonstrating high-performance web engineering, fluid physics-based motion design, customizer integration, and responsive layouts.

---

## 🚀 Key Features

### 1. Interactive Canvas Scrollytelling (Hero)
- High-framerate frame preloading and rendering of responsive image sequences mapped directly to scroll depth.
- Cinematic, scroll-driven typography overlays that zoom, fade, and translate seamlessly without overlapping content.

### 2. About Me Text & Parallax Slides
- **Character Reveal Scroll Animation**: A scroll-triggered, letter-by-letter fade reveal. Words are grouped in `inline-block whitespace-nowrap` containers to guarantee clean line wrapping without splitting words in half.
- **Parallax Slide Deck**: Interactive slide sections utilizing HTML5 `<picture>` tags to serve device-specific assets dynamically (swaps automatically between `/about/img*.jpg` for desktop and `/about/mobile*.jpg` for mobile).

### 3. Interactive Skills Evidence Board
- A custom polaroid-style board overlaying a full-viewport paper texture layout.
- Polaroid cards rotate, scale, and dynamic-shift z-index on mouse hover.

### 4. Graphic Design Showcase
- A kinetic slideshow showcasing design items. Features grid transitions, custom mouse hover alignments, and fluid GSAP timelines.

### 5. Web Projects Folder Stack
- **Staggered Spring Entry**: Staggered scroll-reveal animation that slides folder cards up into place one by one using organic spring physics.
- **Click-to-Expand Folders**: A highly polished, state-driven folder tab system. Clicking a folder expands it into a full-height detail view.
- **Real Project Integrations**: Loaded with real portfolio works:
  - **AI Background Remover** (MediaPipe, WebAssembly, Privacy-first background extractor)
  - **HR Payroll System** (React, NestJS, Prisma, automated payroll client)
  - **DevOpsHub Platform** (Docker container manager, Nginx automated proxy)

### 6. Journey Timeline
- A center-aligned academic and career milestones timeline.
- Features an SVG lightpath connector that dynamically draws and illuminates itself as the user scrolls down the page.

### 7. Portfolio Design Studio (Integrated Customizer)
- Live color customized panel supporting real-time theme shifts (includes preset palettes like **Midnight Charcoal**, **Forest Moss**, **Vintage Paper**, and **Burgundy Velvet**).
- **60/30/10 Color Palette Generator**: Features random generator controls, color-locking mechanics, contrast checks, and instant dark-mode mapping.

### 8. Interactive WhatsApp Service Modal
- Sleek, glassmorphic contact modal accessible via mobile and footer "Message Me" buttons.
- Features line-art icons (Logo Design, Poster & Graphic Art, Web Development, Animated Website).
- Instantly opens WhatsApp with customized, URL-encoded pre-filled project draft messages.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (React 18, App Router)
- **Styling**: Tailwind CSS & CSS Custom Properties (`var(--...)` for dynamic customizer styling)
- **Animations**:
  - **GSAP & ScrollTrigger** (for complex canvas scrubbing and sliding timelines)
  - **Framer Motion** (for spring-based micro-interactions, scroll-reveals, and state-driven list animations)
- **Icons**: Lucide React
- **Scroll Handling**: React Lenis (Smooth Scroll)

---

## 📂 Directory Structure

```text
├── design-studio/           # Embedded portfolio theme Customizer sub-app
├── public/                  # Static assets & graphics
│   ├── about/               # Image slides (with desktop & mobile versions)
│   ├── phonee/              # Responsive canvas JPEG frames for mobile devices
│   └── sequence-1/          # High-resolution canvas JPEG frames for desktops
├── src/
│   ├── app/                 # Next.js pages, layouts, and global styles
│   ├── components/          # Core layout and feature components
│   │   ├── hero/            # HeroScroll canvas renderer and typography overlays
│   │   ├── layout/          # Navigation (Navbar.tsx) and grid layouts
│   │   ├── ui/              # Reusable UI elements (Stamp.tsx, FloatingStars.tsx)
│   │   ├── aboutsection.tsx # Scroll-reveal text content component
│   │   ├── myslide.tsx      # Parallax creator image slides
│   │   ├── Skills.tsx       # Polaroid evidence board
│   │   ├── graphic.tsx      # Graphic design kinetic showcase
│   │   ├── Web.tsx          # Web projects folder stack
│   │   ├── Journey.tsx      # SVG path timeline component
│   │   ├── cta.tsx          # Animated Concentric circular footer CTA
│   │   └── footer.tsx       # Footer containing the WhatsApp service modal
│   └── hooks/               # Custom preloading & resize hooks
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
