import type { Graphics } from "pixi.js";
import { TANK } from "../config";

export type Ripple = { x: number; y: number; r: number; a: number; strength: number; age: number };

const R = TANK.ripples;

export function addRipple(list: Ripple[], x: number, y: number, strength: number) {
  list.push({ x, y, r: 2, a: 1, strength, age: 0 });
  if (list.length > R.max) list.shift();
}

export function updateRipples(list: Ripple[], dt: number) {
  for (let i = list.length - 1; i >= 0; i--) {
    const r = list[i];
    r.r += R.growth * dt * (0.6 + 0.4 * r.strength);
    r.a *= Math.pow(R.fade, dt);
    r.age += dt;
    if (r.a < 0.02) list.splice(i, 1);
  }
}

export function drawRipples(g: Graphics, list: Ripple[], ink: string) {
  for (const r of list) {
    const alpha = r.a * r.strength * R.alpha;
    g.circle(r.x, r.y, r.r).stroke({ width: 1, color: ink, alpha });
    if (r.r > R.innerGap) g.circle(r.x, r.y, r.r - R.innerGap).stroke({ width: 0.8, color: ink, alpha: alpha * 0.5 });
  }
}
