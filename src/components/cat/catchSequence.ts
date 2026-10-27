import { gsap } from "gsap";
import type { Rect, TankApi } from "@/lib/store";

type Pt = { x: number; y: number };
const quad = (a: Pt, c: Pt, b: Pt, u: number): Pt => ({
  x: (1 - u) * (1 - u) * a.x + 2 * (1 - u) * u * c.x + u * u * b.x,
  y: (1 - u) * (1 - u) * a.y + 2 * (1 - u) * u * c.y + u * u * b.y,
});
const quadTan = (a: Pt, c: Pt, b: Pt, u: number) =>
  Math.atan2(2 * (1 - u) * (c.y - a.y) + 2 * u * (b.y - c.y), 2 * (1 - u) * (c.x - a.x) + 2 * u * (b.x - c.x));

export type CatPose = "bound-a" | "bound-b" | "pounce" | "float" | "shrug";

type Opts = {
  porcelain: HTMLElement; // the 3D cat (animated wrapper)
  line: HTMLElement; // the 2D line cat overlay
  tank: TankApi;
  button: Rect;
  onSpot(): void;
  onLeap(): void;
  onChase(): void;
  onCatch(): void;
  onReturn(): void;
  onDone(caught: boolean): void;
  setPose(p: CatPose): void;
};

