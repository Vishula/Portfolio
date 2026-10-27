import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const alt = `${SITE.name} — ${SITE.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: "#fff", display: "flex", flexDirection: "column", justifyContent: "center", padding: 96, color: "#1d1d1f" }}>
        <svg width="220" height="110" viewBox="-60 -30 120 60" style={{ marginBottom: 40 }}>
          <path
            d="M50 0 C30 -24 -18 -17 -34 0 C-18 17 30 24 50 0 M-34 0 L-62 -19 Q-50 0 -62 19 L-34 0 M8 -17 Q-6 -30 -16 -14"
            fill="none"
            stroke="#1d1d1f"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="36" cy="-4.5" r="2.2" fill="#1d1d1f" />
        </svg>
        <div style={{ fontSize: 128, fontWeight: 700, letterSpacing: "-0.045em", lineHeight: 0.92 }}>{SITE.name}</div>
        <div style={{ fontSize: 40, marginTop: 28, color: "#6e6e73" }}>{SITE.role}</div>
      </div>
    ),
    size,
  );
}
