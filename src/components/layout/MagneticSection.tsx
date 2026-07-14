"use client";

import React, { ReactNode } from "react";
import { useMagneticScroll } from "@/hooks/useMagneticScroll";

interface MagneticSectionProps {
  children: ReactNode;
  threshold?: number;
  duration?: number;
  offset?: number;
  enabled?: boolean;
  className?: string;
  id?: string;
}

/**
 * Reusable wrapper to apply smooth, premium magnetic scroll alignment using Lenis.
 */
export default function MagneticSection({
  children,
  threshold = 0.65,
  duration = 0.8,
  offset = 0,
  enabled = true,
  className = "",
  id,
}: MagneticSectionProps) {
  const elementRef = useMagneticScroll({
    threshold,
    duration,
    offset,
    enabled,
  });

  return (
    <section
      ref={elementRef as React.RefObject<HTMLDivElement>}
      id={id}
      className={`relative w-full ${className}`}
    >
      {children}
    </section>
  );
}
