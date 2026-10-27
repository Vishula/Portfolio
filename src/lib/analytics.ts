import { track as vercelTrack } from "@vercel/analytics";

type Events = {
  resume_download: { source: "button" | "catch" | "cta" };
  cat_chase_started: Record<string, never>;
  cat_catch: Record<string, never>;
  cat_aborted: Record<string, never>;
  project_view: { slug: string };
};

/** 50/50 flag so resume downloads can be compared with the cat on vs off. */
export function catEnabled() {
  try {
    let v = localStorage.getItem("cat-flag");
    if (!v) {
      v = Math.random() < 0.5 ? "on" : "off";
      localStorage.setItem("cat-flag", v);
    }
    return v === "on" || new URLSearchParams(location.search).has("chase");
  } catch {
    return true;
  }
}

export function track<K extends keyof Events>(name: K, props?: Events[K]) {
  let cat = "unknown";
  try {
    cat = localStorage.getItem("cat-flag") ?? "unknown";
  } catch {}
  try {
    vercelTrack(name, { ...(props ?? {}), cat });
  } catch {}
}
