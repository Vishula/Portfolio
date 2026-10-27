"use client";

import { useEffect, useRef } from "react";
import { useTank } from "@/lib/store";

/** Wraps article text: dims the tank to 40% and tells fish to steer around this rectangle. */
export default function ReadingPlate({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const set = useTank.getState().set;
    const report = () => {
      const r = el.getBoundingClientRect();
      set({ plate: { x: r.left, y: r.top, w: r.width, h: r.height } });
    };
    set({ reading: true });
    report();
    const ro = new ResizeObserver(report);
    ro.observe(el);
    window.addEventListener("scroll", report, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", report);
      set({ reading: false, plate: null });
    };
  }, []);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
