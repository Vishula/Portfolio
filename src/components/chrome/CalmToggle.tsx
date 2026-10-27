"use client";

import { useEffect } from "react";
import { useTank } from "@/lib/store";
import { readCalm, writeCalm } from "@/lib/motion";

export default function CalmToggle() {
  const calm = useTank((s) => s.calm);
  useEffect(() => useTank.getState().set({ calm: readCalm() }), []);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={calm}
      onClick={() => {
        writeCalm(!calm);
        useTank.getState().set({ calm: !calm });
      }}
      className="inline-flex min-h-11 items-center gap-3 rounded-full px-1 text-[15px] text-ink-2 hover:text-ink"
    >
      <span className={`relative h-6 w-10 rounded-full border border-liner transition ${calm ? "bg-accent" : "bg-white"}`}>
        <span className={`absolute top-0.5 h-[18px] w-[18px] rounded-full shadow transition ${calm ? "left-[19px] bg-white" : "left-0.5 bg-ink"}`} />
      </span>
      Calm water
    </button>
  );
}
