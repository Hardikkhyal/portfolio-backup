"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GraduationCap, Code, Cpu } from "lucide-react";
import FloatingStars from "./ui/FloatingStars";
import { motion } from "framer-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Milestone {
  year: string;
  title: string;
  institution: string;
  badge: string;
  grade: string;
  details: string;
  icon: React.ComponentType<{ className?: string }>;
}

const milestones: Milestone[] = [
  {
    year: "2018–2020",
    title: "High School Education",
    institution: "Mother Teresa Sr. Sec. School",
    badge: "Science & Mathematics",
    grade: "91.2% Aggregate",
    details: "Fostered a strong analytical foundation with deep focus on Physics, Chemistry, and Advanced Mathematics.",
    icon: GraduationCap,
  },
  {
    year: "2020–2023",
    title: "Diploma in Computer Science",
    institution: "Government Polytechnic College",
    badge: "Software Engineering",
    grade: "8.5 CGPA / 87.5%",
    details: "Learned core computer science concepts including OOPs, Data Structures, Database Systems, and built multiple web-based platforms.",
    icon: Code,
  },
  {
    year: "2024–Present",
    title: "B.Tech in Computer Science",
    institution: "Lovely Professional University",
    badge: "Web Architecture & AI",
    grade: "Pursuing (Current)",
    details: "Specializing in full-stack architecture, machine learning integrations, creative UI motion, and next-generation web technologies.",
    icon: Cpu,
  }
];

