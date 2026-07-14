"use client";

import React, { useRef, useMemo } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

// =========================================================================


interface FadeInProps {
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  className?: string;
  style?: React.CSSProperties;
  as?: string;
  children?: React.ReactNode;
}

export function FadeIn({
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  className,
  style,
  as = "div",
  children,
}: FadeInProps) {
  
  const Component = useMemo(() => {
    return typeof (motion as any).create === "function"
      ? (motion as any).create(as)
      : (motion as any)[as] || motion.div;
  }, [as]);

  const variants = {
    hidden: { opacity: 0, x, y },
    visible: { opacity: 1, x: 0, y: 0 },
  };

  return (
    <Component
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "50px", amount: 0 }}
      transition={{
        delay,
        duration,
        ease: [0.25, 0.1, 0.25, 1], 
      }}
      className={className}
      style={style}
    >
      {children}
    </Component>
  );
}




interface CharProps {
  char: string;
  index: number;
  totalChars: number;
  scrollYProgress: MotionValue<number>;
}

function Char({ char, index, totalChars, scrollYProgress }: CharProps) {
  const charProgress = index / totalChars;
  const start = Math.max(0, charProgress - 0.1);
  const end = Math.min(1, charProgress + 0.05);

  
  const opacity = useTransform(scrollYProgress, [start, end], [0.2, 1]);

  return (
    <span className="relative inline-block select-none">
      
      <span className="opacity-0">{char === " " ? "\u00A0" : char}</span>
      
      <motion.span style={{ opacity }} className="absolute top-0 left-0">
        {char === " " ? "\u00A0" : char}
      </motion.span>
    </span>
  );
}




export default function AboutMe() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: contentRef,
    offset: ["start 0.8", "end 0.2"],
  });

  const paragraphText =
    "With more than five years of experience in design, i focus on branding, web design, and user experience, i truly enjoy working with businesses that aim to stand out and present their best image. Let's build something incredible together!";

  const words = useMemo(() => paragraphText.split(" "), [paragraphText]);
  const totalRenderedChars = useMemo(() => paragraphText.replace(/ /g, "").length, [paragraphText]);

  return (
    <section
      ref={containerRef}
      className="relative w-full flex flex-col justify-start items-center px-5 sm:px-8 md:px-10 overflow-hidden z-20 mt-[-100vh]"
      style={{
        fontFamily: "'Kanit', sans-serif",
        backgroundColor: "var(--about-bg, #2c6b9e)",
        maskImage: "linear-gradient(to bottom, transparent 0vh, rgba(0,0,0,0.15) 20vh, rgba(0,0,0,0.55) 50vh, rgba(0,0,0,0.88) 80vh, black 100vh)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0vh, rgba(0,0,0,0.15) 20vh, rgba(0,0,0,0.55) 50vh, rgba(0,0,0,0.88) 80vh, black 100vh)"
      }}
    >
      {/* Spacer to allow Hero canvas to show through the transparent mask zone */}
      <div className="w-full h-screen pointer-events-none" />

      {/* Content wrapper */}
      <div
        ref={contentRef}
        id="about-me"
        className="relative z-10 max-w-[90%] md:max-w-[85%] w-full flex flex-col items-center justify-center gap-16 sm:gap-20 md:gap-24 text-center py-16 md:py-24 min-h-screen"
      >
        <div className="text-center w-full mb-10 relative z-30">
          <span 
            className="text-xs font-bold uppercase tracking-[0.25em] mb-3 block"
            style={{ color: "var(--about-tag-color, #FFEDA8)" }}
          >
            who I am
          </span>
          <h2 
            className="text-4xl md:text-6xl font-black uppercase tracking-tight font-display"
            style={{ color: "var(--about-title-color, #ffffff)" }}
          >
            About Me
          </h2>
          <div 
            className="h-[2px] w-16 mx-auto mt-6"
            style={{ backgroundColor: "var(--about-accent-line, #FFEDA8)" }}
          />
        </div>

        <div className="flex flex-col items-center gap-10 sm:gap-14 md:gap-16 w-full">
          <p
            className="limelight-regular font-medium text-center leading-relaxed max-w-none w-full"
            style={{
              fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
              fontFamily: '"Limelight", sans-serif',
              color: "var(--about-text-color, #ffffff)"
            }}
          >
            {(() => {
              let globalCharIndex = 0;
              return words.map((word, wordIdx) => {
                const chars = Array.from(word);
                return (
                  <React.Fragment key={wordIdx}>
                    <span className="inline-block whitespace-nowrap">
                      {chars.map((char) => {
                        const currentIndex = globalCharIndex++;
                        return (
                          <Char
                            key={currentIndex}
                            char={char}
                            index={currentIndex}
                            totalChars={totalRenderedChars}
                            scrollYProgress={scrollYProgress}
                          />
                        );
                      })}
                    </span>
                    {wordIdx < words.length - 1 && " "}
                  </React.Fragment>
                );
              });
            })()}
          </p>
        </div>
      </div>
    </section>
  );
}