import { useTank } from "@/lib/store";

export const TRIGGERS = {
  minOnPageMs: 12_000,
  articleStillMs: 4_000,
  articleNearBottomPx: 700,
  idleMs: 20_000,
  forcedDelayMs: 2_500,
} as const;

const SESSION_KEY = "cat-chases";

export function readSessionChases() {
  try {
    return Number(sessionStorage.getItem(SESSION_KEY) ?? 0) || 0;
  } catch {
    return 0;
  }
}
export function writeSessionChases(n: number) {
  try {
    sessionStorage.setItem(SESSION_KEY, String(n));
  } catch {}
}

/** Everything that must be true at the moment a chase starts. */
export function guardsOk() {
  const s = useTank.getState();
  const r = s.buttonRect;
  const onScreen = !!r && r.y + r.h > 0 && r.y < window.innerHeight && r.x < window.innerWidth;
  const el = document.activeElement;
  const typing = !!el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName);
  return onScreen && !typing && !s.reduced && !s.calm && !s.lowPower && !document.hidden && !!s.tank;
}

type Opts = { isArticle: boolean; forced: boolean; onTrigger: () => void };

/** Watches for the moments a chase is allowed; calls onTrigger (repeatedly is fine, the machine guards). */
export function watchTriggers({ isArticle, forced, onTrigger }: Opts) {
  const start = performance.now();
  let scrolled = false;
  let lastInput = performance.now();
  let lastScroll = 0;
  const timers: number[] = [];

  const ready = () => forced || (scrolled && performance.now() - start >= TRIGGERS.minOnPageMs && readSessionChases() === 0);
  const fire = () => {
    if (ready() && guardsOk()) onTrigger();
  };

  const onScroll = () => {
    scrolled = true;
    lastInput = lastScroll = performance.now();
  };
  const onInput = () => {
    lastInput = performance.now();
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("pointermove", onInput, { passive: true });
  window.addEventListener("keydown", onInput);

  const poll = window.setInterval(() => {
    const t = performance.now();
    if (t - lastInput >= TRIGGERS.idleMs) fire();
    if (isArticle && lastScroll && t - lastScroll >= TRIGGERS.articleStillMs) {
      const nearBottom = window.scrollY + window.innerHeight > document.documentElement.scrollHeight - TRIGGERS.articleNearBottomPx;
      if (nearBottom) fire();
    }
  }, 500);

  // Reaching the Home call-to-action section.
  const cta = document.querySelector("[data-cat-cta]");
  const io = cta
    ? new IntersectionObserver((es) => es.some((e) => e.isIntersecting) && fire(), { threshold: 0.4 })
    : null;
  if (cta && io) io.observe(cta);

  if (forced) timers.push(window.setTimeout(fire, TRIGGERS.forcedDelayMs));

  return () => {
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("pointermove", onInput);
    window.removeEventListener("keydown", onInput);
    window.clearInterval(poll);
    timers.forEach(clearTimeout);
    io?.disconnect();
  };
}
