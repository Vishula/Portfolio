# Vish — portfolio of Vishula Gamaetige

> **Status: 🟢 Operational** · Open to cloud and systems engineering conversations

**Live site:** https://YOUR-SITE.vercel.app · **LinkedIn:** [vishula-gamaetige](https://www.linkedin.com/in/vishula-gamaetige-aab039126/) · **Email:** vpgamaetige@gmail.com

I'm a Systems Administrator in Brisbane with 5+ years across managed services, local and state government and healthcare. By day I look after Microsoft 365, Entra ID and hybrid infrastructure across multiple client tenants. This repo is the website I built to show it, written up the way I'd document any system I run.

---

## Service overview

| Component | What it does | Built with |
|---|---|---|
| **Fish tank** | Line-drawn fish swim behind every page, scatter from your cursor and respect `prefers-reduced-motion` | PixiJS 8 |
| **The shark cat** | A cat in a shark onesie walks along the bottom as you scroll, somersaults over the nav bar, and once per visit chases a fish to the Resume button | GSAP, SVG, a tested state machine |
| **Resume courier** | A small figure walks over and reaches for the Resume button when you hover it | React, CSS |
| **CRT robot** | The hero poster: a CRT-headed robot whose screen switches between a pixel face and `whoami` | Hand-drawn SVG |
| **Scroll statement** | The About paragraph lights up word by word as you scroll | React, CSS |
| **Calm water** | One switch turns all motion off for anyone who prefers a still page | Zustand |

**Stack:** Next.js 16 (App Router, Cache Components) · React 19 · TypeScript · Tailwind CSS v4 · PixiJS · GSAP · Motion · Zustand · Vitest · Vercel

---

## Runbook

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # cat state-machine tests (Vitest)
npm run build      # production build, as Vercel runs it
```

---

## Known issues

- None in production. Several fish have been reported for loitering.

## Incident history

| Date | Severity | Summary |
|---|---|---|
| 2026 | Low | Cat was found sleeping on the job. Resolved: it now wakes up when you scroll. |

---

<sub>Designed for fun. If you're hiring for cloud or systems engineering, the Resume button is in the top right — the cat will probably get there first.</sub>
