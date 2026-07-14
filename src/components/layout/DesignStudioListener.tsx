"use client";

import { useEffect } from "react";

export default function DesignStudioListener() {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Ensure we only accept messages from localhost:5000 (Design Studio)
      if (event.origin !== "http://localhost:5000") return;

      const { type, token, value } = event.data || {};
      if (type === "SET_TOKEN_VALUE" && token) {
        document.documentElement.style.setProperty(token, value);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return null;
}
