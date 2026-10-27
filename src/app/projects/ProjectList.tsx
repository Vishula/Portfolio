"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

type Item = { slug: string; title: string; summary: string; tags: string[]; kind: "project" | "case-study"; date: string };

const KINDS = [
  { id: "all", label: "All" },
  { id: "project", label: "Projects" },
  { id: "case-study", label: "Case studies" },
] as const;
const TAGS = ["Azure", "M365", "Networking", "Automation"] as const;

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`min-h-11 rounded-full border px-5 text-[15px] font-medium transition duration-200 active:scale-[0.96] ${
        on ? "border-accent bg-accent text-white" : "glass border-liner text-ink hover:-translate-y-px"
      }`}
    >
      {children}
    </button>
  );
}

export default function ProjectList({ entries }: { entries: Item[] }) {
  const [kind, setKind] = useState<(typeof KINDS)[number]["id"]>("all");
  const [tag, setTag] = useState<string | null>(null);
  const shown = entries.filter((e) => (kind === "all" || e.kind === kind) && (!tag || e.tags.includes(tag)));

  return (
    <>
      <div className="mt-12 flex flex-wrap gap-2" role="group" aria-label="Filter">
        {KINDS.map((k) => (
          <Chip key={k.id} on={kind === k.id} onClick={() => setKind(k.id)}>
            {k.label}
          </Chip>
        ))}
        <span className="mx-1 hidden w-px self-stretch bg-liner sm:block" aria-hidden="true" />
        {TAGS.map((t) => (
          <Chip key={t} on={tag === t} onClick={() => setTag(tag === t ? null : t)}>
            {t}
          </Chip>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {shown.length} items shown
      </p>
      <ul className="mt-12 grid gap-4 md:grid-cols-2">
        {shown.map((e) => (
          <li key={e.slug}>
            <Link href={`/projects/${e.slug}`} className="glass group flex h-full flex-col gap-4 rounded-[28px] p-7 transition duration-300 hover:-translate-y-0.5">
              <span className="t-label">{e.kind === "project" ? "Project" : "Case study"} · {e.tags.join(" · ")}</span>
              <span className="t-h3">{e.title}</span>
              <span className="text-ink-2">{e.summary}</span>
              <span className="mt-auto inline-flex items-center gap-1 pt-2 text-[15px] font-medium">
                Read <ArrowUpRight size={16} strokeWidth={1.6} className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
      {shown.length === 0 && <p className="mt-8 text-ink-2">Nothing here yet for that filter.</p>}
    </>
  );
}
