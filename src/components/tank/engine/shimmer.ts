import type { Graphics } from "pixi.js";
import { TANK } from "../config";

const S = TANK.shimmer;

/** Faint wavy light lines: two layered sine waves plus a slow drift; they rise as you scroll down. */
export function drawShimmer(g: Graphics, w: number, h: number, t: number, scrollY: number, ink: string) {
  const span = h + 80;
  const lift = (scrollY * S.scroll) % span;
  for (let i = 0; i < S.lines; i++) {
    let base = ((i + 0.5) / S.lines) * span - lift - 40;
    if (base < -40) base += span;
    const drift = Math.sin(t * 0.07 + i * 1.7) * 30;
    g.moveTo(-10, base);
    for (let x = -10; x <= w + 24; x += 24) {
      const y = base + drift + Math.sin(x * 0.006 + t * S.speed + i) * S.amp1 + Math.sin(x * 0.019 - t * S.speed * 1.4 + i * 2.1) * S.amp2;
      g.lineTo(x, y);
    }
    g.stroke({ width: S.width, color: ink, alpha: S.opacity, cap: "round", join: "round" });
  }
}
