import Link from "next/link";
import {
  ArrowDownToLine,
  ArrowRight,
  CloudUpload,
  GraduationCap,
  LayoutGrid,
  Lock,
  MonitorPlay,
  Network,
  RotateCw,
  Server,
  ShieldCheck,
  SquareTerminal,
  type LucideIcon,
} from "lucide-react";
import { ABOUT, EDUCATION, EXPERIENCE, SITE, TOOLS } from "@/lib/site";
import { RESUME_HREF } from "@/lib/site";
import ScrollStatement from "./ScrollStatement";
import HeroArt from "./HeroArt";

const ICONS: Record<string, LucideIcon> = {
  Lock,
  CloudUpload,
  ShieldCheck,
  SquareTerminal,
  Server,
  Network,
  RotateCw,
  MonitorPlay,
};

const PRIMARY =
  "inline-flex min-h-12 items-center gap-2 rounded-full bg-accent px-6 text-[16px] font-medium text-white transition hover:-translate-y-px hover:brightness-110 active:scale-[0.97]";

function Label({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <p className="t-label mb-6" data-reveal suppressHydrationWarning>
      <span className="tabular-nums text-accent">{n}</span>
      <span className="mx-2 text-liner">/</span>
      {children}
    </p>
  );
}

/** "Open to …" status: a live dot and a mono caption, the first thing visitors read. */
export function Status({ className = "" }: { className?: string }) {
  return (
    <p className={`status ${className}`}>
      <span className="status-dot" aria-hidden="true" />
      {SITE.status}
    </p>
  );
}

export function Hero() {
  return (
    <section className="screen wrap" aria-labelledby="hero-title">
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)]">
        <div>
          <div className="mb-8 grid gap-2" data-reveal suppressHydrationWarning>
            <p className="text-[16px] font-semibold text-ink">
              {SITE.fullName} <span className="font-normal text-ink-2">· {SITE.location}</span>
            </p>
            <Status />
          </div>
          <h1 id="hero-title" className="t-display" data-reveal suppressHydrationWarning>
            {SITE.name}
            <span className="text-accent">.</span>
          </h1>
          <p className="t-h3 mt-8 max-w-[22ch] font-medium" data-reveal suppressHydrationWarning>
            {SITE.role}
          </p>
          <p className="mt-6 max-w-[34ch] text-ink-2" data-reveal suppressHydrationWarning>
            {SITE.pitch}
          </p>
          <div className="mt-12 flex flex-wrap gap-3" data-reveal suppressHydrationWarning>
            <a href={RESUME_HREF} download className={PRIMARY}>
              <ArrowDownToLine size={18} strokeWidth={1.6} aria-hidden="true" />
              Download resume
            </a>
            <Link
              href="/contact"
              className="glass inline-flex min-h-12 items-center gap-2 rounded-full px-6 text-[16px] font-medium transition hover:-translate-y-px active:scale-[0.97]"
            >
              Get in touch
              <ArrowRight size={18} strokeWidth={1.6} aria-hidden="true" />
            </Link>
          </div>
        </div>
        <div className="hidden lg:block" data-reveal suppressHydrationWarning>
          <HeroArt />
        </div>
      </div>
    </section>
  );
}

export function About() {
  return (
    <section className="screen wrap" aria-labelledby="about-title">
      <Label n="01">About</Label>
      <h2 id="about-title" className="sr-only">
        About me
      </h2>
      <ScrollStatement parts={ABOUT} />
    </section>
  );
}

export function Skills() {
  return (
    <section className="screen wrap" aria-labelledby="skills-title">
      <Label n="02">Skills</Label>
      <h2 id="skills-title" className="t-h2" data-reveal suppressHydrationWarning>
        Tools of the trade.
      </h2>
      <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {TOOLS.map((g) => {
          const Icon = ICONS[g.icon] ?? LayoutGrid;
          return (
            <li key={g.group} className="glass rounded-[24px] p-6" data-reveal suppressHydrationWarning>
              <Icon size={24} strokeWidth={1.4} className="text-accent" aria-hidden="true" />
              <h3 className="mt-8 text-[17px] font-semibold text-ink">{g.group}</h3>
              <p className="mt-3 text-[14px] leading-[1.75] text-ink-2">{g.items.join(" · ")}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function Experience() {
  return (
    <section className="screen wrap" aria-labelledby="exp-title">
      <Label n="03">Experience</Label>
      <h2 id="exp-title" className="t-h2 max-w-[14ch]" data-reveal suppressHydrationWarning>
        Five years of keeping things running.
      </h2>
      <ol className="mt-14 grid gap-14">
        {EXPERIENCE.map((r) => (
          <li key={r.title + r.dates} className="grid gap-4 md:grid-cols-[200px_1fr] md:gap-10" data-reveal suppressHydrationWarning>
            <div>
              <p className="t-label text-ink">{r.dates}</p>
              <p className="mt-1 text-[14px] text-accent">{r.sector}</p>
            </div>
            <div className="max-w-[760px]">
              <h3 className="t-h3">{r.title}</h3>
              <p className="text-ink-2">{r.company}</p>
              <ul className="mt-4 grid list-disc gap-2 pl-5 text-[17px] font-normal leading-[1.6] text-ink/90 marker:text-accent">
                {r.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <p className="mt-4 text-[14px] leading-[1.75] text-ink-2">
                <span className="font-medium text-ink">Tools</span> — {r.tools.join(" · ")}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function Education() {
  return (
    <section className="screen wrap" aria-labelledby="edu-title">
      <Label n="04">Education</Label>
      <h2 id="edu-title" className="t-h2 max-w-[14ch]" data-reveal suppressHydrationWarning>
        Still learning.
      </h2>
      <ul className="mt-14 grid gap-4 md:grid-cols-3">
        {EDUCATION.map((e) => (
          <li key={e.name} className="glass flex flex-col gap-6 rounded-[28px] p-7" data-reveal suppressHydrationWarning>
            <GraduationCap size={28} strokeWidth={1.3} className="text-accent" aria-hidden="true" />
            <span className="t-h3 text-[20px]">{e.name}</span>
            <span className="mt-auto text-[15px] text-ink-2">{e.detail}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function CallToAction() {
  return (
    <section className="screen wrap items-start" aria-labelledby="cta-title" data-cat-cta>
      <Label n="05">Next</Label>
      <h2 id="cta-title" className="t-display" data-reveal suppressHydrationWarning>
        Let&rsquo;s talk<span className="text-accent">.</span>
      </h2>
      <Status className="mt-8" />
      <p className="mt-6 max-w-[36ch] text-ink-2" data-reveal suppressHydrationWarning>
        Hiring for a cloud or systems engineering role? I&rsquo;d like to hear about it. My resume has the details, and my inbox
        is one click away.
      </p>
      <div className="mt-12 flex flex-wrap gap-3" data-reveal suppressHydrationWarning>
        <a href={RESUME_HREF} download className={PRIMARY}>
          <ArrowDownToLine size={18} strokeWidth={1.6} aria-hidden="true" />
          Download resume
        </a>
        <Link
          href="/contact"
          className="glass inline-flex min-h-12 items-center gap-2 rounded-full px-6 text-[16px] font-medium transition hover:-translate-y-px active:scale-[0.97]"
        >
          Contact me
          <ArrowRight size={18} strokeWidth={1.6} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
