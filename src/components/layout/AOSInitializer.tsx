"use client";

import { useEffect } from "react";

export default function AOSInitializer() {
  useEffect(() => {
    // Load AOS script dynamically from CDN
    const script = document.createElement("script");
    script.src = "https://unpkg.com/aos@next/dist/aos.js";
    script.async = true;
    script.onload = () => {
      // @ts-ignore
      if (window.AOS) {
        // @ts-ignore
        window.AOS.init({
          duration: 1000,
          once: true, // Only animate once when scrolling down
          offset: 120, // Trigger animation 120px before the element enters the viewport
          easing: "ease-out-cubic",
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return null;
}
