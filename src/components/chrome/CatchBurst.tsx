"use client";

import { useEffect, useState } from "react";
import { useTank } from "@/lib/store";

const SPARKS = 10;

/** 8–12 accent line-sparks and one ring, from the resume button centre; fades over 0.6 s. */
export default function CatchBurst() {
  const [burst, setBurst] = useState<{ k: number; x: number; y: number } | null>(null);

  useEffect(() => {
    let t = 0;
    const unsub = useTank.subscribe((s, p) => {
      if (s.catchTick === p.catchTick || !s.buttonRect) return;
      const r = s.buttonRect;
      setBurst({ k: s.catchTick, x: r.x + r.w / 2, y: r.y + r.h / 2 });
      s.tank?.ripple(r.x + r.w / 2, r.y + r.h / 2, 1.2);
      clearTimeout(t);
      t = window.setTimeout(() => setBurst(null), 700);
    });
    return () => {
      unsub();
      clearTimeout(t);
    };
  }, []);

  if (!burst) return null;
  return (
    <svg
      key={burst.k}
      aria-hidden="true"
      className="pointer-events-none fixed z-40"
      width="200"
      height="200"
      viewBox="-100 -100 200 200"
      style={{ left: burst.x - 100, top: burst.y - 100 }}
    >
      <g className="burst-sparks" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round">
        {Array.from({ length: SPARKS }, (_, i) => {
          const a = (i / SPARKS) * Math.PI * 2 + 0.2;
          const r0 = 34 + (i % 2) * 6;
          const r1 = r0 + 14 + (i % 3) * 4;
          return <line key={i} x1={Math.cos(a) * r0} y1={Math.sin(a) * r0} x2={Math.cos(a) * r1} y2={Math.sin(a) * r1} />;
        })}
      </g>
      <circle className="burst-ring" r="26" fill="none" stroke="var(--accent)" strokeWidth="1.4" />
    </svg>
  );
}
