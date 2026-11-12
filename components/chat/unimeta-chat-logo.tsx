import React from "react";

export interface UniMetaChatLogoProps {
  className?: string;
  size?: number;
}

/**
 * UniMeta AI Assistant Logo
 * Faithful AI transformation of the official UniMeta visual identity:
 * - Symmetrical twin academic figures reaching upward with mortarboards
 * - Left figure in #4DB7F2, right figure in #0057C8
 * - Central 4-point academic star at the apex in #8AD8FF
 * - Two sleek, minimal digital AI eyes glowing in #8AD8FF
 * - Subtle digital spark & trace accents linking the figures
 * - Transparent background, crisp at small and large sizes
 */
export function UniMetaChatLogo({ className = "", size = 28 }: UniMetaChatLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        {/* Gradients matching UniMeta branding */}
        <linearGradient id="unimetaLeftFigure" x1="16" y1="20" x2="28" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7CD1FF" />
          <stop offset="50%" stopColor="#4DB7F2" />
          <stop offset="100%" stopColor="#2596D8" />
        </linearGradient>

        <linearGradient id="unimetaRightFigure" x1="36" y1="20" x2="48" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2575DC" />
          <stop offset="60%" stopColor="#0057C8" />
          <stop offset="100%" stopColor="#003D99" />
        </linearGradient>

        <linearGradient id="aiStarGlow" x1="32" y1="3" x2="32" y2="17" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#8AD8FF" />
          <stop offset="100%" stopColor="#4DB7F2" />
        </linearGradient>
      </defs>

      {/* ============================================================ */}
      {/* 1. CENTRAL RADIANT 4-POINT STAR (APEX) */}
      {/* ============================================================ */}
      <path
        d="M32 3.5L34.2 9.2L40 10.5L34.2 11.8L32 17.5L29.8 11.8L24 10.5L29.8 9.2L32 3.5Z"
        fill="url(#aiStarGlow)"
      />
      {/* Star Center Brightness */}
      <circle cx="32" cy="10.5" r="1.5" fill="#FFFFFF" />

      {/* ============================================================ */}
      {/* 2. LEFT FIGURE (Light Blue #4DB7F2 - Student / AI Navigator) */}
      {/* ============================================================ */}
      {/* Graduation Cap Mortarboard (Left) */}
      <path
        d="M21 16L12 18.5L21 21L29 18.5L21 16Z"
        fill="#4DB7F2"
      />
      <path
        d="M12.5 18.5V23.5L14 24.5V19"
        stroke="#7CD1FF"
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* Left Head */}
      <circle cx="21" cy="25" r="5" fill="url(#unimetaLeftFigure)" />

      {/* Left Sleek Digital AI Eye */}
      <ellipse cx="22" cy="24.8" rx="1.6" ry="1.2" fill="#8AD8FF" />
      <circle cx="22.3" cy="24.6" r="0.6" fill="#FFFFFF" />

      {/* Left Reaching Body & Dynamic Arm towards Star */}
      <path
        d="M21 31C24 33 27 28 31 16C28 26 23 37 13 46C18 43 21 39 21 35C21 39 19 46 12 59C17 53 23 46 25 38C26 34 26 32 25 30"
        fill="url(#unimetaLeftFigure)"
      />

      {/* ============================================================ */}
      {/* 3. RIGHT FIGURE (Deep Blue #0057C8 - Student / AI Core) */}
      {/* ============================================================ */}
      {/* Graduation Cap Mortarboard (Right) */}
      <path
        d="M43 16L52 18.5L43 21L35 18.5L43 16Z"
        fill="#0057C8"
      />
      <path
        d="M51.5 18.5V23.5L50 24.5V19"
        stroke="#4DB7F2"
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* Right Head */}
      <circle cx="43" cy="25" r="5" fill="url(#unimetaRightFigure)" />

      {/* Right Sleek Digital AI Eye */}
      <ellipse cx="42" cy="24.8" rx="1.6" ry="1.2" fill="#8AD8FF" />
      <circle cx="41.7" cy="24.6" r="0.6" fill="#FFFFFF" />

      {/* Right Reaching Body & Dynamic Arm towards Star */}
      <path
        d="M43 31C40 33 37 28 33 16C36 26 41 37 51 46C46 43 43 39 43 35C43 39 45 46 52 59C47 53 41 46 39 38C38 34 38 32 39 30"
        fill="url(#unimetaRightFigure)"
      />

      {/* ============================================================ */}
      {/* 4. SUBTLE AI DIGITAL SYNAPSE (The Intelligent Link) */}
      {/* ============================================================ */}
      {/* Minimal Digital Bridge Node connecting the figures */}
      <path
        d="M26 25C29 24 35 24 38 25"
        stroke="#8AD8FF"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeDasharray="2 3"
        opacity="0.9"
      />
      <circle cx="32" cy="24.5" r="1.3" fill="#8AD8FF" />

      {/* Ascending Data Sparkles */}
      <circle cx="30" cy="18" r="0.9" fill="#8AD8FF" opacity="0.85" />
      <circle cx="34" cy="18" r="0.9" fill="#8AD8FF" opacity="0.85" />
    </svg>
  );
}
