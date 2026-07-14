import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-kanit)", "var(--font-inter)", "sans-serif"],
        display: ["var(--font-outfit)", "sans-serif"],
        kanit: ["var(--font-kanit)", "sans-serif"],
      },
      colors: {
        brand: {
          yellow: "var(--brand-yellow, #FFEDA8)",
        },
        luxury: {
          bg: "var(--luxury-bg, #050505)",
          gold: "var(--luxury-gold, #FFEDA8)", // metallic gold hue
          goldHover: "var(--luxury-gold-hover, #FFEDA8)", // lighter champagne gold
          gray: "var(--luxury-gray, #8e8e93)",
          border: "var(--luxury-border, rgba(255, 255, 255, 0.08))",
          glass: "var(--luxury-glass, rgba(5, 5, 5, 0.6))",
        },
      },
      letterSpacing: {
        'tightest': '-0.05em',
        'widest': '0.15em',
      },
    },
  },
  plugins: [],
};
export default config;
