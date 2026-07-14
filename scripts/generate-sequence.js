const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'sequence-1');
const TOTAL_FRAMES = 60;

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log(`Generating ${TOTAL_FRAMES} SVG frames in ${OUTPUT_DIR}...`);

for (let i = 0; i < TOTAL_FRAMES; i++) {
  const t = i / (TOTAL_FRAMES - 1); // 0.0 to 1.0

  // Exponential scale for a realistic zoom acceleration (starts slow, ends fast)
  // At t=0, scale = 1.0. At t=1, scale = 22.0.
  const scale = 1.0 + Math.pow(t, 2.5) * 21.0;

  // Initial window dimensions (at scale = 1.0)
  const w0 = 420;
  const h0 = 580;
  const rx0 = 190; // Rounded corners of the plane window

  // Scaled dimensions
  const w = w0 * scale;
  const h = h0 * scale;
  const rx = rx0 * scale;

  // Centered coordinates
  const cx = 1920 / 2;
  const cy = 1080 / 2;
  const windowX = cx - w / 2;
  const windowY = cy - h / 2;

  // Parallax zoom for sky: sky scales up much slower than the window
  const skyScale = 1.0 + t * 0.35;
  const skyTranslateY = t * 60; // slight camera tilt upwards during zoom

  // Dynamic cloud parameters - drifting and scaling to simulate forward flight
  // Cloud A (left side)
  const scaleA = 1.0 + t * 1.6;
  const cxA = 350 - t * 450;
  const cyA = 600 + t * 150 - skyTranslateY;
  const rA = 320 * scaleA;

  // Cloud B (right side)
  const scaleB = 1.0 + t * 1.9;
  const cxB = 1550 + t * 500;
  const cyB = 450 + t * 100 - skyTranslateY;
  const rB = 360 * scaleB;

  // Cloud C (lower center)
  const scaleC = 1.0 + t * 2.3;
  const cxC = 960;
  const cyC = 880 + t * 550 - skyTranslateY;
  const rC = 460 * scaleC;

  // Opacity of window reflections - fades out as we zoom closer to the glass
  const glassOpacity = Math.max(0, 1.0 - t * 2.5);

  // Border stroke widths scale with the window to preserve proportions
  const strokeInner = 2 * scale;
  const strokeMetal = 7 * scale;
  const strokeShadow = 10 * scale;

  const gap1 = 4 * scale;
  const gap2 = 10 * scale;

  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
  <defs>
    <!-- Rich twilight/sunset sky gradient -->
    <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#020307" />
      <stop offset="30%" stop-color="#090d22" />
      <stop offset="55%" stop-color="#191535" />
      <stop offset="78%" stop-color="#3c2a4d" />
      <stop offset="92%" stop-color="#76454a" />
      <stop offset="100%" stop-color="#d99f59" />
    </linearGradient>

    <!-- Glowing sunset cloud gradient -->
    <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.25" />
      <stop offset="35%" stop-color="#ffcc80" stop-opacity="0.18" />
      <stop offset="70%" stop-color="#a6718a" stop-opacity="0.08" />
      <stop offset="100%" stop-color="#3c2a4d" stop-opacity="0" />
    </linearGradient>

    <!-- Matte luxury cabin wall gradient -->
    <linearGradient id="cabinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#161719" />
      <stop offset="50%" stop-color="#0d0e10" />
      <stop offset="100%" stop-color="#050506" />
    </linearGradient>

    <!-- Cabin wall vignette for luxury depth -->
    <radialGradient id="cabinVignette" cx="50%" cy="50%" r="50%">
      <stop offset="65%" stop-color="#000000" stop-opacity="0" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0.85" />
    </radialGradient>

    <!-- 3D Window metallic frame gradient -->
    <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#333336" />
      <stop offset="15%" stop-color="#ffffff" stop-opacity="0.2" />
      <stop offset="50%" stop-color="#1d1d1f" />
      <stop offset="85%" stop-color="#ffffff" stop-opacity="0.1" />
      <stop offset="100%" stop-color="#0a0a0b" />
    </linearGradient>

    <!-- Inner rim reflection highlight -->
    <linearGradient id="innerRimGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0.7" />
    </linearGradient>

    <!-- Mask: White is solid (cabin wall), Black is cutout hole -->
    <mask id="windowMask">
      <rect width="1920" height="1080" fill="white" />
      <rect x="${windowX}" y="${windowY}" width="${w}" height="${h}" rx="${rx}" ry="${rx}" fill="black" />
    </mask>

    <!-- Glass reflection clipping to keep it inside the window -->
    <clipPath id="windowClip">
      <rect x="${windowX}" y="${windowY}" width="${w}" height="${h}" rx="${rx}" ry="${rx}" />
    </clipPath>

    <!-- High-radius blur for realistic fluffy clouds -->
    <filter id="cloudBlur" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="50" />
    </filter>
  </defs>

  <!-- 1. Sky and Parallax Horizon (Rendered behind the cutout) -->
  <g transform="translate(0, ${skyTranslateY}) scale(${skyScale}) translate(${(1920 - 1920 * skyScale) / 2}, ${(1080 - 1080 * skyScale) / 2})">
    <!-- Sky Base -->
    <rect width="1920" height="1080" fill="url(#skyGrad)" />
    
    <!-- Horizon Glow -->
    <ellipse cx="960" cy="1080" rx="1200" ry="120" fill="#f5c282" opacity="0.15" filter="url(#cloudBlur)" />

    <!-- Fluffy Sunset Clouds -->
    <circle cx="${cxC}" cy="${cyC}" r="${rC}" fill="url(#cloudGrad)" filter="url(#cloudBlur)" />
    <circle cx="${cxA}" cy="${cyA}" r="${rA}" fill="url(#cloudGrad)" filter="url(#cloudBlur)" />
    <circle cx="${cxB}" cy="${cyB}" r="${rB}" fill="url(#cloudGrad)" filter="url(#cloudBlur)" />
  </g>

  <!-- 2. Glass Reflections (Visible only inside the window hole, fading out on close zoom) -->
  <g clip-path="url(#windowClip)" opacity="${glassOpacity}">
    <!-- Diagonal Reflection Streaks -->
    <path d="M 500 -100 L 1400 1200" stroke="#ffffff" stroke-width="120" opacity="0.012" />
    <path d="M 650 -100 L 1250 1200" stroke="#ffffff" stroke-width="40" opacity="0.015" />
    <path d="M 300 -100 L 1050 1200" stroke="#ffffff" stroke-width="20" opacity="0.008" />
  </g>

  <!-- 3. Cabin Wall (Masked to reveal sky through the window) -->
  <rect width="1920" height="1080" fill="url(#cabinGrad)" mask="url(#windowMask)" />
  <rect width="1920" height="1080" fill="url(#cabinVignette)" mask="url(#windowMask)" />

  <!-- 4. 3D Window Frame Details (Drawn on top of the cutout borders, scaling with the zoom) -->
  <!-- Outer Shadow Frame (recedes, only drawn if visible on screen) -->
  ${scale < 18 ? `
  <rect x="${windowX - gap2}" y="${windowY - gap2}" width="${w + gap2 * 2}" height="${h + gap2 * 2}" rx="${rx + gap2}" ry="${rx + gap2}" 
        fill="none" stroke="#000000" stroke-width="${strokeShadow}" opacity="0.6" />
  ` : ''}

  <!-- Metallic Mid Frame -->
  ${scale < 16 ? `
  <rect x="${windowX - gap1}" y="${windowY - gap1}" width="${w + gap1 * 2}" height="${h + gap1 * 2}" rx="${rx + gap1}" ry="${rx + gap1}" 
        fill="none" stroke="url(#metalGrad)" stroke-width="${strokeMetal}" />
  ` : ''}

  <!-- Inner Reflection Rim -->
  ${scale < 15 ? `
  <rect x="${windowX}" y="${windowY}" width="${w}" height="${h}" rx="${rx}" ry="${rx}" 
        fill="none" stroke="url(#innerRimGrad)" stroke-width="${strokeInner}" />
  ` : ''}
</svg>`;

  const filename = `${(i + 1).toString().padStart(4, '0')}.svg`;
  fs.writeFileSync(path.join(OUTPUT_DIR, filename), svgContent);
}

console.log(`Successfully generated ${TOTAL_FRAMES} frames!`);
