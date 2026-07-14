import React from "react";

interface StampProps {
  className?: string;
  color?: string; // e.g. '#B22222'
}

export default function Stamp({ className = "", color = "#B22222" }: StampProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={`select-none pointer-events-none ${className}`}
      style={{
        color: color,
        fill: "currentColor",
        stroke: "currentColor",
      }}
    >
      <defs>
        {/* Distress filter to make it look like a distressed rubber stamp */}
        <filter id="distress-filter" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.08"
            numOctaves="4"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="3.5"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
        
        {/* Circle path for the text to wrap around */}
        <path
          id="text-path"
          d="M 100,100 m -68,0 a 68,68 0 1,1 136,0 a 68,68 0 1,1 -136,0"
          fill="none"
          stroke="none"
        />
      </defs>

      <g filter="url(#distress-filter)">
        {/* Outer Thick Border */}
        <circle cx="100" cy="100" r="80" fill="none" strokeWidth="4.5" />
        
        {/* Inner Thin Border */}
        <circle cx="100" cy="100" r="62" fill="none" strokeWidth="1.5" />
        
        {/* Circular text */}
        <text className="font-sans font-black tracking-widest text-[9.8px] uppercase">
          <textPath href="#text-path" startOffset="0%">
            HARDIKKHYAL • APPROVED • HARDIKKHYAL • APPROVED • 
          </textPath>
        </text>

        {/* Center Details */}
        {/* Checkmark */}
        <path
          d="M 82,95 L 94,107 L 118,80"
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Approved text */}
        <text
          x="100"
          y="126"
          textAnchor="middle"
          stroke="none"
          className="font-sans font-black text-[13px] tracking-[0.1em]"
        >
          APPROVED
        </text>
        
        {/* Est 2026 */}
        <text
          x="100"
          y="148"
          textAnchor="middle"
          stroke="none"
          className="font-mono font-bold text-[7.5px] tracking-[0.2em] opacity-80"
        >
          EST. 2026
        </text>
      </g>
    </svg>
  );
}
