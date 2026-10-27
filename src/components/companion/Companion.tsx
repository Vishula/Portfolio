"use client";

import { useEffect, useState } from "react";
import { useTank } from "@/lib/store";
import { isChaseState } from "@/components/cat/machine";
import { FigureStill } from "@/components/cat/Figure";

// The blue-beanie figure stands left of the Resume button; hovering or focusing the button makes
// him walk over and reach for it, leaving makes him stroll back. Desktop only, decorative, never blocks clicks.

const W = 64; // rendered width; the viewBox is 120 x 166 starting at y = -18
const H = (W * 166) / 120;
const HAND_X = (98 / 120) * W; // reaching hand, from his left edge
const HAND_Y = ((17 + 18) / 166) * H; // reaching hand, from his top edge
const WALK = 72; // px between resting spot and the button
const WALK_MS = 1000;

type Phase = "idle" | "toward" | "there" | "back";

export default function Companion() {
  const rect = useTank((s) => s.buttonRect);
  const hidden = useTank((s) => isChaseState(s.catState));
  const still = useTank((s) => s.calm || s.reduced);
  const [phase, setPhase] = useState<Phase>("idle");

  useEffect(() => {
    const btn = document.querySelector<HTMLElement>("[data-resume]");
    if (!btn) return;
    let t = 0;
    const go = (to: "there" | "idle") => {
      clearTimeout(t);
      setPhase(to === "there" ? "toward" : "back");
      t = window.setTimeout(() => setPhase(to), still ? 0 : WALK_MS);
    };
    const enter = () => go("there");
    const leave = () => go("idle");
    btn.addEventListener("pointerenter", enter);
    btn.addEventListener("pointerleave", leave);
    btn.addEventListener("focus", enter);
    btn.addEventListener("blur", leave);
    return () => {
      clearTimeout(t);
      btn.removeEventListener("pointerenter", enter);
      btn.removeEventListener("pointerleave", leave);
      btn.removeEventListener("focus", enter);
      btn.removeEventListener("blur", leave);
    };
  }, [still]);

  if (!rect) return null;
  const near = phase === "toward" || phase === "there";
  const left = rect.x - HAND_X + 4 - (near ? 0 : WALK);
  const walking = !still && (phase === "toward" || phase === "back");

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed left-0 top-0 z-[45] hidden md:block ${walking ? "walking" : ""}`}
      style={{
        width: W,
        height: H,
        transform: `translate(${left}px, ${rect.y + rect.h / 2 - HAND_Y}px)`,
        transition: still ? "opacity 0.3s" : `transform ${WALK_MS}ms linear, opacity 0.3s`,
        opacity: hidden ? 0 : 1,
      }}
    >
      <div style={{ width: "100%", height: "100%", transform: `scaleX(${phase === "back" ? -1 : 1})` }}>
        <FigureStill pose="stand" reach={phase === "there"} />
      </div>
    </div>
  );
}
