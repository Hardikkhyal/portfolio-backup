import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Standardized Lenis exponential easing curve for ultra-smooth, responsive deceleration across all components
export const LENIS_EASING = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t));
export const LENIS_DEFAULT_DURATION = 1.2;

