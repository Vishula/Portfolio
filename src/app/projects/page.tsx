import type { Metadata } from "next";
import { allEntries } from "@/lib/content";
import ProjectList from "./ProjectList";

export const metadata: Metadata = {
  title: "Projects",
  description: "Projects and case studies by Vishula Gamaetige.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  const entries = allEntries().map((e) => ({ slug: e.slug, title: e.title, summary: e.summary, tags: e.tags, kind: e.kind, date: e.date.toISOString() }));
  return (
    <section className="wrap pb-24 pt-[clamp(120px,18vh,200px)]" aria-labelledby="projects-title">
      <p className="t-label mb-6">Work</p>
      <h1 id="projects-title" className="t-h2 max-w-[14ch]">
        Projects.
      </h1>
      {entries.length > 0 && <ProjectList entries={entries} />}
    </section>
  );
}
