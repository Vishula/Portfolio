import { Application, Graphics } from "pixi.js";
import { TANK } from "../config";
import { createFish, drawFish, updateFish, type Fish } from "./fish";
import { addRipple, drawRipples, updateRipples, type Ripple } from "./ripples";
import { drawBubbles, updateBubbles, type Bubble } from "./bubbles";
import { drawShimmer } from "./shimmer";
import { applyScroll, scrollProgress } from "./depth";
import { useTank, type TankApi } from "@/lib/store";

export type TankHandle = { api: TankApi; destroy(): void };

function token(name: string, fallback: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}

export async function startTank(canvas: HTMLCanvasElement): Promise<TankHandle> {
  const app = new Application();
  await app.init({
    canvas,
    backgroundAlpha: 0,
    antialias: true,
    resolution: Math.min(window.devicePixelRatio || 1, 2),
    autoDensity: true,
    resizeTo: window,
    preference: "webgl",
  });

  const ink = token("--ink", "#1d1d1f");
  const ink2 = token("--ink-2", "#6e6e73");
  const g = new Graphics();
  app.stage.addChild(g);

  const store = useTank.getState;
  let w = window.innerWidth;
  let h = window.innerHeight;
  const now = () => performance.now();
  const reduced = () => store().reduced;

  const fish: Fish[] = [];
  const ripples: Ripple[] = [];
  const bubbles: Bubble[] = [];
  const targetCount = () => {
    const n = reduced() ? TANK.fish.reducedCount : TANK.fish.count;
    return store().lowPower ? Math.ceil(n / 2) : n;
  };
  for (let i = 0; i < targetCount(); i++) fish.push(createFish(w, h, now()));

  let lastScroll = window.scrollY;
  let time = 0;
  let pendingSpawns: number[] = [];

  // Low-power detection: average frame time over a 2 s window.
  let winStart = now();
  let winFrames = 0;
  let winMs = 0;

  const tick = () => {
    const dt = Math.min(app.ticker.deltaTime, 3);
    const t = now();
    time += app.ticker.deltaMS / 1000;
    const st = store();

    if (!st.lowPower) {
      winFrames++;
      winMs += app.ticker.deltaMS;
      if (t - winStart > TANK.lowPower.windowMs) {
        if (winMs / winFrames > TANK.lowPower.frameMs) {
          st.set({ lowPower: true });
          app.ticker.maxFPS = TANK.lowPower.fps;
        }
        winStart = t;
        winFrames = 0;
        winMs = 0;
      }
    }

    const sy = window.scrollY;
    if (sy !== lastScroll) {
      applyScroll(fish, sy - lastScroll, h);
      lastScroll = sy;
    }

    // Keep the population at its target (respawns fade in at the far depth).
    pendingSpawns = pendingSpawns.filter((at) => {
      if (t < at) return true;
      const f = createFish(w, h, t, TANK.depth.min);
      f.x = Math.random() < 0.5 ? -40 : w + 40;
      f.angle = f.x < 0 ? 0 : Math.PI;
      fish.push(f);
      return false;
    });
    const live = fish.filter((f) => !f.exiting).length + pendingSpawns.length;
    if (live > targetCount()) {
      const idx = fish.findIndex((f) => f.state === "wander" && !f.exiting);
      if (idx >= 0) fish.splice(idx, 1);
    }

    const speedMul = reduced() ? TANK.fish.reducedSpeed : 1;
    updateRipples(ripples, dt);
    if (!reduced() && !st.lowPower) updateBubbles(bubbles, ripples, w, h, dt);
    for (let i = fish.length - 1; i >= 0; i--) {
      const f = fish[i];
      updateFish(f, { w, h, dt, ripples, plate: st.reading ? st.plate : null, speedMul });
      if (f.state === "caught") {
        f.scale *= Math.pow(0.86, dt);
        if (f.scale < 0.05) fish.splice(i, 1);
      } else if (f.exiting && (f.x > w + 120 || f.x < -120)) {
        fish.splice(i, 1);
      }
    }

    g.clear();
    const dark = scrollProgress() * TANK.darkening.max;
    if (dark > 0.001) g.rect(0, 0, w, h).fill({ color: ink, alpha: dark });
    if (!reduced() && !st.lowPower) drawShimmer(g, w, h, time, sy, ink);
    drawRipples(g, ripples, ink);
    drawBubbles(g, bubbles, ink2);
    const sorted = [...fish].sort((a, b) => a.z - b.z);
    for (const f of sorted) drawFish(g, f, f.z < 0.55 ? ink2 : ink, 1, t);
  };
  app.ticker.add(tick);

  // Input comes from window so the canvas never blocks clicks or selection.
  let lastMove = 0;
  const onDown = (e: PointerEvent) => addRipple(ripples, e.clientX, e.clientY, TANK.ripples.tap);
  const onMove = (e: PointerEvent) => {
    if (reduced()) return;
    const t = now();
    if (t - lastMove < TANK.ripples.moveIntervalMs) return;
    lastMove = t;
    addRipple(ripples, e.clientX, e.clientY, TANK.ripples.move);
  };
  const onResize = () => {
    w = window.innerWidth;
    h = window.innerHeight;
  };
  const syncRunning = () => {
    const st = store();
    if (document.hidden || st.calm) {
      app.ticker.stop();
      if (st.calm) tick(); // leave one still frame
    } else app.ticker.start();
  };
  window.addEventListener("pointerdown", onDown, { passive: true });
  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("resize", onResize);
  window.addEventListener("orientationchange", onResize);
  document.addEventListener("visibilitychange", syncRunning);
  const unsub = useTank.subscribe((s, p) => {
    if (s.calm !== p.calm) syncRunning();
  });
  syncRunning();

  let bait: Fish | null = null;
  const api: TankApi = {
    pickBait() {
      const cands = fish.filter((f) => f.state === "wander" && !f.exiting && f.x > 0 && f.x < w && f.y > 0 && f.y < h);
      if (!cands.length) return null;
      cands.sort((a, b) => Math.abs(a.z - 0.7) - Math.abs(b.z - 0.7));
      bait = cands[0];
      bait.state = "bait";
      return { x: bait.x, y: bait.y };
    },
    setBait(x, y, angle) {
      if (!bait) return;
      bait.x = x;
      bait.y = y;
      bait.angle = angle;
      bait.speed = 1.6;
    },
    catchBait() {
      if (!bait) return;
      bait.state = "caught";
      bait = null;
      pendingSpawns.push(now() + TANK.fish.respawnMs);
    },
    releaseBait() {
      if (!bait) return;
      bait.state = "flee";
      bait.fleeT = TANK.flee.calmSeconds;
      bait.turn = bait.angle + Math.PI * 0.6;
      bait = null;
    },
    ripple(x, y, s) {
      addRipple(ripples, x, y, s);
    },
    sendMessageFish(x, y) {
      const f = createFish(w, h, now(), 1);
      f.x = x;
      f.y = y;
      f.angle = 0;
      f.size = 60;
      f.exiting = true;
      fish.push(f);
      addRipple(ripples, x, y, 1);
    },
  };

  return {
    api,
    destroy() {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      document.removeEventListener("visibilitychange", syncRunning);
      unsub();
      app.destroy(false, { children: true });
    },
  };
}
