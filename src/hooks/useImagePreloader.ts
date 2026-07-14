"use client";

import { useEffect, useState } from "react";

export function useImagePreloader(
  basePath: string,
  totalFrames: number,
  prefix: string = "",
  extension: string = "svg",
  padding: number = 4
) {
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    setIsLoaded(false);
    setProgress(0);

    let loadedCount = 0;
    const loadedImages: HTMLImageElement[] = [];

    const handleImageLoad = () => {
      loadedCount++;
      const currentProgress = Math.min(
        100,
        Math.round((loadedCount / totalFrames) * 100)
      );
      setProgress(currentProgress);

      if (loadedCount === totalFrames) {
        setIsLoaded(true);
      }
    };

    const handleImageError = (err: Event | string) => {
      console.warn("Failed to load an image in the sequence:", err);
      handleImageLoad();
    };

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      const paddedIndex = i.toString().padStart(padding, "0");
      img.onload = handleImageLoad;
      img.onerror = handleImageError;
      img.src = `${basePath}/${prefix}${paddedIndex}.${extension}`;
      loadedImages.push(img);
    }

    setImages(loadedImages);

    return () => {
      loadedImages.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [basePath, totalFrames, prefix, extension, padding]);

  return { images, isLoaded, progress };
}
