import type { Metadata } from "next";
import { ArrowDownToLine, ArrowUpRight, Mail } from "lucide-react";
import { RESUME_HREF, SITE } from "@/lib/site";
import { Status } from "@/components/sections/Sections";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Vishula Gamaetige about cloud and systems engineering roles: Microsoft 365, Entra ID, Azure and networking.",
  alternates: { canonical: "/contact" },
};

const CARD = "glass group flex items-center justify-between gap-6 rounded-[28px] p-6 transition hover:-translate-y-0.5 sm:p-8";

export default function ContactPage() {
  // mailto opens the visitor's own mail app with the address and a subject filled in.
  const mailto = `mailto:${SITE.email}?subject=${encodeURIComponent(`Hello ${SITE.name}`)}`;
  return (
    <section className="wrap pb-24 pt-[clamp(120px,18vh,200px)]" aria-labelledby="contact-title">
      <p className="t-label mb-6">Contact</p>
      <h1 id="contact-title" className="t-h2 max-w-[10ch]">
        Say hello<span className="text-accent">.</span>
      </h1>
      <Status className="mt-8" />
      <p className="mt-6 max-w-[40ch] text-ink-2">Roles, projects or a quick question about your Microsoft 365 setup. I reply within two business days.</p>

      <ul className="mt-12 grid max-w-[720px] gap-4">
        <li>
          <a href={mailto} className={CARD}>
            <span className="flex min-w-0 items-center gap-5">
              <span className="grid h-12 w-12 flex-none place-items-center rounded-2xl bg-accent text-white">
                <Mail size={22} strokeWidth={1.6} aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-[14px] text-ink-2">Email</span>
                <span className="block break-all text-[clamp(18px,1.4vw+12px,26px)] font-semibold text-ink">{SITE.email}</span>
              </span>
            </span>
            <ArrowUpRight size={22} strokeWidth={1.6} className="flex-none text-accent transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
          </a>
        </li>
        {SITE.linkedin && (
          <li>
            <a href={SITE.linkedin} className={CARD} target="_blank" rel="noopener noreferrer">
              <span className="flex min-w-0 items-center gap-5">
                <span className="grid h-12 w-12 flex-none place-items-center rounded-2xl bg-accent text-[18px] font-bold text-white" aria-hidden="true">
                  in
                </span>
                <span className="min-w-0">
                  <span className="block text-[14px] text-ink-2">LinkedIn</span>
                  <span className="block text-[clamp(18px,1.4vw+12px,26px)] font-semibold text-ink">{SITE.fullName}</span>
                </span>
              </span>
              <ArrowUpRight size={22} strokeWidth={1.6} className="flex-none text-accent transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            </a>
          </li>
        )}
        <li>
          <a href={RESUME_HREF} download className={CARD}>
            <span className="flex min-w-0 items-center gap-5">
              <span className="grid h-12 w-12 flex-none place-items-center rounded-2xl border border-liner bg-white/70 text-accent">
                <ArrowDownToLine size={22} strokeWidth={1.6} aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-[14px] text-ink-2">Resume</span>
                <span className="block text-[clamp(18px,1.4vw+12px,26px)] font-semibold text-ink">Download PDF</span>
              </span>
            </span>
          </a>
        </li>
      </ul>
    </section>
  );
}
