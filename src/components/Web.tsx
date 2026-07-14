"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useState } from "react";
import Stamp from "./ui/Stamp";
import { motion } from "framer-motion";

interface DeveloperPanelContentProps {
  onActiveChange?: (active: boolean) => void;
}

const DeveloperPanelContent = ({ onActiveChange }: DeveloperPanelContentProps) => {
  const [activeProject, setActiveProject] = useState<number | null>(null);
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 848);
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 848);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 1. Manage scroll lock on desktop and auto-close on mobile when folder is open
  useEffect(() => {
    if (activeProject === null) return;

    const isDesktop = window.innerWidth >= 848;
    const lenis = (window as any).lenis;

    if (isDesktop) {
      // DESKTOP: Do nothing (no scroll-lock, no auto-close)
      return;
    } else {
      // MOBILE: Auto-close folder on scroll
      const handleOuterScroll = () => {
        setActiveProject(null);
        if (onActiveChange) {
          onActiveChange(false);
        }
      };

      if (lenis) {
        lenis.on("scroll", handleOuterScroll);
      }

      window.addEventListener("wheel", handleOuterScroll, { passive: true });
      window.addEventListener("touchmove", handleOuterScroll, { passive: true });

      return () => {
        if (lenis) {
          lenis.off("scroll", handleOuterScroll);
        }
        window.removeEventListener("wheel", handleOuterScroll);
        window.removeEventListener("touchmove", handleOuterScroll);
      };
    }
  }, [activeProject, onActiveChange]);

  // 2. Intercept back button / gestures on mobile
  useEffect(() => {
    if (activeProject === null) return;

    window.history.pushState({ folderOpen: true }, "");

    const handlePopState = (e: PopStateEvent) => {
      setActiveProject(null);
      if (onActiveChange) {
        onActiveChange(false);
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      if (window.history.state?.folderOpen) {
        window.history.back();
      }
    };
  }, [activeProject, onActiveChange]);

  const handleClick = (idx: number) => {
    setActiveProject(prev => {
      const next = prev === idx ? null : idx;
      if (onActiveChange) {
        onActiveChange(next !== null);
      }
      return next;
    });
  };

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden" style={{ backgroundColor: "var(--projects-bg, #19350C)" }}>
      {/* ========== LAYOUT ========== */}
      <div className="absolute inset-0">
        {/* Chapter header matching Skills layout */}
        <div className="absolute top-10 left-0 w-full text-center z-10 pointer-events-none px-6">
          <span className="text-luxury-gold text-xs font-bold uppercase tracking-[0.25em] mb-3 block relative z-10">
            selected works
          </span>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white font-display relative z-10">
            Projects
          </h2>
          <div className="h-[2px] w-16 bg-luxury-gold mx-auto mt-6 relative z-10" />
        </div>

        {/* ===== FULL-WIDTH: Physical folder stack ===== */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Render folders BACK to FRONT so front paints on top */}
          {[...Array(N)].map((_, renderOrder) => {
            const idx = N - 1 - renderOrder; // N-1 first (back), 0 last (front)
            const project = projects[idx];
            const pal = PALETTE[idx];
            const isAnyActive = activeProject !== null;
            const isActive = activeProject === idx;
            const isHovered = hoveredProject === idx && activeProject === null;

            const defaultTopVH = getDefaultTopVH(idx);
            const tabLeftPct = getTabLeftPct(idx);
            const zIndex = isActive ? 100 : N - idx;

            const transition = 'transform 0.65s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.55s cubic-bezier(0.25, 1, 0.5, 1), height 0.65s cubic-bezier(0.25, 1, 0.5, 1)';

            let transform = 'translateY(0px)';
            let opacity = 1;
            let pointerEvents: 'auto' | 'none' = 'auto';

            if (isActive) {
              const activeTranslateVH = isDesktop
                ? -defaultTopVH
                : -(defaultTopVH - 5);
              transform = `translateY(${activeTranslateVH}vh)`;
            } else if (isAnyActive) {
              transform = 'translateY(80px)';
              opacity = 0.12;
            }

            return (
              <motion.div
                key={project.id}
                initial={{ y: 320, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  type: "spring",
                  stiffness: 55,
                  damping: 15,
                  mass: 0.9,
                  delay: (N - 1 - idx) * 0.16,
                }}
                className="absolute inset-0 pointer-events-none"
                style={{ zIndex }}
              >
                <div
                  onClick={() => handleClick(idx)}
                  onMouseEnter={() => { if (activeProject === null) setHoveredProject(idx); }}
                  onMouseLeave={() => setHoveredProject(null)}
                  className="absolute left-0 right-0 cursor-pointer pointer-events-auto [will-change:transform,opacity]"
                  style={{
                    top: `${defaultTopVH}vh`,
                    height: isActive 
                      ? (isDesktop ? '100%' : 'calc(100% - 5vh)')
                      : '480px',
                    zIndex,
                    transform,
                    opacity,
                    pointerEvents,
                    transition,
                  }}
                >
                {/* w-full h-full relative replaced with absolute inset-0 to fix height propagation */}
                <div
                  className="absolute inset-0 [will-change:transform]"
                  style={{
                    transform: isHovered ? 'translateY(-22px)' : 'translateY(0px)',
                    transition: 'transform 0.35s cubic-bezier(0.25, 1, 0.5, 1)',
                  }}
                >
                {/* ── TAB ─────────────────────────────────── */}
                <div
                  className="absolute top-0 min-w-[175px] max-w-[52%] px-[22px] rounded-t-xl flex items-center transition-all duration-300"
                  style={{
                    left: `${tabLeftPct}%`,
                    height: `${TAB_H}px`,
                    background: isHovered ? pal.tabBgHover : pal.tabBg,
                    boxShadow: isActive
                      ? '0 -6px 24px rgba(0,0,0,0.5)'
                      : 'none',
                  }}
                >
                  <span
                    className="text-[10px] font-mono font-bold tracking-[0.18em] uppercase whitespace-nowrap overflow-hidden text-ellipsis"
                    style={{ color: pal.bodyText }}
                  >
                    ( {project.title} )
                  </span>
                </div>

                {/* ── FOLDER BODY ──────────────────────────── */}
                <div
                  onClick={(e) => { if (isActive) e.stopPropagation(); }}
                  onWheel={(e) => { if (isActive) e.stopPropagation(); }}
                  onTouchMove={(e) => { if (isActive) e.stopPropagation(); }}
                  data-lenis-prevent={isActive ? "true" : undefined}
                  className="absolute left-0 right-0 bottom-0 rounded-tr-[14px] transition-shadow duration-300"
                  style={{
                    top: `${TAB_H - 1}px`,
                    background: pal.folderBg,
                    overflow: isActive ? 'auto' : 'hidden',
                    boxShadow: isActive
                      ? '0 28px 90px rgba(0,0,0,0.8), 0 8px 32px rgba(0,0,0,0.5)'
                      : '0 8px 32px rgba(0,0,0,0.35)',
                  }}
                >
                  {/* Preview metadata — visible only when closed */}
                  <div
                    className="absolute top-[14px] left-[28px] right-[28px] flex justify-between items-center transition-opacity duration-300 pointer-events-none font-mono text-[9px] font-medium tracking-[0.22em] uppercase"
                    style={{
                      opacity: isActive ? 0 : 0.65,
                      color: pal.bodyText,
                    }}
                  >
                    <span>[ REF-{project.id}_SYS ]</span>
                    <span className="hidden sm:inline" style={{ opacity: 0.75 }}>{project.tech}</span>
                  </div>

                  {/* Decorative ruled lines — visible when closed */}
                  <div
                    className="absolute inset-0 pt-[36px] px-[28px] pb-[18px] transition-opacity duration-200 pointer-events-none"
                    style={{ opacity: isActive ? 0 : 1 }}
                  >
                    {[0.7, 0.55, 0.42, 0.3].map((w, i) => (
                      <div
                        key={i}
                        className="h-[1px] mb-[14px]"
                        style={{
                          background: pal.lineColor,
                          width: `${w * 100}%`,
                        }}
                      />
                    ))}
                  </div>

                  {/* Cover detail for the top/front folder — visible only when idle */}
                  {activeProject === null && idx === 0 && (
                    <div
                      className="absolute top-[52%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center rounded-lg py-[36px] px-[48px] font-mono pointer-events-none text-center w-[80%] max-w-[460px] z-[5]"
                      style={{
                        border: `1px dashed ${pal.bodyText}40`,
                        color: pal.bodyText,
                      }}
                    >
                      <span
                        className="text-[18px] font-bold tracking-[0.18em] mb-[20px] uppercase"
                        style={{ color: pal.titleText }}
                      >
                        [ DEVELOPER FOLDER ]
                      </span>
                      <div className="h-[1px] w-[60px] mb-[24px]" style={{ background: `${pal.bodyText}25` }} />
                      <span className="text-[10px] tracking-[0.16em] uppercase leading-[1.7] opacity-80">
                        CLICK ON ANY FOLDER TAB TO EXPAND SYSTEM AND VIEW PROJECT MODULES
                      </span>
                    </div>
                  )}

                  {/* ── CONTENT (fades in when active) ──────── */}
                  <div
                    data-lenis-prevent={isActive ? "true" : undefined}
                    onWheel={(e) => { if (isActive) e.stopPropagation(); }}
                    onTouchMove={(e) => { if (isActive) e.stopPropagation(); }}
                    className="absolute inset-0 py-[48px] px-[64px] overflow-y-auto"
                    style={{
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? 'translateY(0)' : 'translateY(20px)',
                      transition: isActive
                        ? 'opacity 0.35s ease 0.32s, transform 0.35s ease 0.32s'
                        : 'opacity 0.15s ease, transform 0.15s ease',
                      pointerEvents: isActive ? 'auto' : 'none',
                    }}
                  >
                    {/* Top row */}
                    <div className="flex justify-between items-center mb-10">
                      <span
                        className="text-[15px] font-mono tracking-[0.14em] leading-[1.4] opacity-50 uppercase"
                        style={{ color: pal.bodyText }}
                      >
                        [{project.id}] — ENGINEERING CATALOGUE
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveProject(null);
                          if (onActiveChange) {
                            onActiveChange(false);
                          }
                        }}
                        className="text-[11px] font-mono tracking-[0.12em] bg-transparent py-[6px] px-[18px] cursor-pointer opacity-80 uppercase transition-colors duration-200 hover:bg-white/10"
                        style={{
                          color: pal.bodyText,
                          borderColor: `${pal.bodyText}40`,
                        }}
                      >
                        [ CLOSE ]
                      </button>
                    </div>

                    {/* Project title */}
                    <h2
                      className="font-black tracking-tighter leading-[1.08] mb-[36px] uppercase font-display"
                      style={{
                        color: pal.titleText,
                        fontSize: 'clamp(2rem, 3.8vw, 3rem)',
                      }}
                    >
                      {project.title}
                    </h2>

                    {/* Two-column content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-11">
                      <div className="max-w-[540px]">
                        <span
                          className="block text-[20px] font-mono tracking-[0.14em] leading-[1.4] uppercase mb-[22px]"
                          style={{ color: pal.accent }}
                        >
                          OBJECTIVE.
                        </span>
                        <p className="text-[1.02rem] leading-[1.78] opacity-90 mb-4" style={{ color: pal.bodyText }}>
                          {project.objective}
                        </p>
                        <ul className="list-none pl-0 m-0">
                          {project.objectivePoints.map((pt, i) => (
                            <li
                              key={i}
                              className="text-[0.94rem] leading-[1.6] opacity-80 mb-[10px] flex gap-[10px] items-start"
                              style={{ color: pal.bodyText }}
                            >
                              <span className="text-[1.1rem] leading-none" style={{ color: pal.accent }}>•</span>
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="max-w-[540px]">
                        <span
                          className="block text-[20px] font-mono tracking-[0.14em] leading-[1.4] uppercase mb-[22px]"
                          style={{ color: pal.accent }}
                        >
                          EXECUTION.
                        </span>
                        <p className="text-[1.02rem] leading-[1.78] opacity-90 mb-4" style={{ color: pal.bodyText }}>
                          {project.how}
                        </p>
                        <ul className="list-none pl-0 m-0">
                          {project.howPoints.map((pt, i) => (
                            <li
                              key={i}
                              className="text-[0.94rem] leading-[1.6] opacity-80 mb-[10px] flex gap-[10px] items-start"
                              style={{ color: pal.bodyText }}
                            >
                              <span className="text-[1.1rem] leading-none" style={{ color: pal.accent }}>•</span>
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Footer: tech stack + CTA */}
                    <div
                      className="border-t pt-6 flex justify-between items-center flex-wrap gap-4"
                      style={{ borderTopColor: `${pal.bodyText}18` }}
                    >
                      <div>
                        <span
                          className="block text-[20px] font-mono tracking-[0.14em] leading-[1.4] opacity-50 uppercase mb-4"
                          style={{ color: pal.bodyText }}
                        >
                          TECH STACK
                        </span>
                        <span className="text-[0.94rem] font-mono tracking-[0.12em] uppercase" style={{ color: pal.bodyText }}>
                          {project.tech}
                        </span>
                      </div>
                      <div className="flex gap-3">
                        <a
                          href={project.liveLink || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-3 px-6 text-[11px] font-mono tracking-[0.2em] uppercase font-bold cursor-pointer border-none transition-opacity hover:opacity-90 flex items-center justify-center no-underline"
                          style={{
                            background: pal.accent,
                            color: 'var(--projects-btn-text, #061810)',
                          }}
                        >
                          VIEW PROJECT →
                        </a>
                        <a
                          href={project.gitLink || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-3 px-6 bg-transparent text-[11px] font-mono tracking-[0.2em] uppercase cursor-pointer border border-solid transition-colors hover:bg-white/5 flex items-center justify-center no-underline"
                          style={{
                            color: pal.bodyText,
                            borderColor: `${pal.bodyText}30`,
                          }}
                        >
                          GITHUB
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Stamp — kept from original */}
      <Stamp
        className="absolute top-20 right-4 md:right-8 w-28 h-28 md:w-36 md:h-36 opacity-30 rotate-[12deg] z-20 pointer-events-none"
        color="var(--projects-stamp-color, #B22222)"
      />
    </div>
  );
};

export default function Web() {
  const [isFolderOpen, setIsFolderOpen] = useState(false);

  return (
    <section
      id="web-projects"
      className="relative w-full h-screen overflow-hidden z-10"
      style={{ zIndex: isFolderOpen ? 100 : 10, backgroundColor: "var(--projects-bg, #19350C)" }}
    >
      <DeveloperPanelContent onActiveChange={setIsFolderOpen} />
    </section>
  );
}

// ==========================================
// CONFIGURATION DATA & CONSTANTS
// ==========================================

const TAB_H = 54;        // px — height of folder tab
const STEP_VH = 8;       // vh — vertical gap between folder starting positions
const STACK_BASE_VH = 36; // vh — top position of the FRONT (bottom of stack)

const projects = [
  {
    id: "01",
    title: "AI BACKGROUND REMOVER",
    tech: "JS / TENSORFLOW.JS / MEDIAPIPE",
    liveLink: "https://github.com/Hardikkhyal/free-background-remover",
    gitLink: "https://github.com/Hardikkhyal/free-background-remover",
    objective: "A free, unlimited, privacy-first AI background remover that runs entirely inside the client browser with WebGL acceleration.",
    objectivePoints: [
      "100% private — processing happens locally; images never leave your device.",
      "High-quality transparent PNG export with one-click download.",
      "Advanced edge refinement using bilateral filtering and alpha matting for smooth boundaries."
    ],
    how: "Built using MediaPipe Selfie Segmentation and TensorFlow.js for in-browser ML inference.",
    howPoints: [
      "Loads model asynchronously to optimize bundle size and execution latency.",
      "Runs fully offline inside the browser with zero external server dependencies.",
      "Requires no login, has no watermarks, and offers unlimited usage."
    ]
  },
  {
    id: "02",
    title: "HR PAYROLL SYSTEM",
    tech: "PYTHON / MYSQL / ORACLE",
    liveLink: "https://github.com/Hardikkhyal/new-rd-project",
    gitLink: "https://github.com/Hardikkhyal/new-rd-project",
    objective: "A clean, modular student-level Python backend system for managing corporate HR payroll and attendance records.",
    objectivePoints: [
      "Add, update, search, and list employee profiles in the database.",
      "Mark employee attendance status and manage historic work logs.",
      "Generate monthly salary slips and comprehensive company payroll reports."
    ],
    how: "Designed with an environment-configured database connector supporting MySQL and Oracle SQL DBMS.",
    howPoints: [
      "Enforces referential integrity and safe transactions during payroll execution.",
      "Configured setup files for rapid table initialization and schema seeding.",
      "Written in structured Python 3.9+ using standard SQL query protocols."
    ]
  },
  {
    id: "03",
    title: "DEVOPSHUB PLATFORM",
    tech: "REACT / NODE.JS / DOCKER / AWS",
    liveLink: "https://github.com/Hardikkhyal/deploy-kinder/tree/main/DevOpsHub",
    gitLink: "https://github.com/Hardikkhyal/deploy-kinder/tree/main/DevOpsHub",
    objective: "A self-hosted, lightweight DevOps deployment and PaaS management platform designed for single-click application deployments.",
    objectivePoints: [
      "Automates git repository cloning and Docker multi-container image building.",
      "Streams live container execution and build logs to the browser using Socket.io and XTerm.js.",
      "Features dynamic Nginx reverse proxy routing and Prometheus/Grafana hardware monitoring."
    ],
    how: "Constructed on a React/Vite client and Node.js server paired with Prisma ORM and PostgreSQL databases.",
    howPoints: [
      "Interacts directly with Docker container runtimes using the Dockerode client API.",
      "Leverages Terraform and Ansible scripts for automated server and infrastructure provisioning.",
      "Optimized configuration profiles to run efficiently on an AWS EC2 t2.micro instance."
    ]
  }
];

const N = projects.length;

const PALETTE = [
  {
    folderBg: "var(--projects-folder-1-bg, #19350C)",
    tabBg: "var(--projects-folder-1-tab-bg, #19350C)",
    tabBgHover: "var(--projects-folder-1-tab-hover-bg, #264d38)",
    bodyText: "var(--projects-folder-1-text-body, #a8d4b8)",
    titleText: "var(--projects-folder-1-text-title, #c8f0d8)",
    accent: "var(--projects-folder-1-accent, #4db880)",
    lineColor: "var(--projects-folder-1-line, rgba(168,212,184,0.12))",
  },
  {
    folderBg: "var(--projects-folder-2-bg, #3d6852)",
    tabBg: "var(--projects-folder-2-tab-bg, #4d7a64)",
    tabBgHover: "var(--projects-folder-2-tab-hover-bg, #5e8c76)",
    bodyText: "var(--projects-folder-2-text-body, #c9ebd8)",
    titleText: "var(--projects-folder-2-text-title, #e8f7ee)",
    accent: "var(--projects-folder-2-accent, #a3f5c9)",
    lineColor: "var(--projects-folder-2-line, rgba(201,235,216,0.12))",
  },
  {
    folderBg: "var(--projects-folder-3-bg, #9eb8a8)",
    tabBg: "var(--projects-folder-3-tab-bg, #8aaa98)",
    tabBgHover: "var(--projects-folder-3-tab-hover-bg, #98baa8)",
    bodyText: "var(--projects-folder-3-text-body, #1c3028)",
    titleText: "var(--projects-folder-3-text-title, #0e2018)",
    accent: "var(--projects-folder-3-accent, #1c5038)",
    lineColor: "var(--projects-folder-3-line, rgba(28,48,40,0.12))",
  },
];

const getDefaultTopVH = (idx: number) =>
  STACK_BASE_VH + (N - 1 - idx) * STEP_VH;

const getActiveTranslateVH = (idx: number) =>
  -(getDefaultTopVH(idx) - 5);

const getTabLeftPct = (idx: number) => 2 + idx * 32;
