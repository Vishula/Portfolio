
// The site's mascot: a figure in a blue hoodie and a tall blue beanie (face hidden),
// brown legs, white socks and white-and-blue sneakers, lounging on a blue beanbag.
// He stands beside the Resume button and walks over to reach for it (see Companion).
// Class names (cat-breathe, cat-leg, cat-ear, cat-tail) reuse the existing CSS animations.

export type StillPose = "sleep" | "sit" | "stand" | "crouch";
type Pt = [number, number];

const SKIN = "#5a3c1b";
const SOCK = "#f7f4ee";
const SHOE = "#fbfbfd";
const SOLE = "#2f7fea";
const PANEL = "#6aa8f2";
const FUNNEL = "#2a72de";
const CUFF = "#3a7dda";
const HAND = "#4a3115";

function Defs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-hood`} x1="0.2" y1="0" x2="0.8" y2="1">
        <stop offset="0" stopColor="#4d96f7" />
        <stop offset="0.55" stopColor="#2f7ef0" />
        <stop offset="1" stopColor="#1c63d6" />
      </linearGradient>
      <linearGradient id={`${id}-beanie`} x1="0.2" y1="0" x2="0.8" y2="1">
        <stop offset="0" stopColor="#7cb0ef" />
        <stop offset="1" stopColor="#3f82dc" />
      </linearGradient>
      <radialGradient id={`${id}-bag`} cx="0.4" cy="0.25" r="0.9">
        <stop offset="0" stopColor="#6aaaf8" />
        <stop offset="0.6" stopColor="#3487f0" />
        <stop offset="1" stopColor="#1f6ddc" />
      </radialGradient>
      <radialGradient id={`${id}-pom`} cx="0.38" cy="0.32" r="0.7">
        <stop offset="0" stopColor="#fffdf8" />
        <stop offset="1" stopColor="#e2d9c8" />
      </radialGradient>
      <radialGradient id={`${id}-shade`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#1c4fa8" stopOpacity="0.22" />
        <stop offset="1" stopColor="#1c4fa8" stopOpacity="0" />
      </radialGradient>
    </defs>
  );
}

/** White sneaker with a blue sole and a plain blue toe panel; ankle at the origin, toe along +x. */
function Shoe({ x, y, rot, flip = false, s = 1 }: { x: number; y: number; rot: number; flip?: boolean; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${flip ? -s : s} ${s})`}>
      <path d="M-5 -1 C -5 -6, 3 -7, 7 -4 C 11 -2, 16 -1, 16 3 L16 5 L-6 5 Z" fill={SHOE} />
      <path d="M8 -3 C 12 -2, 16 0, 16 3 L10 3 Z" fill={PANEL} />
      <path d="M-5 -1 L-5 4" stroke={PANEL} strokeWidth="3" strokeLinecap="round" />
      <path d="M-6 5 L16 5" stroke={SOLE} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M1 -5 L5 -2 M3 -6 L7 -3" stroke="#d9dde4" strokeWidth="0.9" strokeLinecap="round" />
    </g>
  );
}

/** Leg through the points (hip first), a slouchy sock at the ankle and a shoe. */
function Leg({ pts, rot, flip, s = 1, pointed, className }: { pts: Pt[]; rot?: number; flip?: boolean; s?: number; pointed?: boolean; className?: string }) {
  const [ax, ay] = pts[pts.length - 1];
  const [bx, by] = pts[pts.length - 2];
  const len = Math.hypot(ax - bx, ay - by);
  const k = Math.min(1, (9 * s) / len);
  const sx = ax + (bx - ax) * k;
  const sy = ay + (by - ay) * k;
  // Default: foot perpendicular to the shin, toe pointing the way the figure faces.
  // Pointed: foot stretched along the shin, sole down (diving).
  const ang = (Math.atan2(ay - by, ax - bx) * 180) / Math.PI;
  const r = rot ?? (pointed ? ang - 180 : ang - 90);
  if (pointed) flip = true;
  return (
    <g className={className}>
      <path d={`M${pts.map((p) => p.join(" ")).join(" L")}`} fill="none" stroke={SKIN} strokeWidth={8.5 * s} strokeLinecap="round" strokeLinejoin="round" />
      <path d={`M${sx} ${sy} L${ax} ${ay}`} stroke={SOCK} strokeWidth={10 * s} strokeLinecap="round" />
      <Shoe x={ax} y={ay} rot={r} flip={flip} s={s} />
    </g>
  );
}

