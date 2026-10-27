import type { Graphics } from "pixi.js";
import { TANK } from "../config";
import { addRipple, type Ripple } from "./ripples";

export type Bubble = { x: number; y: number; r: number; rise: number; phase: number; popAt: number };

const B = TANK.bubbles;
const rand = (a: number, b: number) => a + Math.random() * (b - a);

export function updateBubbles(list: Bubble[], ripples: Ripple[], w: number, h: number, dt: number) {
  if (Math.random() < B.spawn * dt) {
    list.push({ x: rand(0, w), y: h + 8, r: rand(B.rMin, B.rMax), rise: rand(B.riseMin, B.riseMax), phase: rand(0, 6), popAt: rand(h * 0.05, h * 0.7) });
  }
  for (let i = list.length - 1; i >= 0; i--) {
    const b = list[i];
    b.y -= b.rise * dt;
    b.phase += 0.05 * dt;
    b.x += Math.sin(b.phase) * B.wobble * dt * 0.5;
    if (b.y < b.popAt) {
      addRipple(ripples, b.x, b.y, 0.15);
      list.splice(i, 1);
    }
  }
}

export function drawBubbles(g: Graphics, list: Bubble[], ink2: string) {
  for (const b of list) g.circle(b.x, b.y, b.r).stroke({ width: 0.8, color: ink2, alpha: B.alpha });
}
