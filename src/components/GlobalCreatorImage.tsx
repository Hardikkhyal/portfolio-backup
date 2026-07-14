"use client";
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

export default function GlobalCreatorImage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const img = imgRef.current;
    if (!container || !img) return;

    const ctx = gsap.context(() => {
      // 1. Sync with Panel 1 during the Experiment pin.
      // Panel 1 effectively translates from -302vh to 0vh.
      gsap.set(container, { y: "-302vh" });
      
      gsap.to(container, {
        y: "0vh",
        ease: "none",
        scrollTrigger: {
          trigger: "#experiment-section",
          start: "top -2px",
          end: "+=302vh",
          scrub: 1,
        }
      });

      // 2. Drop the image down into the ClientOverview section as it enters
      gsap.to(img, {
        y: "40vh",
        ease: "power1.out",
        scrollTrigger: {
          trigger: "#client-overview",
          start: "top bottom", // when ClientOverview enters from bottom
          end: "top top",      // when it reaches the top
          scrub: 1,
        }
      });

      // 3. Scroll away normally with the page once ClientOverview is fully scrolled
      gsap.to(container, {
        y: "-150vh",
        ease: "none",
        scrollTrigger: {
          trigger: "#client-overview",
          start: "top top",
          end: "bottom top",
          scrub: true,
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed top-0 right-4 md:right-16 z-50 w-64 md:w-96 lg:w-[32rem] pointer-events-none h-screen flex items-center justify-center"
    >
      <Image
        ref={imgRef}
        src="/about/img4.jpg"
        alt="Creator Graphic"
        width={1000}
        height={1000}
        className="w-full h-auto object-contain drop-shadow-2xl"
      />
    </div>
  );
}
