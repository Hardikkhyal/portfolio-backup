"use client";

import { useEffect, useRef, useState } from "react";
import { motion, MotionValue, useTransform, useMotionValueEvent } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Palette, Layers, Code2, Sparkles } from "lucide-react";

interface OverlayProps {
  scrollYProgress: MotionValue<number>;
}

export default function Overlay({ scrollYProgress }: OverlayProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);

  const services = [
    {
      title: "Logo Design",
      description: "Premium visual brand identity & vector logo creation.",
      icon: Palette,
      message: "Hi Hardik! I'm interested in getting a Logo designed for my brand. Let's discuss details!"
    },
    {
      title: "Poster & Graphic Art",
      description: "Creative layouts, posters, and custom vector artwork.",
      icon: Layers,
      message: "Hi Hardik! I would love to get a custom Poster or Graphic Artwork designed. Let's connect!"
    },
    {
      title: "Web Development",
      description: "High-performance, scalable web apps & landing pages.",
      icon: Code2,
      message: "Hi Hardik! I want to build a custom Website for my project. Let's connect!"
    },
    {
      title: "Animated Website",
      description: "Next-gen immersive websites with custom interactive motion.",
      icon: Sparkles,
      message: "Hi Hardik! I am interested in building a premium Animated Website with custom physics and transitions. Let's discuss!"
    }
  ];

  const handleServiceClick = (message: string) => {
    const url = `https://wa.me/919465529470?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsServiceModalOpen(false);
  };

  // Refs for mobile GSAP animations
  const titleRef = useRef<HTMLSpanElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);
  const contactBtnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined") return;

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);


  useEffect(() => {
    if (!isMobile || !mounted) return;

    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    const titleUpper = titleRef.current;
    const titleMain = titleMainRef.current;
    const subheading = subheadingRef.current;
    const contactBtn = contactBtnRef.current;
    const container = document.querySelector(".relative.h-\\[400vh\\]");

    if (!titleUpper || !titleMain || !subheading || !contactBtn || !container) return;



    gsap.set([titleUpper, titleMain, contactBtn], { opacity: 1, scale: 1, y: 0 });
    gsap.set(subheading, { opacity: 0, scale: 0.95, y: 20 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      },
    });

    tl.to(subheading, { opacity: 1, scale: 1, y: 0, duration: 2 })
      .to(subheading, { duration: 2.5 })
      .to(subheading, { opacity: 0, scale: 1.05, y: -20, duration: 2 })
      .to([titleUpper, titleMain, contactBtn], { opacity: 0, duration: 2, ease: "power1.inOut" });

    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, [isMobile, mounted]);




  const titleOpacity = useTransform(scrollYProgress, [0.85, 1.0], [1, 0], { clamp: true });
  const titleScale = useTransform(scrollYProgress, [0.85, 1.0], [1, 1.15], { clamp: true });
  const titleY = useTransform(scrollYProgress, [0.85, 1.0], [0, -30], { clamp: true });

  const subheadingOpacity = useTransform(scrollYProgress, [0.02, 0.10, 0.18, 0.25], [0, 1, 1, 0], { clamp: true });
  const subheadingScale = useTransform(scrollYProgress, [0.02, 0.10, 0.18, 0.25], [0.95, 1, 1, 1.05], { clamp: true });
  const subheadingY = useTransform(scrollYProgress, [0.02, 0.10, 0.18, 0.25], [20, 0, 0, -20], { clamp: true });

  const hintOpacity = useTransform(scrollYProgress, [0, 1], [0, 0], { clamp: true });
  const hintY = useTransform(scrollYProgress, [0, 1], [0, 0], { clamp: true });

  return (
    <div className="absolute inset-0 pointer-events-none z-20 w-full h-full">

      <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
        <div className="flex flex-col items-center justify-center translate-y-28 md:translate-y-0 w-full pointer-events-none">
          <motion.span
            ref={titleRef}
            style={!mounted || isMobile ? {} : { opacity: titleOpacity, scale: titleScale, y: titleY }}
            className="text-luxury-gold text-xs md:text-sm font-semibold uppercase tracking-widest mb-4"
          >
            F U L L - S T A C K   D E V E L O P E R   &   D E S I G N E R
          </motion.span>

          <motion.h1
            ref={titleMainRef}
            style={!mounted || isMobile ? {} : { opacity: titleOpacity, scale: titleScale, y: titleY }}
            className="heading-premium text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tight text-white text-center select-none"
          >
            hardikkhyal
          </motion.h1>


          <motion.p
            ref={subheadingRef}
            style={!mounted || isMobile ? {} : { opacity: subheadingOpacity, scale: subheadingScale, y: subheadingY }}
            className="hidden md:block text-white/40 text-sm md:text-base max-w-xl text-center mt-6 font-light leading-relaxed select-none"
          >
            Hardik Khyal is a creative developer crafting high-performance, high-end web applications with pixel perfection.
          </motion.p>

          {/* Mobile Contact Me Button — Directly below subheading */}
          <div
            ref={contactBtnRef}
            className="mt-8 flex flex-col items-center justify-center px-6 md:hidden z-30 pointer-events-auto relative w-full"
          >
            <button
              onClick={() => setIsServiceModalOpen(true)}
              className="px-8 py-3.5 bg-black/45 backdrop-blur-md border border-luxury-gold/30 hover:border-luxury-gold text-luxury-gold hover:text-white uppercase tracking-[0.2em] text-[11px] font-bold rounded-full shadow-[0_4px_25px_rgba(0,0,0,0.5)] transition-all duration-300 active:scale-95 animate-pulse relative z-10 cursor-pointer"
            >
              Contact Me
            </button>
            {/* Vertical line extending to the bottom of the screen */}
            <div
              className="absolute left-1/2 -translate-x-1/2 w-[1px] h-[60dvh] bg-gradient-to-b from-luxury-gold/60 via-luxury-gold/25 to-transparent"
              style={{ top: "100%" }}
            />
          </div>
        </div>


        <motion.p
          style={{ opacity: hintOpacity, y: hintY }}
          className="text-white/20 text-xs md:text-sm uppercase tracking-widest mt-8 animate-pulse select-none"
        >
          Scroll to explore the journey
        </motion.p>
      </div>

      {/* SERVICE SELECTOR MODAL OVERLAY */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          {/* Dark backing overlay */}
          <div 
            className="absolute inset-0 bg-black/75 backdrop-blur-md cursor-pointer pointer-events-auto" 
            onClick={() => setIsServiceModalOpen(false)}
          />
          
          {/* Modal Card */}
          <div 
            className="relative w-full max-w-xl bg-zinc-900/90 border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl flex flex-col items-center justify-center text-center z-10 pointer-events-auto"
            style={{
              boxShadow: "0 0 50px rgba(0,0,0,0.8), inset 0 1px 0 0 rgba(255,255,255,0.05)"
            }}
          >
            {/* Title */}
            <span className="text-luxury-gold text-xs font-mono font-bold uppercase tracking-widest mb-2 block">
              select a service
            </span>
            <h3 className="text-2xl md:text-3xl font-black uppercase text-white font-display tracking-tight mb-3">
              What are you building?
            </h3>
            <p className="text-white/45 text-xs md:text-sm max-w-md leading-relaxed mb-8">
              Select a category below to instantly draft a customized message and start a chat on WhatsApp.
            </p>
            
            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-8">
              {services.map((s, idx) => {
                const IconComponent = s.icon;
                return (
                  <div
                    key={idx}
                    onClick={() => handleServiceClick(s.message)}
                    className="p-5 bg-white/[0.02] border border-white/[0.05] hover:border-luxury-gold/50 hover:bg-white/[0.04] transition-all duration-300 rounded-2xl cursor-pointer text-left flex items-start gap-4 group"
                  >
                    <IconComponent className="w-8 h-8 text-white/60 group-hover:text-luxury-gold group-hover:scale-110 transition-all duration-300 flex-shrink-0" />
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-bold uppercase text-white tracking-wider group-hover:text-luxury-gold transition-colors duration-300">
                        {s.title}
                      </span>
                      <span className="text-[11px] text-white/50 leading-normal font-sans">
                        {s.description}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Close button */}
            <button
              onClick={() => setIsServiceModalOpen(false)}
              className="px-6 py-2.5 bg-transparent border border-white/10 hover:border-white/20 text-white/60 hover:text-white font-mono text-[11px] uppercase tracking-widest rounded-full cursor-pointer transition-colors duration-200"
            >
              [ CLOSE ]
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
