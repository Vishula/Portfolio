"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDownToLine } from "lucide-react";
import { useTank } from "@/lib/store";
import { isChaseState } from "@/components/cat/machine";
import { track } from "@/lib/analytics";

import { RESUME_HREF } from "@/lib/site";

export default function ResumeButton() {
  const ref = useRef<HTMLAnchorElement>(null);
  const [caught, setCaught] = useState(false);
  const glow = useTank((s) => s.catState === "chasing");

  // Report the on-screen rectangle so the cat knows where to land.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const report = () => {
      const r = el.getBoundingClientRect();
      useTank.getState().set({ buttonRect: { x: r.left, y: r.top, w: r.width, h: r.height } });
    };
    report();
    const ro = new ResizeObserver(report);
    ro.observe(el);
    window.addEventListener("scroll", report, { passive: true });
    window.addEventListener("resize", report);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", report);
      window.removeEventListener("resize", report);
    };
  }, []);

  // Catch state: accent border and icon nudge for 1.2 s.
  useEffect(() => {
    let t = 0;
    const unsub = useTank.subscribe((s, p) => {
      if (s.catchTick === p.catchTick) return;
      setCaught(true);
      clearTimeout(t);
      t = window.setTimeout(() => setCaught(false), 1200);
    });
    return () => {
      unsub();
      clearTimeout(t);
    };
  }, []);

  return (
    <a
      ref={ref}
      href={RESUME_HREF}
      download
      data-resume
      onClick={() => {
        const chasing = isChaseState(useTank.getState().catState);
        track("resume_download", { source: chasing ? "catch" : "button" });
        if (chasing) useTank.setState((s) => ({ catchNowTick: s.catchNowTick + 1 }));
      }}
      className={`glass fixed z-50 flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full px-4 text-[15px] font-medium text-ink transition duration-300 ease-out hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(0,0,0,0.1)] active:scale-[0.96] ${
        caught ? "resume-caught" : ""
      }`}
      style={{
        top: "calc(16px + var(--safe-t))",
        right: "calc(16px + var(--safe-r))",
        boxShadow: glow ? "0 0 0 6px rgba(43,107,232,0.12), 0 8px 30px rgba(0,0,0,0.06)" : undefined,
      }}
    >
      <ArrowDownToLine size={18} strokeWidth={1.6} aria-hidden="true" />
      <span className="hidden sm:inline">Resume</span>
      <span className="sm:hidden">CV</span>
      <span className="sr-only"> (PDF download)</span>
    </a>
  );
}
