import { TANK } from "../config";
import type { Fish } from "./fish";

/** Scroll parallax: each fish moves with scroll at a rate set by its depth; wraps vertically. */
export function applyScroll(fish: Fish[], dy: number, h: number) {
  for (const f of fish) {
    if (f.state === "bait" || f.state === "caught") continue;
    f.y -= dy * f.z * TANK.depth.parallax;
    if (f.y < -80) f.y += h + 160;
    else if (f.y > h + 80) f.y -= h + 160;
  }
}

export function scrollProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
}
