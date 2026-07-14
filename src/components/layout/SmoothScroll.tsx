"use client";

import { useEffect, useRef, ReactNode } from "react";
import gsap from "gsap";

interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<import("@studio-freight/lenis").default | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Respect prefers-reduced-motion
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) return;

    let lenisInstance: any;
    let rafCallback: (time: number) => void;

    Promise.all([
      import("gsap/ScrollTrigger"),
      import("@studio-freight/lenis")
    ]).then(([ { ScrollTrigger }, { default: Lenis } ]) => {
      
      gsap.registerPlugin(ScrollTrigger);

      lenisInstance = new Lenis({
        duration: 2.5, // Increased for a highly luxurious, slow, and soft deceleration curve
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        syncTouch: true,       // Force smooth touch interpolation to override native fast momentum on mobile!
        wheelMultiplier: 0.5,  // Dramatically reduce scroll speed per mouse click
        touchMultiplier: 0.5,  // Dramatically reduce touch swipe distance to prevent fast flying on phones
      });

      lenisRef.current = lenisInstance;
      (window as any).lenis = lenisInstance;

      lenisInstance.on('scroll', ScrollTrigger.update);

      rafCallback = (time: number) => {
        lenisInstance.raf(time * 1000);
      };

      gsap.ticker.add(rafCallback);
      gsap.ticker.lagSmoothing(0);
    });

    return () => {
      if (lenisInstance) {
        lenisInstance.destroy();
      }
      if (rafCallback) {
        gsap.ticker.remove(rafCallback);
      }
    };
  }, []);

  return <>{children}</>;
}
