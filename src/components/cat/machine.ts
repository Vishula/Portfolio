// Cat state machine. Pure logic: no React, no Pixi, no DOM.

export type CatState =
  | "sleeping"
  | "waking"
  | "walking"
  | "spotting"
  | "leaping"
  | "chasing"
  | "catching"
  | "returning";

export type CatEvent =
  | { type: "SCROLL" }
  | { type: "IDLE" } // 6 s without scrolling
  | { type: "WAKE_DONE" }
  | { type: "TRIGGER" }
  | { type: "SPOT_DONE" }
  | { type: "LEAP_DONE" }
  | { type: "CATCH" }
  | { type: "ABORT" }
  | { type: "CATCH_DONE" }
  | { type: "RETURN_DONE" }
  | { type: "ROUTE_CHANGE" };

export type CatContext = {
  chasesThisVisit: number;
  chasesThisSession: number;
};

export const LIMITS = { perVisit: 1, perSession: 2 } as const;

export function canChase(ctx: CatContext) {
  return ctx.chasesThisVisit < LIMITS.perVisit && ctx.chasesThisSession < LIMITS.perSession;
}

export function transition(state: CatState, event: CatEvent, ctx: CatContext): { state: CatState; ctx: CatContext } {
  const stay = { state, ctx };
  if (event.type === "ROUTE_CHANGE") {
    const mid = state === "spotting" || state === "leaping" || state === "chasing" || state === "catching" || state === "returning";
    return { state: mid ? "sleeping" : state, ctx };
  }

  switch (state) {
    case "sleeping":
      if (event.type === "SCROLL") return { state: "waking", ctx };
      if (event.type === "TRIGGER" && canChase(ctx)) return startChase(ctx);
      return stay;
    case "waking":
      if (event.type === "WAKE_DONE") return { state: "walking", ctx };
      return stay;
    case "walking":
      if (event.type === "IDLE") return { state: "sleeping", ctx };
      if (event.type === "TRIGGER" && canChase(ctx)) return startChase(ctx);
      return stay;
    case "spotting":
      if (event.type === "SPOT_DONE") return { state: "leaping", ctx };
      if (event.type === "ABORT") return { state: "sleeping", ctx };
      return stay;
    case "leaping":
      if (event.type === "LEAP_DONE") return { state: "chasing", ctx };
      if (event.type === "ABORT") return { state: "returning", ctx };
      return stay;
    case "chasing":
      if (event.type === "CATCH") return { state: "catching", ctx };
      if (event.type === "ABORT") return { state: "returning", ctx };
      return stay;
    case "catching":
      if (event.type === "CATCH_DONE") return { state: "returning", ctx };
      return stay;
    case "returning":
      if (event.type === "RETURN_DONE") return { state: "sleeping", ctx };
      return stay;
  }
}

function startChase(ctx: CatContext) {
  return {
    state: "spotting" as const,
    ctx: { chasesThisVisit: ctx.chasesThisVisit + 1, chasesThisSession: ctx.chasesThisSession + 1 },
  };
}

export function isChaseState(s: CatState) {
  return s === "spotting" || s === "leaping" || s === "chasing" || s === "catching" || s === "returning";
}
