"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useImagePreloader } from "@/hooks/useImagePreloader";
import Overlay from "./Overlay";
import GridOverlay from "@/components/layout/GridOverlay";
import "./HeroScroll.css";

const TOTAL_FRAMES = 90;
const SEQUENCE_PATH = "/sequence-1";

export default function HeroScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentFrameRef = useRef(0);

  const [sequencePath, setSequencePath] = useState(SEQUENCE_PATH);

  // Monitor viewport size to select responsive sequence path
  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkMobile = () => {
      const isMobile = window.innerWidth < 768;
      setSequencePath(isMobile ? "/phonee" : SEQUENCE_PATH);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  
  const { images, isLoaded, progress } = useImagePreloader(
    sequencePath,
    TOTAL_FRAMES,
    "ezgif-frame-",
    "jpg",
    3
  );

  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  
  const frameIndex = useTransform(scrollYProgress, [0, 0.75], [0, TOTAL_FRAMES - 1], { clamp: true });

  
  const drawImageCover = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    x: number,
    y: number,
    w: number,
    h: number,
    offsetX = 0.5,
    offsetY = 0.5
  ) => {
    const iw = img.naturalWidth || img.width;
    const ih = img.naturalHeight || img.height;
    const r = Math.min(w / iw, h / ih);
    let nw = iw * r;
    let nh = ih * r;
    let cx = 0, cy = 0, cw = iw, ch = ih;

    if (nw < w) {
      const r2 = w / nw;
      nw = w;
      nh = nh * r2;
    }
    if (nh < h) {
      const r3 = h / nh;
      nh = h;
      nw = nw * r3;
    }

    cw = iw * (w / nw);
    ch = ih * (h / nh);

    cx = (iw - cw) * offsetX;
    cy = (ih - ch) * offsetY;

    if (cx < 0) cx = 0;
    if (cy < 0) cy = 0;
    if (cw > iw) cw = iw;
    if (ch > ih) ch = ih;

    ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h);
  };

  
  const renderFrame = useCallback(
    (index: number) => {
      const canvas = canvasRef.current;
      if (!canvas || images.length === 0) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const img = images[index];
      if (!img) return;

      currentFrameRef.current = index;

      
      drawImageCover(ctx, img, 0, 0, canvas.width, canvas.height);
    },
    [images]
  );

  
  useEffect(() => {
    if (!isLoaded || images.length === 0) return;

    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      renderFrame(currentFrameRef.current);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isLoaded, images, renderFrame]);

  
  useMotionValueEvent(frameIndex, "change", (latest) => {
    if (!isLoaded) return;
    const targetIndex = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.floor(latest)));

    
    requestAnimationFrame(() => {
      renderFrame(targetIndex);
    });
  });

  
  useEffect(() => {
    if (isLoaded && images.length > 0) {
      const currentIndex = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.floor(frameIndex.get())));
      renderFrame(currentIndex);
    }
  }, [isLoaded, images, renderFrame, frameIndex]);

  return (
    <>
      
      {!isLoaded && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center" style={{ backgroundColor: "var(--hero-loader-bg, #050505)" }}>
          <div className="flex flex-col items-center max-w-[17.5rem] w-full px-4 text-center">
            <span className="text-luxury-gold text-xs font-semibold uppercase tracking-widest mb-2 select-none">
              hardik khyal
            </span>
            <h3 className="text-white text-lg font-display font-light mb-8 select-none">
              Initializing Portfolio...
            </h3>
            
            <div className="w-full h-[1px] bg-white/10 relative overflow-hidden mb-3">
              <div
                className="h-full bg-luxury-gold transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-white/30 text-[0.625rem] tracking-widest font-mono select-none">
              {progress}% LOADED
            </span>
          </div>
        </div>
      )}

      
      <div ref={containerRef} id="home" data-hero-section className="relative h-[400vh] bg-transparent">
        
        <div className="sticky top-0 left-0 w-full h-[100dvh] overflow-hidden">
          
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full object-cover block will-change-transform z-10 hero-canvas"
          />

          
          {isLoaded && <Overlay scrollYProgress={scrollYProgress} />}

          
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/0 to-transparent pointer-events-none z-15" />

          
          <div
            className="absolute bottom-0 left-0 w-full h-[12.5rem] pointer-events-none z-15"
            style={{ background: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.6) 100%)" }}
          />
          <GridOverlay />
        </div>
      </div>
    </>
  );
}
