"use client";

import React, { useState, useEffect, useRef } from "react";

// GLOBAL CONFIGURATION FLAG
const SHOW_LAYOUT_GRID = false;

// CONFIGURABLE VALUES
const GRID_CONFIG = {
  cellSize: 8, // Fine grid spacing (in px)
  mediumInterval: 4, // 32px (4 * 8px)
  majorInterval: 16, // 128px (16 * 8px)

  // Color: Neutral blue-gray (slate)
  gridColor: "148, 163, 184",
  fineOpacity: 0.04, // 4-6%
  mediumOpacity: 0.08, // 8-10%
  majorOpacity: 0.20, // 18-22%
  majorStrokeWidth: 1.25,

  // Columns
  columnColor: "255, 237, 168", // Gold color for columns (RGB)
  columnBorderOpacity: 0.04,
  columnBgOpacity: 0.005,

  // Safe Zone (Red Guide)
  safeZoneColor: "239, 68, 68", // Red-500 (RGB)
  safeZoneOpacity: 0.30,
};

// Global controller for hotkeys and sync classes on body
export function GridController() {
  const [isVisible, setIsVisible] = useState(true);
  const [isForeground, setIsForeground] = useState(false); // Default to background layer

  useEffect(() => {
    if (!SHOW_LAYOUT_GRID) return;
    if (isVisible) {
      document.body.classList.add("show-layout-grid");
    } else {
      document.body.classList.remove("show-layout-grid");
    }
  }, [isVisible]);

  useEffect(() => {
    if (!SHOW_LAYOUT_GRID) return;
    if (isForeground) {
      document.body.classList.add("layout-grid-foreground");
    } else {
      document.body.classList.remove("layout-grid-foreground");
    }
  }, [isForeground]);

  useEffect(() => {
    if (!SHOW_LAYOUT_GRID) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle visibility with 'G' or 'g'
      if (
        e.key.toLowerCase() === "g" &&
        !(document.activeElement instanceof HTMLInputElement) &&
        !(document.activeElement instanceof HTMLTextAreaElement) &&
        !document.activeElement?.hasAttribute("contenteditable")
      ) {
        setIsVisible((prev) => !prev);
      }

      // Toggle foreground/background layering with 'F' or 'f'
      if (
        e.key.toLowerCase() === "f" &&
        !(document.activeElement instanceof HTMLInputElement) &&
        !(document.activeElement instanceof HTMLTextAreaElement) &&
        !document.activeElement?.hasAttribute("contenteditable")
      ) {
        setIsForeground((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (!SHOW_LAYOUT_GRID) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-[9999] p-2 rounded-lg bg-zinc-950/90 border border-white/10 text-white/50 text-[10px] font-mono transition-all pointer-events-auto backdrop-blur-sm shadow-xl flex flex-col gap-1 select-none w-36">
      <div className="flex items-center justify-between border-b border-white/5 pb-1 mb-1">
        <span className="font-bold text-[#FFEDA8]">Grid Guide</span>
        <span className={`w-2 h-2 rounded-full ${isVisible ? "bg-emerald-500 animate-pulse" : "bg-zinc-600"}`} />
      </div>
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="flex justify-between items-center hover:text-white transition-colors"
      >
        <span>Visibility [G]</span>
        <span className="text-[#FFEDA8]">{isVisible ? "ON" : "OFF"}</span>
      </button>
      <button
        onClick={() => setIsForeground(!isForeground)}
        className="flex justify-between items-center hover:text-white transition-colors"
      >
        <span>Layer [F]</span>
        <span className="text-[#FFEDA8]">{isForeground ? "FORE" : "BACK"}</span>
      </button>
    </div>
  );
}

// Section-level grid layout component with global scroll offset-alignment
export default function GridOverlay() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [yOffset, setYOffset] = useState(0);
  const [startRow, setStartRow] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!SHOW_LAYOUT_GRID) return;
    const updatePositionAndDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const absoluteTop = rect.top + scrollTop;

        // Align to 128px modular grid
        const offset = absoluteTop % 128;
        setYOffset(-offset);

        // Compute starting row index
        const row = Math.floor(absoluteTop / 128);
        setStartRow(row);

        setDimensions({
          width: rect.width,
          height: rect.height,
        });
      }
    };

    updatePositionAndDimensions();

    // Add event listeners to re-calculate offset on window resize or load
    window.addEventListener("resize", updatePositionAndDimensions);
    window.addEventListener("load", updatePositionAndDimensions);

    // Run after a short delay to account for any layout shifts/image loading after initial mount
    const delayTimer = setTimeout(updatePositionAndDimensions, 300);

    return () => {
      window.removeEventListener("resize", updatePositionAndDimensions);
      window.removeEventListener("load", updatePositionAndDimensions);
      clearTimeout(delayTimer);
    };
  }, []);

  if (!SHOW_LAYOUT_GRID) {
    return null;
  }

  const fineSize = GRID_CONFIG.cellSize;
  const mediumSize = GRID_CONFIG.cellSize * GRID_CONFIG.mediumInterval;
  const majorSize = GRID_CONFIG.cellSize * GRID_CONFIG.majorInterval;

  const rgb = GRID_CONFIG.gridColor;
  const stroke = GRID_CONFIG.majorStrokeWidth;

  // CSS background gradient setup for square modular grid
  const backgroundStyle = {
    backgroundImage: `
      /* Major modular boxes (${majorSize}px) */
      linear-gradient(to right, rgba(${rgb}, ${GRID_CONFIG.majorOpacity}) ${stroke}px, transparent ${stroke}px),
      linear-gradient(to bottom, rgba(${rgb}, ${GRID_CONFIG.majorOpacity}) ${stroke}px, transparent ${stroke}px),
      
      /* Medium grid (${mediumSize}px) */
      linear-gradient(to right, rgba(${rgb}, ${GRID_CONFIG.mediumOpacity}) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(${rgb}, ${GRID_CONFIG.mediumOpacity}) 1px, transparent 1px),
      
      /* Fine grid (${fineSize}px) */
      linear-gradient(to right, rgba(${rgb}, ${GRID_CONFIG.fineOpacity}) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(${rgb}, ${GRID_CONFIG.fineOpacity}) 1px, transparent 1px)
    `,
    backgroundSize: `
      ${majorSize}px ${majorSize}px, ${majorSize}px ${majorSize}px,
      ${mediumSize}px ${mediumSize}px, ${mediumSize}px ${mediumSize}px,
      ${fineSize}px ${fineSize}px, ${fineSize}px ${fineSize}px
    `,
    backgroundPosition: `0px ${yOffset}px`,
  };

  const numCols = 9;
  const numRows = Math.ceil((dimensions.height + Math.abs(yOffset)) / 128);

  return (
    <div
      ref={containerRef}
      className="grid-overlay-container absolute inset-0 w-full pointer-events-none select-none overflow-hidden"
      style={{
        height: "100%",
        minHeight: "100%",
      }}
    >
      {/* Blueprint Modular Squares */}
      <div className="absolute inset-0 w-full h-full" style={backgroundStyle} />

      {/* Safe Zone Guide & Layout Columns */}
      <div className="relative h-full w-full max-w-6xl mx-auto px-6">

        {/* Global Safe Zone Red Guide */}
        <div
          className="absolute inset-y-0 left-6 right-6 pointer-events-none"
          style={{
            borderLeft: `1.5px solid rgba(${GRID_CONFIG.safeZoneColor}, ${GRID_CONFIG.safeZoneOpacity})`,
            borderRight: `1.5px solid rgba(${GRID_CONFIG.safeZoneColor}, ${GRID_CONFIG.safeZoneOpacity})`,
          }}
        />

        {/* Responsive Layout Columns */}
        <div className="absolute inset-y-0 left-6 right-6 grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className={`h-full ${i >= 4 ? "hidden md:block" : ""} ${i >= 8 ? "hidden lg:block" : ""}`}
              style={{
                borderLeft: `1px solid rgba(${GRID_CONFIG.columnColor}, ${GRID_CONFIG.columnBorderOpacity})`,
                borderRight: `1px solid rgba(${GRID_CONFIG.columnColor}, ${GRID_CONFIG.columnBorderOpacity})`,
                backgroundColor: `rgba(${GRID_CONFIG.columnColor}, ${GRID_CONFIG.columnBgOpacity})`,
              }}
            />
          ))}
        </div>

        {/* Major Grid Numbering (aligned to global coordinate index) */}
        <div
          className="absolute left-6 right-6 top-0 grid pointer-events-none"
          style={{
            gridTemplateColumns: `repeat(${numCols}, 128px)`,
            gridTemplateRows: `repeat(${numRows}, 128px)`,
            height: "100%",
            transform: `translateY(${yOffset}px)`,
          }}
        >
          {Array.from({ length: Math.min(numCols * numRows, 1500) }).map((_, i) => {
            const col = (i % numCols) + 1;
            const localRow = Math.floor(i / numCols);
            const globalRowIndex = startRow + localRow + 1;
            return (
              <div key={i} className="relative w-[128px] h-[128px]">
                <span
                  className="absolute top-1.5 left-1.5 text-[8px] font-mono font-bold select-none"
                  style={{ color: "rgba(239, 68, 68, 0.45)" }}
                >
                  {globalRowIndex}-{col}
                </span>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
