"use client";

import { useEffect, useRef, useState } from "react";
import { useTank } from "@/lib/store";
import { prefersReducedMotion, readCalm } from "@/lib/motion";

/** Mounted once in the root layout so fish keep swimming across page changes. */
export default function TankCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [on, setOn] = useState(false);
  const reading = useTank((s) => s.reading);

  useEffect(() => {
    const set = useTank.getState().set;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    set({ reduced: prefersReducedMotion(), calm: readCalm() });
    const onMq = () => set({ reduced: mq.matches });
    mq.addEventListener("change", onMq);

    let destroyed = false;
    let destroy: (() => void) | undefined;
    const start = async () => {
      const { startTank } = await import("./engine/app");
      if (destroyed || !ref.current) return;
      try {
        const handle = await startTank(ref.current);
        if (destroyed) return handle.destroy();
        destroy = handle.destroy;
        set({ tank: handle.api });
        setOn(true);
      } catch (err) {
        console.warn("Tank disabled:", err);
      }
    };
    // Start after first paint, when the browser is idle.
    const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
    const id = ric(() => void start(), { timeout: 1500 });
    return () => {
      destroyed = true;
      mq.removeEventListener("change", onMq);
      window.cancelIdleCallback?.(id as number);
      set({ tank: null });
      destroy?.();
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={`tank${on ? " on" : ""}${reading ? " reading" : ""}`} />;
}