export function FigureStill({ pose, reach = false }: { pose: StillPose; reach?: boolean }) {
  const id = "fs";
  const HOOD = `url(#${id}-hood)`;
  const BEANIE = `url(#${id}-beanie)`;
  const POM = `url(#${id}-pom)`;
  return (
    <svg viewBox="0 -18 120 166" width="100%" height="100%" aria-hidden="true" focusable="false" overflow="visible">
      <Defs id={id} />
      {(pose === "sit" || pose === "sleep") && (
        <>
          <ellipse cx="60" cy="140" rx="56" ry="6" fill={`url(#${id}-shade)`} />
          <path d="M6 116 C 2 92, 28 82, 60 84 C 94 82, 120 94, 114 118 C 110 138, 12 140, 6 116 Z" fill={`url(#${id}-bag)`} />
          <path d="M20 100 C 30 94, 44 92, 52 94 M70 92 C 84 92, 98 96, 104 104" fill="none" stroke="#1f63cf" strokeWidth="1.2" strokeLinecap="round" opacity="0.35" />
          {pose === "sit" ? (
            <>
              <Leg pts={[[50, 98], [16, 76], [24, 120]]} rot={-10} flip s={1.25} />
              <Leg pts={[[70, 98], [104, 76], [96, 120]]} rot={10} s={1.25} />
            </>
          ) : (
            <>
              <Leg pts={[[50, 102], [26, 106], [8, 120]]} rot={22} flip s={1.25} />
              <Leg pts={[[70, 102], [94, 106], [112, 120]]} rot={-22} s={1.25} />
            </>
          )}
          <g className="cat-breathe" transform={pose === "sleep" ? "translate(0 8)" : undefined}>
            <path d="M41 58 C 40 46, 48 38, 60 38 C 72 38, 80 46, 79 58 L82 100 C 72 105, 48 105, 38 100 Z" fill={HOOD} />
            <path d="M60 42 L60 100" stroke="#1d62d2" strokeWidth="1" opacity="0.35" />
            <path d="M45 50 C 35 62, 38 86, 55 94" fill="none" stroke={HOOD} strokeWidth="12" strokeLinecap="round" />
            <path d="M75 50 C 85 62, 82 86, 65 94" fill="none" stroke={HOOD} strokeWidth="12" strokeLinecap="round" />
            <ellipse cx="47" cy="52" rx="6" ry="3" fill="#fff" opacity="0.18" />
            <circle cx="57" cy="96" r="3.6" fill={HAND} />
            <circle cx="63" cy="96" r="3.6" fill={SKIN} />
            <path d="M50 40 L49 28 C 55 25, 65 25, 71 28 L70 40 Z" fill={FUNNEL} />
            <g transform={pose === "sleep" ? "rotate(-28 60 30)" : undefined}>
              <path d="M47 30 C 47 22, 73 22, 73 30 C 73 34, 47 34, 47 30 Z" fill={CUFF} />
              <path d="M50 24 C 48 10, 53 0, 60 -2 C 67 0, 72 10, 70 24 Z" fill={BEANIE} />
              <g className="cat-ear">
                <circle cx="60" cy="-8" r="8" fill={POM} />
              </g>
            </g>
          </g>
        </>
      )}
      {(pose === "stand" || pose === "crouch") && (
        <g transform={pose === "crouch" ? "translate(0 10) scale(1 0.92)" : undefined}>
          <ellipse cx="62" cy="142" rx="32" ry="5" fill={`url(#${id}-shade)`} />
          <Leg className="cat-leg b" pts={[[58, 100], [58, 132]]} s={1.15} />
          <Leg className="cat-leg a" pts={[[65, 100], [65, 132]]} s={1.15} />
          <g className="cat-body">
            <path d="M46 54 C 46 42, 56 36, 64 36 C 74 36, 80 44, 80 56 L82 102 C 72 106, 52 106, 44 102 Z" fill={HOOD} />
            <path d={reach ? "M68 48 C 78 40, 88 30, 95 21" : "M66 48 C 72 62, 74 80, 70 92"} fill="none" stroke={HOOD} strokeWidth="13" strokeLinecap="round" />
            <ellipse cx="58" cy="46" rx="6" ry="3" fill="#fff" opacity="0.18" />
            <circle cx={reach ? 98 : 70} cy={reach ? 17 : 96} r="3.6" fill={SKIN} />
            <path d="M56 38 L56 26 C 62 23, 70 23, 76 26 L76 38 Z" fill={FUNNEL} />
            <path d="M53 28 C 53 20, 79 20, 79 28 C 79 32, 53 32, 53 28 Z" fill={CUFF} />
            <g className="cat-tail">
              <path d="M56 22 C 52 10, 50 0, 44 -4 C 56 -2, 74 8, 76 22 Z" fill={BEANIE} />
              <circle cx="43" cy="-8" r="7.5" fill={POM} />
            </g>
          </g>
        </g>
      )}
    </svg>
  );
}
