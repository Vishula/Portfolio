import type { CatPose } from "./catchSequence";

// The bottom-of-page cat: a round tabby in a blue-grey shark onesie, drawn with soft
// dark-brown outlines. CatStill rests and walks; CatDive is the same cat flying for the chase.
// Class names (cat-breathe, cat-leg, cat-ear, cat-tail, cat-body) reuse the existing CSS animations.

export type CatStillPose = "sleep" | "sit" | "stand" | "crouch" | "leap";

const O = "#3a2420"; // outline
const SW = 2.2;
const HOOD = "#7894a8";
const HOOD_DARK = "#5f7c91";
const CREAM = "#f7eedf";
const TABBY = "#b39c84";
const STRIPE = "#7d6550";
const MOUTH = "#d9714a";

// Shark teeth around the hood opening: small triangles pointing inward.
const TEETH = (() => {
  const out: string[] = [];
  const ring = (deg: number, k = 1) => {
    const a = (deg * Math.PI) / 180;
    return [60 + Math.cos(a) * 22.5 * k, 54 + Math.sin(a) * 18.5 * k] as const;
  };
  const angles = [205, 225, 245, 265, 285, 305, 325, 35, 60, 90, 120, 145];
  for (const d of angles) {
    const [x1, y1] = ring(d - 7);
    const [x2, y2] = ring(d + 7);
    const [tx, ty] = ring(d, 0.78);
    out.push(`M${x1.toFixed(1)} ${y1.toFixed(1)} L${tx.toFixed(1)} ${ty.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)} Z`);
  }
  return out.join(" ");
})();

type Arms = "down" | "mid" | "up";
type Eyes = "open" | "closed";

function Arm({ side, arms }: { side: -1 | 1; arms: Arms }) {
  const sx = 60 + side * 20;
  const rot = arms === "up" ? 150 : arms === "mid" ? 80 : 0;
  // Drawn for the left side, mirrored for the right.
  return (
    <g transform={`rotate(${-side * rot} ${sx} 84)`}>
      <g transform={side === 1 ? `translate(120 0) scale(-1 1)` : undefined}>
        <path d="M36 84 C 33 94, 35 102, 39 106 C 43 109.5, 50 109, 52 104 L 52 89 C 48 82, 40 80, 36 84 Z" fill={TABBY} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
        <path d="M38 90 L 47 92 M37.5 96 L 47 98 M39 101.5 L 47 103" stroke={STRIPE} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M38 104.5 C 40 109, 50 110, 52 104.5" fill={CREAM} stroke={O} strokeWidth={SW} strokeLinecap="round" />
        <path d="M43 106.5 L 43 108.6 M47 106.5 L 47 108.6" stroke={O} strokeWidth="0.9" strokeLinecap="round" />
      </g>
    </g>
  );
}

function Foot({ side, cls, swing = 0 }: { side: -1 | 1; cls?: string; swing?: number }) {
  const x = 60 + side * 12;
  return (
    <g transform={swing ? `rotate(${swing} ${x} 116)` : undefined}>
      <g className={cls}>
        <path d={`M${x - 9} 116 C ${x - 10} 126, ${x - 9} 133, ${x - 3} 135 L ${x + 3} 135 C ${x + 9} 133, ${x + 10} 126, ${x + 9} 116 Z`} fill={CREAM} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
        <path d={`M${x - 8} 119 C ${x - 4} 121, ${x + 4} 121, ${x + 8} 119`} fill="none" stroke={TABBY} strokeWidth="4" opacity="0.8" />
        <path d={`M${x - 2} 131.5 L ${x - 2} 134.5 M${x + 2} 131.5 L ${x + 2} 134.5`} stroke={O} strokeWidth="0.9" strokeLinecap="round" />
      </g>
    </g>
  );
}

