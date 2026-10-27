"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Sets data-in on [data-reveal] elements as they enter the viewport; they carry suppressHydrationWarning
 * because this can run before a streamed page segment hydrates. Without JS they are simply visible. */
export default function Reveal() {
  const path = usePathname();
  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]:not([data-in])");
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.setAttribute("data-in", "");
            io.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -10% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [path]);
  return null;
}
