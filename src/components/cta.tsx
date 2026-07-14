"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function BB() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const circlesRef = useRef<SVGSVGElement>(null);
  const enterBtnRef = useRef<HTMLButtonElement>(null);
  const enterBgRef = useRef<HTMLDivElement>(null);
  const [isEntered, setIsEntered] = useState(false);

  // Keep a reference to the main timelines
  const startTL = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const circles = circlesRef.current;
    const enterBtn = enterBtnRef.current;
    const enterBg = enterBgRef.current;
    if (!circles || !enterBtn || !enterBg) return;

    const texts = circles.querySelectorAll("text.circles__text");

    // Set SVG text transform origins to the center of the 1400x1400 viewbox
    gsap.set(texts, { transformOrigin: "50% 50%" });
    gsap.set([texts, enterBtn], { opacity: 0 });

    // 1. ScrollTrigger to play the startup animation when section enters viewport
    const ctx = gsap.context(() => {
      startTL.current = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none none",
        }
      })
      .addLabel("start", 0)
      .to([texts, enterBtn], {
        duration: 2,
        ease: "expo.out",
        startAt: { opacity: 0, scale: 0.3 },
        scale: 1,
        opacity: 1,
        stagger: {
          amount: 0.5
        }
      }, "start")
      .add(() => {
        gsap.set(enterBtn, { pointerEvents: "auto" });
      }, "start+=0.8");
    });

    // 2. Mouse Hover Animations
    const handleMouseEnter = () => {
      gsap.killTweensOf([enterBg, texts]);

      gsap.to(enterBg, {
        duration: 0.8,
        ease: "power4.out",
        scale: 1.2,
      });

      gsap.to(texts, {
        duration: 4,
        ease: "power4.out",
        rotate: "+=180",
        stagger: {
          amount: -0.3
        }
      });
    };

    const handleMouseLeave = () => {
      gsap.to(enterBg, {
        duration: 0.8,
        ease: "power4.out",
        scale: 1,
      });
    };

    enterBtn.addEventListener("mouseenter", handleMouseEnter);
    enterBtn.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      ctx.revert();
      enterBtn.removeEventListener("mouseenter", handleMouseEnter);
      enterBtn.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const handleEnterClick = () => {
    const circles = circlesRef.current;
    const enterBtn = enterBtnRef.current;
    if (!circles || !enterBtn) return;

    const texts = circles.querySelectorAll("text.circles__text");
    const total = texts.length;

    // Kill startup timeline
    if (startTL.current) startTL.current.kill();

    gsap.set(enterBtn, { pointerEvents: "none" });

    // Transition out
    const transitionTL = gsap.timeline({
      onComplete: () => {
        setIsEntered(true);
      }
    });

    transitionTL.addLabel("start", 0);
    transitionTL.to(enterBtn, {
      duration: 1.2,
      ease: "expo.inOut",
      scale: 0.7,
      opacity: 0
    }, "start");

    transitionTL.to(texts, {
      duration: 1.2,
      ease: "expo.inOut",
      scale: (i) => 1.5 + (total - i) * 0.35,
      opacity: 0,
      stagger: {
        amount: 0.2
      }
    }, "start");
  };

  const handleResetClick = () => {
    setIsEntered(false);

    const circles = circlesRef.current;
    const enterBtn = enterBtnRef.current;
    if (!circles || !enterBtn) return;

    const texts = circles.querySelectorAll("text.circles__text");

    gsap.killTweensOf([texts, enterBtn]);
    gsap.set([texts, enterBtn], { opacity: 0, scale: 0.3 });

    // Replay startup timeline
    gsap.timeline()
      .addLabel("start", 0)
      .to([texts, enterBtn], {
        duration: 2,
        ease: "expo.out",
        scale: 1,
        opacity: 1,
        stagger: {
          amount: 0.5
        }
      }, "start")
      .add(() => {
        gsap.set(enterBtn, { pointerEvents: "auto" });
      }, "start+=0.8");
  };

  return (
    <section ref={sectionRef} id="contact" className="bb-section">
      {/* Concentric Text Circles */}
      <svg 
        ref={circlesRef} 
        className="circles" 
        width="100%" 
        height="100%" 
        viewBox="0 0 1400 1400"
        style={{ display: isEntered ? "none" : "block" }}
      >
        <defs>
          <path id="circle-0" d="M89.5,700.5A610.5,610.5 0 1 1 1310.5,700.5A610.5,610.5 0 1 1 89.5,700.5" />
          <path id="circle-1" d="M250,700.5A450.5,450.5 0 1 1 1151,700.5A450.5,450.5 0 1 1 250,700.5" />
          <path id="circle-2" d="M382,700.5A318.5,318.5 0 1 1 1019,700.5A318.5,318.5 0 1 1 382,700.5" />
          <path id="circle-3" d="M487,700.5A213.5,213.5 0 1 1 914,700.5A213.5,213.5 0 1 1 487,700.5" />
          <path id="circle-4" d="M567.5,700.5A133,133 0 1 1 833.5,700.5A133,133 0 1 1 567.5,700.5" />
        </defs>
        <text className="circles__text circles__text--0">
          <textPath className="circles__text-path" href="#circle-0" textLength="3836">
            Bespoke Web Design & Digital Art Direction Experience 2026&nbsp;
          </textPath>
        </text>
        <text className="circles__text circles__text--1">
          <textPath className="circles__text-path" href="#circle-1" textLength="2830">
            Hardik Khyal Portfolio Experience Copenhagen&nbsp;
          </textPath>
        </text>
        <text className="circles__text circles__text--2">
          <textPath className="circles__text-path" href="#circle-2" textLength="2001">
            Bespoke Creative Design Playground&nbsp;
          </textPath>
        </text>
        <text className="circles__text circles__text--3">
          <textPath className="circles__text-path" href="#circle-3" textLength="1341">
            Interactive Artistry Studio&nbsp;
          </textPath>
        </text>
        <text className="circles__text circles__text--4">
          <textPath className="circles__text-path" href="#circle-4" textLength="836">
            Future of Web Design&nbsp;
          </textPath>
        </text>
      </svg>

      {/* Interactive Enter Button */}
      <button 
        ref={enterBtnRef} 
        className="enter" 
        onClick={handleEnterClick}
        style={{ display: isEntered ? "none" : "block" }}
      >
        <div ref={enterBgRef} className="enter__bg"></div>
        <span className="enter__text">Enter</span>
      </button>

      {/* Hidden Content revealed upon Click */}
      <div className={`bb-content ${isEntered ? "active" : ""}`}>
        <p>
          I am a creative developer focusing on high-end interactions, elegant motion system design, and ergonomic digital products. Let&apos;s create something extraordinary.
        </p>
        <button className="bb-reset" onClick={handleResetClick}>
          Replay Circles
        </button>
      </div>
    </section>
  );
}
