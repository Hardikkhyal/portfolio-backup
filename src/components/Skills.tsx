"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import { Code2, Server, Sparkles, Cpu, Database, Layout, Workflow, Layers } from "lucide-react";
import { motion } from "framer-motion";
import Stamp from "./ui/Stamp";
import GridOverlay from "@/components/layout/GridOverlay";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Skills() {
  const containerRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const pin1Ref = useRef<HTMLDivElement>(null);
  const pin2Ref = useRef<HTMLDivElement>(null);
  const pin3Ref = useRef<HTMLDivElement>(null);
  const pin4Ref = useRef<HTMLDivElement>(null);
  const yarnRefs = useRef<(SVGPathElement | null)[]>([]);

  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [pinPositions, setPinPositions] = useState<{ x: number; y: number }[]>([]);
  const [activeHovers, setActiveHovers] = useState<number>(0);
  const [isStringUpdating, setIsStringUpdating] = useState(false);

  // Monitor hover state to determine if strings need to update positions
  useEffect(() => {
    if (activeHovers > 0) {
      setIsStringUpdating(true);
    } else {
      const timer = setTimeout(() => {
        setIsStringUpdating(false);
      }, 600); // Wait 600ms for exit animations to finish settling
      return () => clearTimeout(timer);
    }
  }, [activeHovers]);

  const coreSkills = [
    {
      id: "01",
      icon: Sparkles,
      title: "UI/UX Design",
      description: "Creating high-fidelity wireframes, interface mockups, user flows, and interactive prototypes that unify aesthetic elegance with clear usability.",
      tags: ["Figma", "Visual Design", "Prototyping", "Wireframing", "User Research"],
      photo: "/graphic-design/img3.jpg"
    },
    {
      id: "02",
      icon: Code2,
      title: "Frontend Architecture",
      description: "Crafting modern, highly immersive web applications using React, Next.js, and TypeScript with clean component design and responsive layout systems.",
      tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "HTML5 & CSS3"],
      photo: "/web-projects/img2.jpg"
    },
    {
      id: "03",
      icon: Workflow,
      title: "Creative Interaction",
      description: "Bringing interfaces to life with interactive physics, scroll-driven page animations, dynamic SVG yarn structures, and fluid Framer Motion transitions.",
      tags: ["Framer Motion", "GSAP", "SVG Animation", "WebGL", "Lenis Scroll"],
      photo: "/web-projects/img3.jpg"
    },
    {
      id: "04",
      icon: Layers,
      title: "Design Systems",
      description: "Constructing scalable design tokens and reusable visual style libraries to ensure perfect consistency and smooth engineering workflow.",
      tags: ["Figma Libraries", "Design Tokens", "Tailwind Config", "Storybook", "Accessibility"],
      photo: "/graphic-design/img4.jpg"
    },
  ];

  const cardLayouts = [
    {
      desktop: { left: "3%", top: "16%", width: "21%", rotate: -5 },
      mobile: { left: "3%", top: "5%", width: "44%", rotate: -4 }
    },
    {
      desktop: { left: "26%", top: "42%", width: "22%", rotate: 4 },
      mobile: { left: "51%", top: "22%", width: "45%", rotate: 5 }
    },
    {
      desktop: { left: "50%", top: "14%", width: "21%", rotate: -3 },
      mobile: { left: "3%", top: "41%", width: "44%", rotate: -3 }
    },
    {
      desktop: { left: "73%", top: "40%", width: "22%", rotate: 5 },
      mobile: { left: "51%", top: "60%", width: "45%", rotate: 4 }
    }
  ];

  const updateStringCoords = () => {
    if (!boardRef.current) return;
    const boardRect = boardRef.current.getBoundingClientRect();
    const pins = [pin1Ref, pin2Ref, pin3Ref, pin4Ref];
    const coords = pins.map((pinRef) => {
      if (!pinRef.current) return { x: 0, y: 0 };
      const pinRect = pinRef.current.getBoundingClientRect();
      return {
        x: pinRect.left - boardRect.left + pinRect.width / 2,
        y: pinRect.top - boardRect.top + pinRect.height / 2,
      };
    });
    setPinPositions((prev) => {
      const changed = coords.some((c, i) => !prev[i] || c.x !== prev[i].x || c.y !== prev[i].y);
      return changed ? coords : prev;
    });
  };

  // Handle Resize and Initial Mount update
  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      updateStringCoords();
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    const t1 = setTimeout(updateStringCoords, 100);
    const t2 = setTimeout(updateStringCoords, 500);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Frame tick loop: runs ONLY while cards are hovered/animating
  useEffect(() => {
    if (!isStringUpdating) return;

    let animationFrameId: number;
    const tick = () => {
      updateStringCoords();
      animationFrameId = requestAnimationFrame(tick);
    };
    animationFrameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isStringUpdating]);

  // GSAP ScrollTrigger Pinning and Sequential card-to-card thread drawing reveal
  useEffect(() => {
    if (!mounted || pinPositions.length === 0) return;

    const container = containerRef.current;
    const cards = gsap.utils.toArray(".polaroid-card");

    if (!container || !cards.length) return;

    // Get actual path lengths based on final static positions
    yarnRefs.current.forEach((path, idx) => {
      if (!path) return;
      const len = path.getTotalLength();
      gsap.set(path, {
        strokeDasharray: len,
        strokeDashoffset: len,
        opacity: 0
      });
      const shadow = document.querySelector(`.yarn-path-shadow-${idx}`);
      if (shadow) {
        gsap.set(shadow, {
          strokeDasharray: len,
          strokeDashoffset: len,
          opacity: 0
        });
      }
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: isMobile ? "+=95%" : "+=130%",
        pin: true,
        scrub: 0.5,
        anticipatePin: 1,
      }
    });

    // Step 1: Draw the connecting threads sequentially (Cards are already visible at static resting coordinates)
    for (let i = 0; i < cards.length - 1; i++) {
      tl.to([`.yarn-path-${i}`, `.yarn-path-shadow-${i}`], {
        opacity: 1,
        strokeDashoffset: 0,
        duration: 1.0,
        ease: "none"
      });

      // Small pause in scroll between paths drawing
      if (i < cards.length - 2) {
        tl.to({}, { duration: 0.25 });
      }
    }

    // Add landing padding at the end of the timeline to allow completion before unpinning
    tl.to({}, { duration: 0.5 });

    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, [mounted, pinPositions.length, isMobile]);

  return (
    <section
      ref={containerRef}
      id="skills"
      className="relative w-full py-12 md:py-16 select-none z-30 min-h-screen flex flex-col justify-center"
      style={{ backgroundColor: 'var(--skills-bg, #19350C)' }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.01),transparent_70%)] pointer-events-none z-0" />
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none opacity-25 mix-blend-overlay z-0"
        style={{ backgroundImage: 'url("/image.png")' }}
      />
      <GridOverlay />

      <div className="max-w-6xl mx-auto px-6 relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center w-full mb-10 relative"
        >
          <Stamp className="absolute top-[55%] right-2 md:right-12 w-36 h-36 md:w-48 md:h-48 opacity-[0.12] rotate-[-12deg] pointer-events-none z-0" color="var(--skills-stamp-color, #B22222)" />
          <span className="text-luxury-gold text-xs font-bold uppercase tracking-[0.25em] mb-3 block relative z-10">
            capabilities & stack
          </span>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white font-display relative z-10">
            Skills & Expertise
          </h2>
          <div className="h-[2px] w-16 bg-luxury-gold mx-auto mt-6 relative z-10" />
        </motion.div>

        {/* Polaroid Evidence Board */}
        <div
          ref={boardRef}
          className="relative w-full h-[880px] md:h-[680px] overflow-hidden"
        >
          <div className="absolute top-4 left-4 text-white/20 text-[0.6rem] font-mono tracking-widest z-10 select-none">
            [ DOSSIER / STACK_EVIDENCE_ROOM ]
          </div>

          {/* Ripped Memo Case brief */}
          <div className="absolute top-[8%] left-[4%] w-[200px] text-stone-800 p-4 shadow-md border border-stone-300 font-sans rotate-[-3deg] hidden md:block z-10" style={{ backgroundColor: "var(--skills-memo-bg, #fcfbf9)" }}>
            <div className="absolute -top-3 left-[15%] w-3.5 h-3.5 rounded-full bg-blue-600 shadow-sm border border-blue-700 flex items-center justify-center pointer-events-none">
              <div className="absolute top-2.5 left-2.5 w-1 h-2 bg-black/35 origin-top-left rotate-[35deg] rounded-full blur-[0.5px]" />
            </div>
            <p className="text-[0.6rem] text-stone-400 font-mono tracking-widest mb-2 border-b border-dashed border-stone-200 pb-1">
              {"// CLASSIFIED REPORT"}
            </p>
            <p className="text-[0.75rem] text-stone-600 leading-relaxed font-serif italic">
              {"\"System core parameters verified. Senior UI/UX architecture established.\""}
            </p>
          </div>

          {/* SVG red yarn overlay */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
            {pinPositions.map((pos, idx) => {
              if (idx === pinPositions.length - 1) return null;
              const nextPos = pinPositions[idx + 1];
              if (!pos || !nextPos || (pos.x === 0 && pos.y === 0)) return null;

              const x1 = pos.x;
              const y1 = pos.y;
              const x2 = nextPos.x;
              const y2 = nextPos.y;

              const mx = (x1 + x2) / 2;
              const my = (y1 + y2) / 2;
              const dist = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
              const sag = my + Math.min(65, dist * 0.16);

              const d = `M ${x1} ${y1} Q ${mx} ${sag} ${x2} ${y2}`;

              return (
                <g key={idx}>
                  <path
                    d={d}
                    fill="none"
                    stroke="rgba(0,0,0,0.35)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    className={`yarn-path-shadow yarn-path-shadow-${idx}`}
                    style={{ transform: "translateY(4px) translateX(1px)" }}
                  />
                  <path
                    ref={(el) => { yarnRefs.current[idx] = el; }}
                    d={d}
                    fill="none"
                    stroke="var(--skills-yarn-color, #dc2626)"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    className={`yarn-path yarn-path-${idx}`}
                  />
                </g>
              );
            })}
          </svg>

          {/* Polaroid Cards */}
          {coreSkills.map((skill, idx) => {
            const layout = cardLayouts[idx];
            const currentStyle = isMobile ? layout.mobile : layout.desktop;
            const Icon = skill.icon;

            let pinRef;
            if (idx === 0) pinRef = pin1Ref;
            else if (idx === 1) pinRef = pin2Ref;
            else if (idx === 2) pinRef = pin3Ref;
            else pinRef = pin4Ref;

            return (
              <motion.div
                key={skill.title}
                whileHover={{
                  scale: 1.03,
                  rotate: currentStyle.rotate * 0.25,
                  y: -6,
                  zIndex: 30,
                  transition: { type: "spring", stiffness: 300, damping: 14 }
                }}
                className="polaroid-card absolute cursor-pointer p-2.5 pb-5 md:p-3 md:pb-6 shadow-[0_6px_15px_rgba(0,0,0,0.4)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.65)] border border-stone-200/50 rounded-sm select-none z-10 transition-shadow duration-300"
                style={{
                  width: currentStyle.width,
                  left: currentStyle.left,
                  top: currentStyle.top,
                  minWidth: isMobile ? "140px" : "180px",
                  maxWidth: isMobile ? "200px" : "250px",
                  transform: `rotate(${currentStyle.rotate}deg)`,
                  backgroundColor: "var(--skills-polaroid-bg, #faf8f5)"
                }}
                onMouseEnter={() => setActiveHovers(prev => prev + 1)}
                onMouseLeave={() => setActiveHovers(prev => Math.max(0, prev - 1))}
              >
                {/* Pin */}
                <div
                  ref={pinRef}
                  className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-red-600 shadow-[0_2px_4px_rgba(0,0,0,0.4)] border border-red-700 z-25 flex items-center justify-center pointer-events-none"
                  style={{
                    background: "radial-gradient(circle at 3px 3px, var(--skills-pin-color-start, #f87171), var(--skills-pin-color-end, #b91c1c))"
                  }}
                >
                  <div className="w-0.5 h-0.5 rounded-full bg-white/60 absolute top-0.5 left-0.5" />
                  <div className="absolute top-2.5 left-2.5 w-1 h-2.5 bg-black/45 origin-top-left rotate-[40deg] rounded-full blur-[0.5px]" />
                </div>

                {/* Photo */}
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-stone-900 border border-stone-200/60 shadow-inner">
                  <Image
                    src={skill.photo}
                    alt={skill.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover filter contrast-[1.08] brightness-[0.92] sepia-[0.05]"
                  />
                  <div className="absolute bottom-2 right-2 bg-stone-900/80 p-1.5 rounded backdrop-blur-sm z-10 pointer-events-none border" style={{ borderColor: "var(--skills-accent-gold, rgba(201, 168, 76, 0.5))" }}>
                    <Icon className="w-4 h-4" style={{ color: "var(--skills-accent-gold, #C9A84C)" }} />
                  </div>
                  <div className="absolute -top-3 -left-3 w-6 h-2.5 bg-yellow-100/25 backdrop-blur-[0.5px] rotate-[-35deg] border-l border-r border-yellow-200/10" />
                </div>

                {/* Info */}
                <div className="mt-3 flex flex-col gap-1.5">
                  <h3 className="text-xs md:text-sm font-black tracking-wider text-stone-800 leading-tight uppercase font-display">
                    {skill.title}
                  </h3>
                  <p className="text-[0.6rem] md:text-[0.7rem] text-stone-600 leading-relaxed font-light font-sans line-clamp-3 select-text pointer-events-auto">
                    {skill.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mt-1 border-t border-dashed border-stone-200 pt-2">
                    {skill.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[0.55rem] bg-stone-100 border border-amber-800/15 text-amber-900/85 px-1.5 py-0.5 rounded font-mono tracking-wider font-semibold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Cursive Number */}
                  <div className="fleur-de-leah-regular text-3xl md:text-4xl text-red-800/80 mt-1 select-none font-bold text-center leading-none">
                    {skill.id}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      <Stamp className="absolute bottom-4 right-4 w-36 h-36 md:w-48 md:h-48 opacity-85 rotate-[-15deg] z-20" color="var(--skills-stamp-color, #B22222)" />
    </section>
  );
}
