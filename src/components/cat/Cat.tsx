"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { useTank } from "@/lib/store";
import { catEnabled, track } from "@/lib/analytics";
import { CatDive, CatStill, type CatStillPose } from "./SharkCat";
import { isChaseState, transition, type CatContext, type CatEvent, type CatState } from "./machine";
import { readSessionChases, watchTriggers, writeSessionChases } from "./triggers";
import { runCatch, type CatPose } from "./catchSequence";

const WAKE_MS = 1200;
const IDLE_MS = 6000;
const STOP_MS = 260;
const FAST_SCROLL = 1500; // px/s
const HOP_MS = 900;

type Seq = ReturnType<typeof runCatch>;

export default function Cat() {
  const pathname = usePathname();
  const wrapRef = useRef<HTMLDivElement>(null);
  const porcRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<CatState>("sleeping");
  const ctxRef = useRef<CatContext>({ chasesThisVisit: 0, chasesThisSession: 0 });
  const seqRef = useRef<Seq | null>(null);
  const sendRef = useRef<(e: CatEvent) => void>(() => {});
  const [state, setState] = useState<CatState>("sleeping");
  const [moving, setMoving] = useState(false);
  const [facing, setFacing] = useState<1 | -1>(1);
  const [x, setX] = useState(16);
  const [linePose, setLinePose] = useState<CatPose>("float");
  const [hop, setHop] = useState<{ dir: 1 | -1; h: number; k: number } | null>(null);
  const sideRef = useRef<-1 | 0 | 1>(0); // which side of the nav pill the cat is on
  const calm = useTank((s) => s.calm);
  const reduced = useTank((s) => s.reduced);

  const startSequence = useCallback(() => {
    const { tank, buttonRect } = useTank.getState();
    if (!tank || !buttonRect || !porcRef.current || !lineRef.current) return false;
    writeSessionChases(ctxRef.current.chasesThisSession);
    track("cat_chase_started");
    seqRef.current = runCatch({
      porcelain: porcRef.current,
      line: lineRef.current,
      tank,
      button: buttonRect,
      setPose: setLinePose,
      onSpot: () => {},
      onLeap: () => sendRef.current({ type: "SPOT_DONE" }),
      onChase: () => sendRef.current({ type: "LEAP_DONE" }),
      onCatch: () => {
        sendRef.current({ type: "CATCH" });
        track("cat_catch");
        useTank.setState((s) => ({ catchTick: s.catchTick + 1 }));
      },
      onReturn: () => sendRef.current(stateRef.current === "catching" ? { type: "CATCH_DONE" } : { type: "ABORT" }),
      onDone: (caught) => {
        if (!caught) track("cat_aborted");
        seqRef.current = null;
        const go = sendRef.current;
        const s = stateRef.current;
        if (s === "spotting") return go({ type: "ABORT" });
        if (s === "leaping" || s === "chasing") go({ type: "ABORT" });
        if (stateRef.current === "catching") go({ type: "CATCH_DONE" });
        go({ type: "RETURN_DONE" });
      },
    });
    return true;
  }, []);

  const send = useCallback(
    (e: CatEvent) => {
      const prev = stateRef.current;
      const next = transition(prev, e, ctxRef.current);
      ctxRef.current = next.ctx;
      if (next.state === prev) return;
      stateRef.current = next.state;
      setState(next.state);
      useTank.getState().set({ catState: next.state });
      if (next.state === "spotting" && !startSequence()) {
        stateRef.current = "sleeping";
        setState("sleeping");
      }
    },
    [startSequence],
  );

  useEffect(() => {
    sendRef.current = send;
  }, [send]);

  // Dev-only hook for stepping the sequence in tests.
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") Object.assign(window, { __cat: { gsap, stateRef, sideRef, store: useTank } });
  }, []);

  const enabled = !calm && !reduced;

  useEffect(() => {
    ctxRef.current.chasesThisSession = readSessionChases();
  }, []);

  // Walk with scroll: x follows scroll progress, speed follows scroll speed.
  useEffect(() => {
    if (!enabled) return;
    let lastY = window.scrollY;
    let lastT = performance.now();
    let stopT = 0;
    let idleT = 0;
    let wakeT = 0;
    let hopT = 0;
    let hopping = false;
    const place = () => {
      if (hopping) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const prog = max > 0 ? window.scrollY / max : 0;
      const w = wrapRef.current?.offsetWidth ?? 140;
      const target = 16 + prog * Math.max(0, window.innerWidth - w - 32);
      const nav = document.querySelector("[data-nav]")?.getBoundingClientRect();
      const box = wrapRef.current?.getBoundingClientRect();
      if (!nav || !box) return setX(target);
      // Cat positions (its left edge) that would overlap the nav pill.
      const zl = nav.left - w - 6;
      const zr = nav.right + 6;
      const side = target + w / 2 < nav.left + nav.width / 2 ? -1 : 1;
      if (sideRef.current === 0) sideRef.current = side;
      if (side !== sideRef.current) {
        // Crossing the pill: somersault over it and land on the far side.
        sideRef.current = side;
        hopping = true;
        setFacing(side);
        setHop({ dir: side, h: box.bottom - nav.top + 16, k: performance.now() });
        setX(side === 1 ? Math.max(target, zr) : Math.min(target, zl));
        hopT = window.setTimeout(() => {
          hopping = false;
          setHop(null);
          place();
        }, HOP_MS);
        return;
      }
      // Waiting beside the pill until the scroll carries it past the middle.
      setX(target > zl && target < zr ? (side === -1 ? zl : zr) : target);
    };
    const onScroll = () => {
      const now = performance.now();
      const dy = window.scrollY - lastY;
      const v = Math.abs(dy) / Math.max(1, now - lastT) * 1000;
      lastY = window.scrollY;
      lastT = now;
      const s = stateRef.current;
      if (isChaseState(s)) {
        if (v > FAST_SCROLL) seqRef.current?.abort();
        return;
      }
      if (dy !== 0) setFacing(dy > 0 ? 1 : -1);
      if (s === "sleeping") {
        send({ type: "SCROLL" });
        window.clearTimeout(wakeT);
        wakeT = window.setTimeout(() => send({ type: "WAKE_DONE" }), WAKE_MS);
      }
      place();
      setMoving(true);
      window.clearTimeout(stopT);
      stopT = window.setTimeout(() => setMoving(false), STOP_MS);
      window.clearTimeout(idleT);
      idleT = window.setTimeout(() => send({ type: "IDLE" }), IDLE_MS);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", place);
      [stopT, idleT, wakeT, hopT].forEach(clearTimeout);
    };
  }, [enabled, send]);

  // Chase triggers.
  useEffect(() => {
    if (!enabled || !catEnabled()) return;
    const forced = new URLSearchParams(window.location.search).has("chase");
    return watchTriggers({
      isArticle: /^\/projects\/[^/]+/.test(pathname),
      forced,
      onTrigger: () => send({ type: "TRIGGER" }),
    });
  }, [enabled, pathname, send]);

  // Interruptions during the chase: tap, key, nav click. Resume clicks are handled as an instant catch.
  useEffect(() => {
    const onDown = (e: Event) => {
      if (!isChaseState(stateRef.current)) return;
      if ((e.target as Element | null)?.closest?.("[data-resume]")) return;
      seqRef.current?.abort();
    };
    window.addEventListener("pointerdown", onDown, true);
    window.addEventListener("keydown", onDown, true);
    const unsub = useTank.subscribe((s, p) => {
      if (s.catchNowTick !== p.catchNowTick) seqRef.current?.catchNow();
    });
    return () => {
      window.removeEventListener("pointerdown", onDown, true);
      window.removeEventListener("keydown", onDown, true);
      unsub();
    };
  }, []);

  // Route change mid-sequence: snap to sleeping.
  useEffect(() => {
    if (!seqRef.current) return;
    seqRef.current.kill?.();
    seqRef.current = null;
    useTank.getState().tank?.releaseBait();
    if (porcRef.current) gsap.set(porcRef.current, { clearProps: "all" });
    if (lineRef.current) gsap.set(lineRef.current, { autoAlpha: 0 });
    stateRef.current = "sleeping";
    setState("sleeping");
    send({ type: "ROUTE_CHANGE" });
  }, [pathname, send]);

  // Walking pauses stand still; only waking up sits back on the beanbag.
  const pose: CatStillPose = hop
    ? "leap"
    : state === "sleeping" || state === "returning" || state === "catching" || state === "chasing"
      ? "sleep"
      : state === "waking"
        ? "sit"
        : state === "walking"
          ? "stand"
          : "crouch";
  const cls = [state === "waking" && "waking", state === "walking" && moving && "walking", state === "spotting" && "spotting"]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <div
        ref={wrapRef}
        aria-hidden="true"
        className={`pointer-events-none fixed w-[84px] md:w-[104px] ${hop ? "z-[55]" : "z-30"}`}
        style={{
          left: 0,
          bottom: "calc(4px + var(--safe-b))",
          transform: `translateX(${x}px)`,
          transition: hop ? `transform ${HOP_MS}ms cubic-bezier(0.45, 0, 0.55, 1)` : moving ? "transform 0.25s linear" : "transform 0.6s ease-out",
        }}
      >
        <div ref={porcRef} className="aspect-[120/146]">
          <div
            key={hop?.k}
            className={hop ? "cat-hop" : undefined}
            style={{ width: "100%", height: "100%", ...(hop && ({ "--hop": `${hop.h}px`, "--dir": hop.dir, "--hop-ms": `${HOP_MS}ms` } as CSSProperties)) }}
          >
            <div className={cls} style={{ transform: `scaleX(${pose === "sleep" || pose === "crouch" ? 1 : facing})`, width: "100%", height: "100%" }}>
              <CatStill pose={pose} />
            </div>
          </div>
        </div>
      </div>
      <div
        ref={lineRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-40 w-[110px] md:w-[140px]"
        style={{ aspectRatio: "116 / 62", opacity: 0, visibility: "hidden" }}
      >
        <CatDive pose={linePose} />
      </div>
    </>
  );
}
