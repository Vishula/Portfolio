"use client";

import { useEffect, useRef } from "react";

// Hero poster: a CRT-headed robot in a blue hoodie holding a small upload cloud, on a pale card.
// Flat colour, bold outlines, kept to the site palette: greys plus the accent blue. Layers drift
// with the pointer for depth; the ha-* classes in globals.css animate the details, slowly and
// quietly (calm mode and reduced motion switch them off).

const O = "#16182d"; // outline
const BLUE = "#2b6be8";
const BLUE_DARK = "#1d4fb8";
const STEEL = "#d9dfea"; // robotic hand, small details
const GLOW = "#9cc0ff"; // screen and lights
const CARD = "#eef3fb";
const SHELL = "#f6f7fa"; // CRT casing
const GREY = "#a3adbf"; // knobs and buttons

const layer = (depth: number) => ({
  transform: `translate(calc(var(--mx, 0) * ${depth}px), calc(var(--my, 0) * ${depth * 0.7}px))`,
  transition: "transform 0.6s cubic-bezier(0.2, 0.7, 0.2, 1)",
});

const TERMINAL = ["> whoami", "vish", "> status", "open_to_work", "✓ cloud eng"];

export default function HeroArt() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const mx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2)));
      const my = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2)));
      el.style.setProperty("--mx", mx.toFixed(3));
      el.style.setProperty("--my", my.toFixed(3));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div ref={ref} className="hero-art pointer-events-none relative mx-auto w-full max-w-[440px]" aria-hidden="true">
      <svg viewBox="0 0 400 500" width="100%" height="100%" overflow="visible">
        <defs>
          <radialGradient id="ha-metal" cx="0.35" cy="0.3" r="0.8">
            <stop offset="0" stopColor="#f2f4f7" />
            <stop offset="0.6" stopColor="#a9b0bd" />
            <stop offset="1" stopColor="#6c7384" />
          </radialGradient>
          <radialGradient id="ha-screen" cx="0.5" cy="0.45" r="0.7">
            <stop offset="0" stopColor="#1a3566" />
            <stop offset="1" stopColor="#0b1530" />
          </radialGradient>
          <linearGradient id="ha-hood" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#3b7bf2" />
            <stop offset="1" stopColor={BLUE_DARK} />
          </linearGradient>
          <pattern id="ha-dots" width="9" height="9" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.6" fill={O} />
          </pattern>
          <radialGradient id="ha-fade" cx="0.15" cy="0.9" r="0.6">
            <stop offset="0" stopColor="#fff" />
            <stop offset="1" stopColor="#000" />
          </radialGradient>
          <mask id="ha-dotmask">
            <rect width="400" height="500" fill="url(#ha-fade)" />
          </mask>
          <clipPath id="ha-card">
            <rect x="8" y="8" width="384" height="484" rx="30" />
          </clipPath>
          <clipPath id="ha-screenclip">
            <rect x="140" y="176" width="104" height="80" rx="12" />
          </clipPath>
        </defs>

        {/* poster card */}
        <rect x="8" y="8" width="384" height="484" rx="30" fill={CARD} stroke="#dbe3f1" strokeWidth="1.5" />
        <g clipPath="url(#ha-card)">
          <rect width="400" height="500" fill="url(#ha-dots)" opacity="0.08" mask="url(#ha-dotmask)" />
          <path d="M8 120 C 120 90, 280 150, 392 110" fill="none" stroke="#fff" strokeWidth="2" opacity="0.35" />
          <text x="356" y="470" fontFamily="ui-monospace, Menlo, monospace" fontSize="10" fontWeight="700" fill={O} opacity="0.5" textAnchor="end">
            SYS/OPS — 2026
          </text>
        </g>

        {/* figure */}
        <g style={layer(5)}>
          {/* cables behind the hood */}
          <g className="ha-sway">
            <path d="M104 236 C 86 280, 120 320, 160 334" fill="none" stroke={O} strokeWidth="7" strokeLinecap="round" />
            <path d="M104 236 C 86 280, 120 320, 160 334" fill="none" stroke={BLUE} strokeWidth="4" strokeLinecap="round" />
          </g>
          <path d="M276 250 C 300 290, 284 318, 246 332" fill="none" stroke={O} strokeWidth="5" strokeLinecap="round" />

          {/* hoodie */}
          <path d="M52 500 L 64 420 C 72 372, 116 346, 168 340 L 232 340 C 284 346, 328 372, 336 420 L 348 500 Z" fill="url(#ha-hood)" stroke={O} strokeWidth="3" strokeLinejoin="round" />
          <path d="M300 392 C 312 420, 316 452, 314 500 M110 470 C 120 440, 142 420, 170 410" fill="none" stroke={BLUE_DARK} strokeWidth="2.5" strokeLinecap="round" />
          {/* chest patch */}
          <g transform="rotate(-3 254 418)">
            <rect x="214" y="392" width="82" height="54" rx="3" fill="#fff" stroke={O} strokeWidth="2.5" />
            <rect x="214" y="434" width="82" height="12" fill={BLUE} stroke={O} strokeWidth="2.5" />
            <text x="222" y="408" fontFamily="ui-monospace, Menlo, monospace" fontSize="9" fontWeight="700" fill={O}>
              UPTIME
            </text>
            <text x="222" y="424" fontFamily="ui-monospace, Menlo, monospace" fontSize="12" fontWeight="700" fill={O}>
              99.98%
            </text>
            <circle cx="282" cy="410" r="7" fill="none" stroke={O} strokeWidth="2" />
            <path d="M279 410 l2 2 l4 -4" fill="none" stroke={O} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </g>

          {/* neck */}
          <rect x="186" y="284" width="28" height="56" rx="4" fill="#4a5070" stroke={O} strokeWidth="3" />
          <path d="M186 298 h28 M186 310 h28 M186 322 h28" stroke={O} strokeWidth="2" />
          {/* hood collar and strings */}
          <path d="M146 344 C 146 318, 254 318, 254 344 C 254 362, 146 362, 146 344 Z" fill={BLUE_DARK} stroke={O} strokeWidth="3" />
          <ellipse cx="200" cy="338" rx="36" ry="9" fill="#0f1530" />
          <path d="M182 354 L 178 398 M218 354 L 222 396" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="175" y="396" width="6" height="10" rx="2" fill="#fff" stroke={O} strokeWidth="1.5" />
          <rect x="219" y="394" width="6" height="10" rx="2" fill="#fff" stroke={O} strokeWidth="1.5" />

          {/* CRT head */}
          <g className="ha-head">
            <path d="M162 150 L 146 100 M238 150 L 258 94" stroke={O} strokeWidth="3" strokeLinecap="round" />
            <circle className="ha-led" cx="146" cy="97" r="5.5" fill={BLUE} stroke={O} strokeWidth="2" />
            <circle className="ha-led ha-led-b" cx="258" cy="91" r="5.5" fill={GLOW} stroke={O} strokeWidth="2" />
            <circle cx="112" cy="222" r="20" fill="url(#ha-metal)" stroke={O} strokeWidth="3" />
            <circle cx="112" cy="222" r="11" fill="none" stroke={O} strokeWidth="2" />
            <circle cx="112" cy="222" r="4" fill={BLUE} stroke={O} strokeWidth="1.5" />
            <rect x="115" y="150" width="170" height="140" rx="22" fill={SHELL} stroke={O} strokeWidth="3" />
            <path d="M262 152 C 278 156, 284 166, 284 180 L 284 268 C 284 280, 276 288, 264 289" fill="none" stroke="#d5dbe6" strokeWidth="8" opacity="0.7" />
            <rect x="132" y="168" width="120" height="96" rx="16" fill="#2a2f45" stroke={O} strokeWidth="3" />
            <rect x="140" y="176" width="104" height="80" rx="12" fill="url(#ha-screen)" />
            <g clipPath="url(#ha-screenclip)">
              <g className="ha-face">
                <rect className="ha-blink" x="166" y="198" width="12" height="16" fill={GLOW} />
                <rect className="ha-blink" x="206" y="198" width="12" height="16" fill={GLOW} />
                {[
                  [174, 228],
                  [180, 232],
                  [186, 234],
                  [192, 234],
                  [198, 232],
                  [204, 228],
                ].map(([x, y]) => (
                  <rect key={x} x={x} y={y} width="6" height="4" fill={GLOW} />
                ))}
              </g>
              <g className="ha-term" fontFamily="ui-monospace, Menlo, monospace" fontSize="8.5" fill={GLOW}>
                {TERMINAL.map((t, i) => (
                  <text key={t} x="148" y={192 + i * 13}>
                    {t}
                  </text>
                ))}
              </g>
              <rect className="ha-scan" x="140" y="176" width="104" height="6" fill="#fff" opacity="0.08" />
            </g>
            <ellipse cx="164" cy="186" rx="16" ry="5" fill="#fff" opacity="0.12" />
            <circle cx="268" cy="190" r="7" fill={BLUE} stroke={O} strokeWidth="2.5" />
            <circle cx="268" cy="214" r="7" fill={GREY} stroke={O} strokeWidth="2.5" />
            <path d="M260 238 h16 M260 246 h16 M260 254 h16 M260 262 h16" stroke={O} strokeWidth="2" strokeLinecap="round" />
            <rect x="150" y="272" width="22" height="8" rx="2" fill={GREY} stroke={O} strokeWidth="2" />
          </g>
        </g>

        {/* near layer: arm, robotic hand, cloud */}
        <g style={layer(9)}>
          <path d="M110 444 C 86 412, 72 372, 76 338" fill="none" stroke={O} strokeWidth="47" strokeLinecap="round" />
          <path d="M110 444 C 86 412, 72 372, 76 338" fill="none" stroke={BLUE} strokeWidth="41" strokeLinecap="round" />
          <g transform="rotate(-6 76 334)">
            <rect x="54" y="326" width="44" height="16" rx="5" fill={BLUE_DARK} stroke={O} strokeWidth="3" />
            <path d="M62 328 v12 M70 328 v12 M78 328 v12 M86 328 v12" stroke={O} strokeWidth="1.5" opacity="0.6" />
          </g>
          <g transform="rotate(-6 76 304)">
            <path d="M47 300 L 38 284" stroke={O} strokeWidth="13" strokeLinecap="round" />
            <path d="M47 300 L 38 284" stroke={STEEL} strokeWidth="8" strokeLinecap="round" />
            {[58, 69, 80, 91].map((x, i) => (
              <g key={x}>
                <rect x={x - 4.5} y={262 + (i === 0 || i === 3 ? 6 : 0)} width="9" height={28 - (i === 0 || i === 3 ? 6 : 0)} rx="4" fill={STEEL} stroke={O} strokeWidth="2.5" />
                <circle cx={x} cy={277 + (i === 0 || i === 3 ? 3 : 0)} r="2.4" fill="#3a3f5c" />
              </g>
            ))}
            <path d="M50 318 C 48 300, 52 290, 60 288 L 94 288 C 102 290, 104 300, 102 318 Z" fill={STEEL} stroke={O} strokeWidth="3" strokeLinejoin="round" />
            <circle cx="76" cy="304" r="4" fill={BLUE} stroke={O} strokeWidth="2" />
          </g>
          <g className="ha-bob">
            <path d="M56 244 C 44 244, 42 228, 54 226 C 54 212, 72 206, 80 216 C 86 204, 106 208, 104 224 C 116 226, 114 244, 102 244 Z" fill="#fff" stroke={O} strokeWidth="3" strokeLinejoin="round" />
            <path d="M80 238 V 224 M73 230 L 80 223 L 87 230" fill="none" stroke={BLUE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </g>
      </svg>
    </div>
  );
}
