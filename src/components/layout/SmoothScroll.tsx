"use client";

import { useEffect, useRef, ReactNode } from "react";
import gsap from "gsap";
import { LENIS_EASING, LENIS_DEFAULT_DURATION } from "@/lib/utils";

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
        duration: LENIS_DEFAULT_DURATION,
        easing: LENIS_EASING,
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        syncTouch: false,      // Allow native smooth touch momentum on mobile devices
        wheelMultiplier: 1.0,  // Standard responsive 1:1 scroll speed
        touchMultiplier: 1.0,  // Standard responsive touch sensitivity
      });

      lenisRef.current = lenisInstance;
      (window as any).lenis = lenisInstance;

      lenisInstance.on('scroll', ScrollTrigger.update);

      rafCallback = (time: number) => {
        lenisInstance.raf(time * 1000);
      };

      gsap.ticker.add(rafCallback);
      gsap.ticker.lagSmoothing(500, 33); // Enable GSAP lag smoothing recovery for smooth rendering under load
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
