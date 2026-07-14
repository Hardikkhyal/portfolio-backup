import { useEffect, useRef } from "react";

export interface MagneticConfig {
  id: string;
  element: HTMLElement;
  threshold: number;
  duration: number;
  offset: number;
  enabled: boolean;
}

const registry: MagneticConfig[] = [];
let isSnapping = false;
let cooldownActive = false;
let scrollTimeout: NodeJS.Timeout | null = null;
let globalListenerAdded = false;

// Smooth cubic/quartic-out easing curve for a gentler, more premium attraction feel
const smoothCubicOut = (t: number): number => 1 - Math.pow(1 - t, 3.5);

const startCooldown = () => {
  cooldownActive = true;
  setTimeout(() => {
    cooldownActive = false;
  }, 300); // 300ms cooldown
};

const evaluateSnapping = () => {
  if (isSnapping || cooldownActive) return;

  // Retrieve the global Lenis instance
  const lenis = (window as any).lenis;
  if (!lenis) return;

  // Check prefers-reduced-motion
  if (typeof window !== "undefined") {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) return;
  }

  const viewportHeight = window.innerHeight;
  const currentScroll = window.scrollY;

  let bestSection: MagneticConfig | null = null;
  let maxVisibility = 0;
  let targetScrollY = 0;

  // Find the section that has the highest visibility on screen
  for (const section of registry) {
    if (!section.enabled || !section.element) continue;

    const rect = section.element.getBoundingClientRect();
    const elementHeight = rect.height;

    // Calculate vertical pixels visible in the current viewport
    const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
    const denominator = Math.min(elementHeight, viewportHeight);

    // Proportion of section occupying the screen
    const visibility = Math.max(0, visibleHeight) / denominator;

    if (visibility > maxVisibility) {
      maxVisibility = visibility;
      bestSection = section;
      targetScrollY = currentScroll + rect.top + section.offset;
    }
  }

  // Only snap if the most visible section meets its threshold (e.g. 65% visible)
  if (bestSection && maxVisibility >= bestSection.threshold) {
    // If already aligned or extremely close, don't snap
    if (Math.abs(currentScroll - targetScrollY) < 3) {
      return;
    }

    // Trigger the magnetic attraction snap
    isSnapping = true;
    lenis.scrollTo(targetScrollY, {
      duration: bestSection.duration,
      easing: smoothCubicOut,
      onComplete: () => {
        isSnapping = false;
        startCooldown();
      },
    });
  }
};

const handleScroll = (lenis: any) => {
  // Do NOT evaluate snapping during active scrolling events.
  // Debounced check to ensure snaps trigger only when user stops scrolling.
  if (scrollTimeout) clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    evaluateSnapping();
  }, 150);
};

export function useMagneticScroll({
  threshold = 0.65,
  duration = 1.4,
  offset = 0,
  enabled = true,
}: Partial<Omit<MagneticConfig, "id" | "element">>) {
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    let active = true;
    let checkCount = 0;

    // Safely retrieve the Lenis instance when populated dynamically
    const initLenisListener = () => {
      const lenis = (window as any).lenis;
      if (lenis) {
        if (!globalListenerAdded) {
          globalListenerAdded = true;
          lenis.on("scroll", handleScroll);
        }
        return;
      }

      if (checkCount < 120 && active) {
        checkCount++;
        requestAnimationFrame(initLenisListener);
      }
    };

    initLenisListener();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const id = Math.random().toString(36).substring(2, 9);
    const element = elementRef.current;

    if (enabled && element) {
      registry.push({
        id,
        element,
        threshold,
        duration,
        offset,
        enabled,
      });
    }

    return () => {
      const idx = registry.findIndex((item) => item.id === id);
      if (idx !== -1) registry.splice(idx, 1);

      // Clean up the global event listener when last section unmounts
      if (registry.length === 0 && globalListenerAdded) {
        const lenis = (window as any).lenis;
        if (lenis) {
          lenis.off("scroll", handleScroll);
        }
        globalListenerAdded = false;
        if (scrollTimeout) {
          clearTimeout(scrollTimeout);
          scrollTimeout = null;
        }
      }
    };
  }, [enabled, threshold, duration, offset]);

  return elementRef;
}