/** GSAP timeline: spot, leap, 3D→2D, chase, pounce, burst, return. About 7 s. */
export function runCatch(o: Opts) {
  const home = o.porcelain.getBoundingClientRect();
  const lineW = o.line.offsetWidth;
  const lineH = o.line.offsetHeight;
  const apex: Pt = { x: home.left + home.width / 2, y: home.top - 110 };
  // Catch point sits just below-left of the button so nothing covers its label.
  const catchPt: Pt = { x: o.button.x + o.button.w * 0.2, y: o.button.y + o.button.h + 10 };
  const fish0 = o.tank.pickBait();
  if (!fish0) {
    o.onDone(false);
    return { abort() {}, catchNow() {} };
  }
  const fishCtl: Pt = { x: (fish0.x + catchPt.x) / 2 - 80, y: Math.min(fish0.y, catchPt.y) + 40 };
  const catCtl: Pt = { x: apex.x + (catchPt.x - apex.x) * 0.25, y: catchPt.y + 60 };
  const perp = Math.atan2(catchPt.y - fish0.y, catchPt.x - fish0.x) + Math.PI / 2;

  const p = { fu: 0, cu: 0, dodge: 0 };
  const placeLine = (pt: Pt, rot = 0) => {
    // Front paws are at the right edge of the line cat, so offset to land paws on the point.
    gsap.set(o.line, { x: pt.x - lineW * 0.85, y: pt.y - lineH * 0.65, rotation: rot });
  };
  const draw = o.line.querySelectorAll<SVGPathElement>("[data-stroke]");

  let caught = false;
  let ended = false;
  let lastPose: CatPose | null = null;
  const pose = (x: CatPose) => {
    if (x !== lastPose) o.setPose((lastPose = x));
  };

  const tl = gsap.timeline({
    onUpdate() {
      const t = tl.time();
      if (t < 5 && !caught) {
        const fp = quad(fish0, fishCtl, catchPt, p.fu);
        const off = p.dodge * 46;
        o.tank.setBait(fp.x + Math.cos(perp) * off, fp.y + Math.sin(perp) * off, quadTan(fish0, fishCtl, catchPt, p.fu) + p.dodge * 0.9);
      }
      if (t >= 2.0 && t < 5) {
        placeLine(quad(apex, catCtl, catchPt, p.cu), quadTan(apex, catCtl, catchPt, p.cu) * (180 / Math.PI) * 0.35);
        if (t >= 2.4) pose(Math.floor(t / 0.13) % 2 ? "bound-a" : "bound-b");
      }
    },
  });

  tl.call(o.onSpot, [], 0)
    .set(o.line, { autoAlpha: 0 }, 0)
    .set(draw, { strokeDasharray: 1, strokeDashoffset: 1 }, 0)
    .to(p, { fu: 1, duration: 5, ease: "power1.inOut" }, 0)
    .to(p, { dodge: 1, duration: 0.3, ease: "sine.out" }, 3.3)
    .to(p, { dodge: 0, duration: 0.5, ease: "sine.inOut" }, 3.6)
    // leap
    .call(o.onLeap, [], 1.5)
    .to(o.porcelain, { y: apex.y - home.top + 10, scale: 0.92, duration: 0.5, ease: "power2.out" }, 1.5)
    // 3D → 2D at the apex
    .call(() => {
      placeLine(apex);
      pose("float");
    }, [], 2.0)
    .set(o.line, { autoAlpha: 1 }, 2.0)
    .to(o.porcelain, { autoAlpha: 0, duration: 0.4, ease: "power1.out" }, 2.0)
    .to(draw, { strokeDashoffset: 0, duration: 0.4, ease: "power1.out" }, 2.0)
    .call(o.onChase, [], 2.4)
    .to(p, { cu: 1, duration: 2.6, ease: "power1.in" }, 2.4)
    // pounce + burst
    .addLabel("catch", 5.0)
    .call(() => {
      caught = true;
      pose("pounce");
      placeLine(catchPt);
      o.tank.catchBait();
      o.onCatch();
    }, [], 5.0)
    // return
    .call(() => {
      pose("float");
      o.onReturn();
    }, [], 5.6)
    .to(o.line, { x: home.left + home.width / 2 - lineW / 2, y: home.top + home.height / 2 - lineH / 2, rotation: 0, duration: 1.0, ease: "sine.inOut" }, 5.6)
    .to(draw, { strokeDashoffset: 1, duration: 0.4, ease: "power1.in" }, 6.3)
    .set(o.porcelain, { y: -40, scale: 1 }, 6.4)
    .to(o.porcelain, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" }, 6.4)
    .set(o.line, { autoAlpha: 0 }, 7.0)
    .call(() => finish(true), [], 7.0);

  function finish(ok: boolean) {
    if (ended) return;
    ended = true;
    o.onDone(ok);
  }

  return {
    /** Tap, fast scroll, key or nav click: fish escapes, cat shrugs and goes home. No burst. */
    abort() {
      if (ended || caught) return;
      const t = tl.time();
      tl.kill();
      o.tank.releaseBait();
      if (t < 2.0) {
        gsap.to(o.porcelain, { y: 0, scale: 1, autoAlpha: 1, duration: 0.4, ease: "power2.out", onComplete: () => finish(false) });
        gsap.set(o.line, { autoAlpha: 0 });
        return;
      }
      o.onReturn();
      pose("shrug");
      gsap
        .timeline({ onComplete: () => finish(false) })
        .to(o.line, { y: "+=8", duration: 0.25, yoyo: true, repeat: 1 })
        .to(o.line, { x: home.left + home.width / 2 - lineW / 2, y: home.top - lineH / 2, rotation: 0, duration: 0.9, ease: "sine.inOut" })
        .to(draw, { strokeDashoffset: 1, duration: 0.3 }, "-=0.3")
        .set(o.porcelain, { y: -30, scale: 1 })
        .to(o.porcelain, { autoAlpha: 1, y: 0, duration: 0.5 })
        .set(o.line, { autoAlpha: 0 });
    },
    /** Resume clicked mid-chase: the cat catches instantly. */
    catchNow() {
      if (ended || caught) return;
      if (tl.time() < 2.0) {
        gsap.set(o.porcelain, { autoAlpha: 0 });
        gsap.set(o.line, { autoAlpha: 1 });
        gsap.set(draw, { strokeDashoffset: 0 });
      }
      tl.seek("catch", false);
    },
    kill() {
      tl.kill();
      ended = true;
    },
  };
}