export default function Journey() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const pathGlowRef = useRef<SVGPathElement>(null);
  const pointerRef = useRef<SVGCircleElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const nodesRef = useRef<(HTMLDivElement | null)[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  const [pathD, setPathD] = useState("");

  // Dynamically calculate and build the connecting SVG path
  useEffect(() => {
    const updatePath = () => {
      const svg = svgRef.current;
      const container = containerRef.current;
      if (!svg || !container) return;

      const svgRect = svg.getBoundingClientRect();
      const coords = nodesRef.current
        .filter((node): node is HTMLDivElement => !!node && document.body.contains(node))
        .map((node) => {
          const rect = node.getBoundingClientRect();
          return {
            x: rect.left - svgRect.left + rect.width / 2,
            y: rect.top - svgRect.top + rect.height / 2,
          };
        });

      const width = svgRect.width;
      const height = svgRect.height;
      const centerX = width / 2;

      let d = `M ${centerX} 0`;

      if (coords.length > 0) {

        const first = coords[0];
        d += ` L ${centerX} ${first.y - 80}`;
        d += ` C ${centerX} ${first.y - 40}, ${first.x} ${first.y - 40}, ${first.x} ${first.y}`;


        for (let i = 0; i < coords.length - 1; i++) {
          const curr = coords[i];
          const next = coords[i + 1];
          const dy = next.y - curr.y;

          d += ` C ${curr.x} ${curr.y + dy * 0.45}, ${next.x} ${next.y - dy * 0.45}, ${next.x} ${next.y}`;
        }


        const last = coords[coords.length - 1];
        d += ` C ${last.x} ${last.y + 40}, ${centerX} ${last.y + 40}, ${centerX} ${last.y + 80}`;
        d += ` L ${centerX} ${height}`;
      } else {
        d += ` L ${centerX} ${height}`;
      }

      setPathD(d);

      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 50);
    };


    const timer = setTimeout(updatePath, 100);


    const observer = new ResizeObserver(() => updatePath());
    if (containerRef.current && containerRef.current.parentElement) {
      observer.observe(containerRef.current.parentElement);
    }

    window.addEventListener("resize", updatePath);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      window.removeEventListener("resize", updatePath);
    };
  }, []);


  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;


    const ctx = gsap.context(() => {

      cardsRef.current.forEach((card, idx) => {
        if (!card) return;

        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: 40,
            scale: 0.95,
            filter: "blur(8px)",
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
              toggleActions: "play none none none",
              once: true,
            },
          }
        );
      });


      nodesRef.current.forEach((node, idx) => {
        if (!node) return;

        gsap.fromTo(
          node,
          {
            scale: 0.8,
            boxShadow: "0 0 0px rgba(212, 175, 55, 0)",
            backgroundColor: "#8e8e93",
          },
          {
            scale: 1.25,
            backgroundColor: "#f4c400",
            boxShadow: "0 0 15px #d4af37, 0 0 30px #f4c400",
            duration: 0.5,
            ease: "back.out(2)",
            scrollTrigger: {
              trigger: node,
              start: "top 72%",
              toggleActions: "play none none none",
              once: true,
              onEnter: () => {

                const ring = node.querySelector(".ring-pulse");
                if (ring) {
                  gsap.fromTo(
                    ring,
                    { scale: 1, opacity: 0.8 },
                    { scale: 3, opacity: 0, duration: 0.8, ease: "power2.out" }
                  );
                }
              },
            },
          }
        );
      });
    }, container);

    return () => {
      ctx.revert();
    };
  }, []);


  useEffect(() => {
    const path = pathRef.current;
    const pathGlow = pathGlowRef.current;
    const pointer = pointerRef.current;
    const container = containerRef.current;
    if (!path || !pathGlow || !pathD || !container) return;

    const length = path.getTotalLength();


    gsap.set([path, pathGlow], {
      strokeDasharray: length,
      strokeDashoffset: length,
    });


    const mainTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: contentRef.current,
        start: "top 70%",
        end: "bottom 75%",
        scrub: 0.5,
      },
    });

    mainTimeline.to([path, pathGlow], {
      strokeDashoffset: 0,
      ease: "none",
    });


    const trackingTrigger = ScrollTrigger.create({
      trigger: contentRef.current,
      start: "top 70%",
      end: "bottom 75%",
      scrub: 0.5,
      onUpdate: (self) => {
        if (!pointer || !path) return;
        const currentLength = length * self.progress;
        const point = path.getPointAtLength(currentLength);


        pointer.setAttribute("cx", point.x.toString());
        pointer.setAttribute("cy", point.y.toString());


        gsap.set(pointer, {
          opacity: self.progress > 0.01 && self.progress < 0.99 ? 1 : 0,
        });
      },
    });

    return () => {
      if (mainTimeline.scrollTrigger) mainTimeline.scrollTrigger.kill();
      mainTimeline.kill();
      trackingTrigger.kill();
    };
  }, [pathD]);

  return (
    <section
      ref={containerRef}
      id="journey"
      className="relative w-full z-40 select-none"
    >

      <div
        style={{
          backgroundColor: "var(--journey-bg, #19350C)"
        }}
      >

        {/* <FloatingStars /> */}


        <div
          ref={contentRef}
          className="relative w-full py-12 pb-20"
        >

          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.02),transparent_70%)] pointer-events-none z-0" />



          <div className="max-w-6xl mx-auto px-6 relative z-10">

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-center w-full mb-10 relative z-30"
            >
              <span className="text-luxury-gold text-xs font-bold uppercase tracking-[0.25em] mb-3 block">
                academic timeline
              </span>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white font-display">
                My Journey
              </h2>
              <div className="h-[2px] w-16 bg-luxury-gold mx-auto mt-6" />
            </motion.div>

            <div className="relative w-full">

              <svg
                ref={svgRef}
                className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"
                aria-hidden="true"
              >
                <defs>

                  <filter id="glow-line" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  <filter id="glow-dot" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>


                {pathD && (
                  <path
                    d={pathD}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.05)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}


                {pathD && (
                  <path
                    ref={pathGlowRef}
                    d={pathD}
                    fill="none"
                    stroke="#d4af37"
                    strokeWidth="8"
                    opacity="0.35"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#glow-line)"
                  />
                )}


                {pathD && (
                  <path
                    ref={pathRef}
                    d={pathD}
                    fill="none"
                    stroke="#f4c400"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}


                <circle
                  ref={pointerRef}
                  r="6"
                  fill="#f4c400"
                  className="opacity-0 pointer-events-none"
                  filter="url(#glow-dot)"
                />
              </svg>


              <div className="flex flex-col gap-12 md:gap-16 w-full relative z-20">
                {milestones.map((item, idx) => {
                  const Icon = item.icon;
                  const isEven = idx % 2 === 0;

                  return (
                    <div
                      key={idx}
                      className={`grid grid-cols-1 md:grid-cols-[1fr_80px_1fr] items-center w-full`}
                    >

                      <div
                        className={`order-2 md:order-1 ${isEven ? "block" : "hidden md:block opacity-0 pointer-events-none"
                          }`}
                      >
                        {isEven && (
                          <div
                            ref={(el) => { cardsRef.current[idx] = el; }}
                            className="group relative p-8 md:p-10 rounded-3xl select-none text-left transition-all duration-500"
                          >

                            <div className="absolute inset-0 z-0 select-none pointer-events-none">
                              <svg
                                viewBox="10 120 480 260"
                                preserveAspectRatio="none"
                                className="w-full h-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.12)]"
                              >

                                <path
                                  d="M469.2,376.12H158.01v-7.02c0-4.71-3.83-8.54-8.55-8.54s-8.54,3.83-8.54,8.54v7.02H30.8c-10.14,0-18.39-8.25-18.39-18.39 v-77.64h3c16.59,0,30.09-13.5,30.09-30.09S32,219.91,15.41,219.91h-3v-77.64c0-10.14,8.25-18.39,18.39-18.39h110.11v7.02 c0,4.71,3.83,8.55,8.54,8.55s8.55-3.83,8.55-8.55v-7.02H469.2c10.14,0,18.39,8.25,18.39,18.39v215.45 C487.59,367.87,479.34,376.12,469.2,376.12z"
                                  fill="var(--journey-card-bg, #9eb8a8)"
                                />
                              </svg>
                            </div>


                            <div
                              ref={(el) => { nodesRef.current[idx] = el; }}
                              className="absolute z-30 w-4 h-4 rounded-full border-2 border-luxury-bg top-[-8px] left-1/2 -translate-x-1/2 md:top-1/2 md:-translate-y-1/2 md:translate-x-0 md:left-auto md:right-[-48px]"
                            >
                              <div className="absolute inset-0 rounded-full bg-brand-yellow/50 opacity-0 scale-100 ring-pulse pointer-events-none" />
                            </div>


                            <div className="relative z-10">

                              <div className="flex items-start justify-between gap-4 mb-4">
                                <div>
                                  <span className="text-[var(--journey-date-color,#1c5038)] text-xs font-mono font-bold tracking-wider block mb-1">
                                    {item.year}
                                  </span>
                                  <h3 className="text-xl md:text-2xl font-black text-[var(--journey-title-color,#0e2018)] leading-tight uppercase tracking-tight">
                                    {item.title}
                                  </h3>
                                </div>
                                <div 
                                  className="p-3 rounded-2xl border transition-colors duration-300"
                                  style={{
                                    backgroundColor: "var(--journey-badge-bg, #1c5038)",
                                    borderColor: "var(--journey-badge-border, rgba(28, 80, 56, 0.2))"
                                  }}
                                >
                                  <Icon className="w-6 h-6 text-[var(--journey-card-accent,#9eb8a8)]" />
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-2.5 mb-6 ml-4 md:ml-0">
                                <span 
                                  className="text-[0.625rem] border px-2.5 py-1 rounded-full uppercase font-bold tracking-wider"
                                  style={{
                                    backgroundColor: "var(--journey-badge-alt-bg, rgba(28, 48, 40, 0.1))",
                                    borderColor: "var(--journey-badge-alt-border, rgba(28, 48, 40, 0.2))",
                                    color: "var(--journey-badge-alt-text, #1c3028)"
                                  }}
                                >
                                  {item.institution}
                                </span>
                                <span 
                                  className="text-[0.625rem] border px-2.5 py-1 rounded-full uppercase font-black tracking-wider"
                                  style={{
                                    backgroundColor: "var(--journey-badge-bg, #1c5038)",
                                    borderColor: "var(--journey-badge-bg, #1c5038)",
                                    color: "var(--journey-card-accent, #9eb8a8)"
                                  }}
                                >
                                  {item.badge}
                                </span>
                                <span 
                                  className="text-[0.625rem] border px-2.5 py-1 rounded-full font-mono"
                                  style={{
                                    backgroundColor: "var(--journey-badge-alt-bg-subtle, rgba(28, 48, 40, 0.05))",
                                    borderColor: "var(--journey-badge-alt-border-subtle, rgba(28, 48, 40, 0.1))",
                                    color: "var(--journey-badge-alt-text-subtle, rgba(28, 48, 40, 0.8))"
                                  }}
                                >
                                  {item.grade}
                                </span>
                              </div>

                              <p className="text-[var(--journey-text-color,#1c3028)] text-sm leading-relaxed font-light">
                                {item.details}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>


                      <div className="order-1 md:order-2 flex justify-center items-center h-full pointer-events-none min-h-[2.5rem] md:min-h-0" />


                      <div
                        className={`order-3 ${!isEven ? "block" : "hidden md:block opacity-0 pointer-events-none"
                          }`}
                      >
                        {!isEven && (
                          <div
                            ref={(el) => { cardsRef.current[idx] = el; }}
                            className="group relative p-8 md:p-10 rounded-3xl select-none text-left transition-all duration-500"
                          >

                            <div className="absolute inset-0 z-0 select-none pointer-events-none">
                              <svg
                                viewBox="10 120 480 260"
                                preserveAspectRatio="none"
                                className="w-full h-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.12)]"
                              >

                                <path
                                  d="M469.2,376.12H158.01v-7.02c0-4.71-3.83-8.54-8.55-8.54s-8.54,3.83-8.54,8.54v7.02H30.8c-10.14,0-18.39-8.25-18.39-18.39 v-77.64h3c16.59,0,30.09-13.5,30.09-30.09S32,219.91,15.41,219.91h-3v-77.64c0-10.14,8.25-18.39,18.39-18.39h110.11v7.02 c0,4.71,3.83,8.55,8.54,8.55s8.55-3.83,8.55-8.55v-7.02H469.2c10.14,0,18.39,8.25,18.39,18.39v215.45 C487.59,367.87,479.34,376.12,469.2,376.12z"
                                  fill="var(--journey-card-bg, #9eb8a8)"
                                />
                              </svg>
                            </div>


                            <div
                              ref={(el) => { nodesRef.current[idx] = el; }}
                              className="absolute z-30 w-4 h-4 rounded-full border-2 border-luxury-bg top-[-8px] left-1/2 -translate-x-1/2 md:top-1/2 md:-translate-y-1/2 md:translate-x-0 md:right-auto md:left-[-48px]"
                            >
                              <div className="absolute inset-0 rounded-full bg-brand-yellow/50 opacity-0 scale-100 ring-pulse pointer-events-none" />
                            </div>


                            <div className="relative z-10">

                              <div className="flex items-start justify-between gap-4 mb-4">
                                <div>
                                  <span className="text-[var(--journey-date-color,#1c5038)] text-xs font-mono font-bold tracking-wider block mb-1">
                                    {item.year}
                                  </span>
                                  <h3 className="text-xl md:text-2xl font-black text-[var(--journey-title-color,#0e2018)] leading-tight uppercase tracking-tight">
                                    {item.title}
                                  </h3>
                                </div>
                                <div 
                                  className="p-3 rounded-2xl border transition-colors duration-300"
                                  style={{
                                    backgroundColor: "var(--journey-badge-bg, #1c5038)",
                                    borderColor: "var(--journey-badge-border, rgba(28, 80, 56, 0.2))"
                                  }}
                                >
                                  <Icon className="w-6 h-6 text-[var(--journey-card-accent,#9eb8a8)]" />
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-2.5 mb-6 ml-4 md:ml-0">
                                <span 
                                  className="text-[0.625rem] border px-2.5 py-1 rounded-full uppercase font-bold tracking-wider"
                                  style={{
                                    backgroundColor: "var(--journey-badge-alt-bg, rgba(28, 48, 40, 0.1))",
                                    borderColor: "var(--journey-badge-alt-border, rgba(28, 48, 40, 0.2))",
                                    color: "var(--journey-badge-alt-text, #1c3028)"
                                  }}
                                >
                                  {item.institution}
                                </span>
                                <span 
                                  className="text-[0.625rem] border px-2.5 py-1 rounded-full uppercase font-black tracking-wider"
                                  style={{
                                    backgroundColor: "var(--journey-badge-bg, #1c5038)",
                                    borderColor: "var(--journey-badge-bg, #1c5038)",
                                    color: "var(--journey-card-accent, #9eb8a8)"
                                  }}
                                >
                                  {item.badge}
                                </span>
                                <span 
                                  className="text-[0.625rem] border px-2.5 py-1 rounded-full font-mono"
                                  style={{
                                    backgroundColor: "var(--journey-badge-alt-bg-subtle, rgba(28, 48, 40, 0.05))",
                                    borderColor: "var(--journey-badge-alt-border-subtle, rgba(28, 48, 40, 0.1))",
                                    color: "var(--journey-badge-alt-text-subtle, rgba(28, 48, 40, 0.8))"
                                  }}
                                >
                                  {item.grade}
                                </span>
                              </div>

                              <p className="text-[var(--journey-text-color,#1c3028)] text-sm leading-relaxed font-light">
                                {item.details}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}