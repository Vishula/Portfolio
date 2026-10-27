import { describe, expect, it } from "vitest";
import { canChase, transition, type CatContext, type CatEvent, type CatState } from "../src/components/cat/machine";

const fresh = (): CatContext => ({ chasesThisVisit: 0, chasesThisSession: 0 });

function run(events: CatEvent["type"][], start: CatState = "sleeping", ctx = fresh()) {
  let s = start;
  let c = ctx;
  for (const type of events) ({ state: s, ctx: c } = transition(s, { type } as CatEvent, c));
  return { s, c };
}

describe("cat machine", () => {
  it("wakes on scroll, walks, and sleeps when idle", () => {
    expect(run(["SCROLL"]).s).toBe("waking");
    expect(run(["SCROLL", "WAKE_DONE"]).s).toBe("walking");
    expect(run(["SCROLL", "WAKE_DONE", "IDLE"]).s).toBe("sleeping");
  });

  it("plays the full chase in order", () => {
    const steps: [CatEvent["type"], CatState][] = [
      ["TRIGGER", "spotting"],
      ["SPOT_DONE", "leaping"],
      ["LEAP_DONE", "chasing"],
      ["CATCH", "catching"],
      ["CATCH_DONE", "returning"],
      ["RETURN_DONE", "sleeping"],
    ];
    let s: CatState = "walking";
    let c = fresh();
    for (const [type, want] of steps) {
      ({ state: s, ctx: c } = transition(s, { type } as CatEvent, c));
      expect(s).toBe(want);
    }
    expect(c).toEqual({ chasesThisVisit: 1, chasesThisSession: 1 });
  });

  it("allows only one chase per visit", () => {
    const { s, c } = run(["TRIGGER", "SPOT_DONE", "LEAP_DONE", "CATCH", "CATCH_DONE", "RETURN_DONE", "TRIGGER"]);
    expect(s).toBe("sleeping");
    expect(canChase(c)).toBe(false);
  });

  it("enforces the hard session limit of 2", () => {
    expect(canChase({ chasesThisVisit: 0, chasesThisSession: 2 })).toBe(false);
    expect(run(["TRIGGER"], "sleeping", { chasesThisVisit: 0, chasesThisSession: 2 }).s).toBe("sleeping");
    expect(run(["TRIGGER"], "sleeping", { chasesThisVisit: 0, chasesThisSession: 1 }).s).toBe("spotting");
  });

  it("aborts mid-chase to returning, with no catch", () => {
    expect(run(["TRIGGER", "SPOT_DONE", "LEAP_DONE", "ABORT"]).s).toBe("returning");
    expect(run(["TRIGGER", "ABORT"]).s).toBe("sleeping");
  });

  it("snaps to sleeping on route change mid-sequence", () => {
    expect(run(["TRIGGER", "SPOT_DONE", "ROUTE_CHANGE"]).s).toBe("sleeping");
    expect(run(["SCROLL", "WAKE_DONE", "ROUTE_CHANGE"]).s).toBe("walking");
  });
});
