import type { Metadata } from "next";
import { Inter, Outfit, Kanit } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/layout/SmoothScroll";
import GridOverlay, { GridController } from "@/components/layout/GridOverlay";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const kanit = Kanit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-kanit",
});

export const metadata: Metadata = {
  title: "Hardik Khyal | Premium Full-Stack Developer & Designer",
  description: "Welcome to the portfolio of Hardik Khyal, a premium full-stack developer and designer crafting high-performance digital experiences.",
  keywords: ["Hardik Khyal", "portfolio", "full-stack developer", "software engineer", "luxury web design", "Next.js portfolio"],
  authors: [{ name: "Hardik Khyal" }],
  openGraph: {
    title: "Hardik Khyal | Creative Developer Portfolio",
    description: "Bespoke digital experiences, curated for the modern web.",
    type: "website",
  },
};

import fs from "fs";
import path from "path";
import DesignStudioListener from "@/components/layout/DesignStudioListener";
import AOSInitializer from "@/components/layout/AOSInitializer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Load local theme values from file system
  let theme: Record<string, string> = {};
  try {
    const currentPath = path.resolve(process.cwd(), "themes/current.json");
    if (fs.existsSync(currentPath)) {
      theme = JSON.parse(fs.readFileSync(currentPath, "utf-8"));
    } else {
      const luxuryPath = path.resolve(process.cwd(), "themes/luxury.json");
      if (fs.existsSync(luxuryPath)) {
        theme = JSON.parse(fs.readFileSync(luxuryPath, "utf-8"));
      }
    }
  } catch (e) {
    console.warn("Theme loading failed, falling back to CSS defaults", e);
  }

  const themeStyle = `:root { ${Object.entries(theme)
    .map(([k, v]) => `${k}: ${v};`)
    .join(" ")} }`;

  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} ${kanit.variable} dark`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://use.typekit.net" crossOrigin="anonymous" />
        
        {/* Preload fonts to start downloading early */}
        <link rel="preload" href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700;800;900&display=swap" as="style" />
        <link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,100..900;1,100..900&family=League+Gothic:wdth@80&family=Ms+Madi&display=swap" as="style" />
        <link rel="preload" href="https://fonts.googleapis.com/css2?family=Fleur+De+Leah&family=Lavishly+Yours&family=Limelight&family=Mea+Culpa&display=swap" as="style" />
        <link rel="preload" href="https://use.typekit.net/kxo3pgz.css" as="style" />
        <link rel="preload" href="https://use.typekit.net/cwg6wqv.css" as="style" />

        {/* Load fonts */}
        <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,100..900;1,100..900&family=League+Gothic:wdth@80&family=Ms+Madi&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Fleur+De+Leah&family=Lavishly+Yours&family=Limelight&family=Mea+Culpa&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://use.typekit.net/kxo3pgz.css" />
        <link rel="stylesheet" href="https://use.typekit.net/cwg6wqv.css" />

        {/* Load AOS stylesheet from CDN */}
        <link rel="stylesheet" href="https://unpkg.com/aos@next/dist/aos.css" />

        {/* Inject visual theme design tokens directly into root */}
        <style dangerouslySetInnerHTML={{ __html: themeStyle }} />
      </head>
      <body className="font-sans antialiased bg-luxury-bg text-white selection:bg-white/10 select-none relative">
        <SmoothScroll>
          {children}
        </SmoothScroll>
        <GridController />

        {/* Initialize AOS scroll animations */}
        <AOSInitializer />

        {/* Listen for visual token customizer values only in local dev environment */}
        {process.env.NODE_ENV === "development" && <DesignStudioListener />}
      </body>
    </html>
  );
}