/** The whole cat, upright and facing the viewer, in a 120 x 150 box (feet at y≈135). */
function Body({ eyes = "open", arms = "down", legSwing = 0, walk = false }: { eyes?: Eyes; arms?: Arms; legSwing?: number; walk?: boolean }) {
  return (
    <>
      {/* shark tail */}
      <g className="cat-tail">
        <path d="M82 120 C 94 120, 103 113, 107 102 C 110 110, 112 118, 116 132 C 104 133, 92 131, 82 127 Z" fill={HOOD} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      </g>
      {/* side fins */}
      <path d="M36 86 C 24 92, 15 101, 12 112 C 22 108, 30 104, 37 101 Z" fill={HOOD} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M84 86 C 96 92, 105 101, 108 112 C 98 108, 90 104, 83 101 Z" fill={HOOD} stroke={O} strokeWidth={SW} strokeLinejoin="round" />

      <Foot side={-1} cls={walk ? "cat-leg a" : undefined} swing={legSwing} />
      <Foot side={1} cls={walk ? "cat-leg b" : undefined} swing={-legSwing} />

      <g className="cat-body">
        {/* onesie: hood drapes down both sides of the body */}
        <path d="M22 58 C 18 30, 36 12, 60 12 C 84 12, 102 30, 98 58 C 96 72, 90 80, 87 85 L 88 120 C 72 127, 48 127, 32 120 L 33 85 C 30 80, 24 72, 22 58 Z" fill={HOOD} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
        <path d="M30 36 C 28 26, 31 18, 37 12 C 41 18, 43 24, 43 28" fill={HOOD} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
        <g className="cat-ear">
          <path d="M90 36 C 92 26, 89 18, 83 12 C 79 18, 77 24, 77 28" fill={HOOD} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
        </g>
        <path d="M30 70 C 32 60, 34 52, 34 44" fill="none" stroke={HOOD_DARK} strokeWidth="1.4" opacity="0.6" />
        <circle cx="37" cy="31" r="3.3" fill={O} />
        <circle cx="83" cy="31" r="3.3" fill={O} />

        {/* cream belly */}
        {/* no outline along the top, so the belly tucks under the hood rim */}
        <path d="M39 66 C 37 86, 35 108, 37 123 C 48 129, 72 129, 83 123 C 85 108, 83 86, 81 66 Z" fill={CREAM} />
        <path d="M38.4 74 C 36 92, 35 108, 37 123 C 48 129, 72 129, 83 123 C 85 108, 84 92, 81.6 74" fill="none" stroke={O} strokeWidth={SW} strokeLinecap="round" />
        <path d="M52 84 C 54 82, 55 85, 57 83 C 59 81, 60 84, 62 82 M56 112 C 58 110, 59 113, 61 111" fill="none" stroke="#e2c9a8" strokeWidth="1.1" strokeLinecap="round" />
        <path d="M40 112 C 44 116, 46 120, 45 124 M80 112 C 76 116, 74 120, 75 124" fill="none" stroke={TABBY} strokeWidth="5" strokeLinecap="round" opacity="0.75" />

        {/* hood opening: cream rim, red mouth with teeth, then the face */}
        <ellipse cx="60" cy="54" rx="27" ry="23" fill={CREAM} stroke={O} strokeWidth={SW} />
        <ellipse cx="60" cy="54" rx="22.5" ry="18.5" fill={MOUTH} stroke="#a8452e" strokeWidth="0.9" />
        <path d={TEETH} fill="#fffaf2" stroke="#b5533a" strokeWidth="0.7" strokeLinejoin="round" />
        <ellipse cx="60" cy="55" rx="17.5" ry="14" fill="#efe3d1" />
        <ellipse cx="45.5" cy="52" rx="5" ry="6.5" fill={TABBY} opacity="0.85" />
        <ellipse cx="74.5" cy="52" rx="5" ry="6.5" fill={TABBY} opacity="0.85" />
        <path d="M52 42.5 L 53.5 47 M57 41.4 L 57.4 46.4 M62.6 41.4 L 62.4 46.4 M67.8 42.5 L 66.4 47" stroke={STRIPE} strokeWidth="1.5" strokeLinecap="round" />

        {/* face */}
        {eyes === "open" ? (
          <>
            <circle cx="52" cy="53.5" r="4.6" fill="#1f1412" />
            <circle cx="68" cy="53.5" r="4.6" fill="#1f1412" />
            <circle cx="53.5" cy="52" r="1.5" fill="#fff" />
            <circle cx="69.5" cy="52" r="1.5" fill="#fff" />
          </>
        ) : (
          <path d="M47.5 54 C 49.5 56.5, 54.5 56.5, 56.5 54 M63.5 54 C 65.5 56.5, 70.5 56.5, 72.5 54" fill="none" stroke="#1f1412" strokeWidth="1.5" strokeLinecap="round" />
        )}
        <path d="M58.2 58.6 L 61.8 58.6 L 60 60.6 Z" fill="#ec9fa0" />
        <path d="M60 60.6 L 60 61.6 M57.8 62.6 C 58.6 63.2, 59.4 63, 60 61.6 C 60.6 63, 61.4 63.2, 62.2 62.6" fill="none" stroke={O} strokeWidth="0.8" strokeLinecap="round" />
        <path d="M46 59 L 36 57.5 M46 61 L 36.5 62 M74 59 L 84 57.5 M74 61 L 83.5 62" stroke={O} strokeWidth="0.6" strokeLinecap="round" />
      </g>

      <Arm side={-1} arms={arms} />
      <Arm side={1} arms={arms} />
    </>
  );
}

export function CatStill({ pose }: { pose: CatStillPose }) {
  return (
    <svg viewBox="0 -4 120 146" width="100%" height="100%" aria-hidden="true" focusable="false" overflow="visible">
      {pose !== "leap" && <ellipse cx="60" cy="137" rx="38" ry="4.5" fill="#3a2420" opacity="0.1" />}
      {pose === "sleep" && (
        <g>
          <g className="cat-breathe" transform="rotate(-6 60 130)">
            <Body eyes="closed" />
          </g>
          <path d="M98 20 h6 l-6 7 h6 M108 8 h4 l-4 5 h4" fill="none" stroke={O} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
        </g>
      )}
      {pose === "sit" && <Body />}
      {pose === "stand" && <Body walk />}
      {pose === "crouch" && (
        <g transform="translate(0 10) scale(1 0.92)">
          <Body arms="mid" />
        </g>
      )}
      {pose === "leap" && <Body arms="up" legSwing={24} />}
    </svg>
  );
}

// Flying for the chase: the upright cat turned onto its side, paws reaching ahead (right).
// Paws land near (100, 36) in this viewBox, where the catch sequence puts the catch point.
const DIVE: Record<CatPose, { arms: Arms; legs: number }> = {
  "bound-a": { arms: "up", legs: 22 },
  "bound-b": { arms: "up", legs: -22 },
  pounce: { arms: "up", legs: 0 },
  float: { arms: "mid", legs: 12 },
  shrug: { arms: "down", legs: 0 },
};

export function CatDive({ pose }: { pose: CatPose }) {
  const { arms, legs } = DIVE[pose];
  return (
    <svg viewBox="0 -4 116 62" width="100%" height="100%" aria-hidden="true" focusable="false" overflow="visible">
      <g transform="translate(84 -11) scale(0.62) rotate(90)">
        <Body arms={arms} legSwing={legs} />
      </g>
    </svg>
  );
}
