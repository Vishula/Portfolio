export const CALM_KEY = "calm-water";

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function readCalm() {
  try {
    return localStorage.getItem(CALM_KEY) === "1";
  } catch {
    return false;
  }
}

export function writeCalm(on: boolean) {
  try {
    localStorage.setItem(CALM_KEY, on ? "1" : "0");
  } catch {}
  document.documentElement.classList.toggle("calm", on);
}

/** Runs before paint: marks JS as available and applies the saved "Calm water" choice. */
export const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');try{if(localStorage.getItem('${CALM_KEY}')==='1')d.classList.add('calm')}catch(e){}})();`;
