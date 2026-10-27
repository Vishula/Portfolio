"use client";

import { useEffect, useRef } from "react";
import { useTank } from "@/lib/store";

type Part = { text: string; tone?: "accent" | "muted" };

const TONE = { accent: "text-accent", muted: "text-ink-2" } as const;

/**
 * The About statement, lit word by word as it scrolls through the viewport. Words start faded
 * (CSS, only when JS runs) and take their own colour once reached. Calm water and reduced motion
 * show everything at once.
 */
export default function ScrollStatement({ parts }: { parts: Part[] }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const still = useTank((s) => s.calm || s.reduced);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const words = [...el.querySelectorAll<HTMLElement>("[data-w]")];
    if (still) {
      words.forEach((w) => w.setAttribute("data-on", ""));
      return;
    }
    // Scroll events already arrive once per frame, and this only touches a few dozen spans.
    const update = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Starts as the top enters the lower 10% of the screen; done as the bottom passes 65%.
      const start = vh * 0.9;
      const end = vh * 0.65;
      const p = Math.min(1, Math.max(0, (start - r.top) / (start - end + r.height)));
      const n = Math.round(p * words.length);
      words.forEach((w, i) => w.toggleAttribute("data-on", i < n));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [still]);

  return (
    <p ref={ref} className="statement">
      {parts.map((part, i) =>
        part.text.split(/(\s+)/).map((w, j) =>
          /^\s+$/.test(w) || !w ? (
            w
          ) : (
            <span key={`${i}-${j}`} data-w className={part.tone ? TONE[part.tone] : undefined}>
              {w}
            </span>
          ),
        ),
      )}
    </p>
  );
}
