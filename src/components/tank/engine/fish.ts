import type { Graphics } from "pixi.js";
import { TANK } from "../config";
import type { Ripple } from "./ripples";
import type { Rect } from "@/lib/store";

export type FishState = "wander" | "flee" | "bait" | "caught";

export type Fish = {
  id: string;
  x: number;
  y: number; // screen position; parallax shifts it on scroll
  z: number; // depth 0.35–1
  angle: number;
  turn: number;
  speed: number;
  targetSpeed: number;
  baseSpeed: number;
  size: number;
  phase: number;
  state: FishState;
  fleeT: number;
  born: number;
  scale: number;
  exiting?: boolean;
};

const F = TANK.fish;
const D = TANK.depth;
let seq = 0;
const rand = (a: number, b: number) => a + Math.random() * (b - a);

export function createFish(w: number, h: number, now: number, z = rand(D.min, D.max)): Fish {
  const base = rand(F.minSpeed, F.maxSpeed);
  return {
    id: `f${seq++}`,
    x: rand(w * 0.1, w * 0.9),
    y: rand(h * 0.1, h * 0.9),
    z,
    angle: rand(0, Math.PI * 2),
    turn: 0,
    speed: base,
    targetSpeed: base,
    baseSpeed: base,
    size: rand(F.minSize, F.maxSize),
    phase: rand(0, 10),
    state: "wander",
    fleeT: 0,
    born: now,
    scale: 1,
  };
}

export function turnToward(a: number, target: number, rate: number) {
  let d = target - a;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return a + d * Math.min(1, rate);
}

type Ctx = { w: number; h: number; dt: number; ripples: Ripple[]; plate: Rect | null; speedMul: number };

export function updateFish(f: Fish, c: Ctx) {
  const { dt } = c;
  f.phase += (F.tailFreq * Math.max(f.speed, 0.4) * c.speedMul * dt) / 60;
  if (f.state === "bait" || f.state === "caught") return; // driven by the cat sequence

  // Flee from fresh ripples that reach the fish.
  for (const r of c.ripples) {
    if (r.age > 30) continue;
    const dx = f.x - r.x;
    const dy = f.y - r.y;
    if (dx * dx + dy * dy < (r.r + TANK.flee.radiusPad) ** 2) {
      f.state = "flee";
      f.fleeT = TANK.flee.calmSeconds;
      f.turn = Math.atan2(dy, dx); // reuse turn as flee heading
      break;
    }
  }

  if (f.state === "flee") {
    f.angle = turnToward(f.angle, f.turn, TANK.flee.turnRate * dt);
    f.targetSpeed = TANK.flee.speed;
    f.fleeT -= dt / 60;
    if (f.fleeT <= 0) {
      f.state = "wander";
      f.turn = 0;
      f.targetSpeed = f.baseSpeed;
    }
  } else if (f.exiting) {
    f.targetSpeed = TANK.flee.speed;
    f.angle = turnToward(f.angle, 0, 0.04 * dt);
  } else {
    // Lazy wandering curve.
    f.turn += (Math.random() - 0.5) * F.turnJitter * dt;
    f.turn = Math.max(-F.maxTurn, Math.min(F.maxTurn, f.turn)) * Math.pow(0.985, dt);
    f.angle += f.turn * dt;

    const m = F.edgeMargin;
    if (f.x < m || f.x > c.w - m || f.y < m || f.y > c.h - m) {
      f.angle = turnToward(f.angle, Math.atan2(c.h / 2 - f.y, c.w / 2 - f.x), F.edgeSteer * dt);
    }

    if (Math.random() < F.burstChance * dt) f.targetSpeed = F.burstSpeed;
    f.targetSpeed += (f.baseSpeed - f.targetSpeed) * 0.01 * dt;
  }

  // Reading plate: steer gently out of the text column.
  if (c.plate) {
    const p = c.plate;
    const mg = TANK.plate.margin;
    if (f.x > p.x - mg && f.x < p.x + p.w + mg && f.y > p.y - mg && f.y < p.y + p.h + mg) {
      const away = f.x < p.x + p.w / 2 ? Math.PI : 0;
      f.angle = turnToward(f.angle, away, TANK.plate.force * dt);
    }
  }

  f.speed += (f.targetSpeed - f.speed) * 0.05 * dt;
  const v = f.speed * c.speedMul * (0.6 + 0.4 * f.z) * dt;
  f.x += Math.cos(f.angle) * v;
  f.y += Math.sin(f.angle) * v;
}

/** Thin line fish: curved body, forked tail, eye dot, one fin. Facing +x in local space. */
export function drawFish(g: Graphics, f: Fish, ink: string, alphaMul: number, now: number) {
  const L = f.size * (0.45 + 0.55 * f.z) * f.scale;
  if (L < 1) return;
  const fade = Math.min(1, (now - f.born) / F.fadeInMs);
  const alpha = (D.alphaBase + D.alphaZ * f.z) * fade * alphaMul;
  const width = D.lineBase + D.lineZ * f.z;
  const c = Math.cos(f.angle);
  const s = Math.sin(f.angle);
  const w = Math.sin(f.phase) * L * 0.07; // tail wiggle
  const bend = Math.sin(f.phase - 0.8) * L * 0.025;
  const X = (px: number, py: number) => f.x + (px * L) * c - (py * L + (px < -0.1 ? bend : 0)) * s;
  const Y = (px: number, py: number) => f.y + (px * L) * s + (py * L + (px < -0.1 ? bend : 0)) * c;
  const tw = w / L;

  // body
  g.moveTo(X(0.5, 0), Y(0.5, 0));
  g.bezierCurveTo(X(0.3, -0.24), Y(0.3, -0.24), X(-0.18, -0.17), Y(-0.18, -0.17), X(-0.34, 0), Y(-0.34, 0));
  g.bezierCurveTo(X(-0.18, 0.17), Y(-0.18, 0.17), X(0.3, 0.24), Y(0.3, 0.24), X(0.5, 0), Y(0.5, 0));
  // forked tail
  g.moveTo(X(-0.34, 0), Y(-0.34, 0));
  g.lineTo(X(-0.62, -0.19 + tw), Y(-0.62, -0.19 + tw));
  g.quadraticCurveTo(X(-0.5, tw * 0.6), Y(-0.5, tw * 0.6), X(-0.62, 0.19 + tw), Y(-0.62, 0.19 + tw));
  g.lineTo(X(-0.34, 0), Y(-0.34, 0));
  // dorsal fin
  g.moveTo(X(0.08, -0.17), Y(0.08, -0.17));
  g.quadraticCurveTo(X(-0.06, -0.3), Y(-0.06, -0.3), X(-0.16, -0.14), Y(-0.16, -0.14));
  // gill
  g.moveTo(X(0.26, -0.13), Y(0.26, -0.13));
  g.quadraticCurveTo(X(0.2, 0), Y(0.2, 0), X(0.26, 0.13), Y(0.26, 0.13));
  g.stroke({ width, color: ink, alpha, cap: "round", join: "round" });

  g.circle(X(0.36, -0.045), Y(0.36, -0.045), Math.max(0.8, L * 0.022)).fill({ color: ink, alpha });
}
