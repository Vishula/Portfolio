import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { allEntries, getEntry } from "@/lib/content";
import ReadingPlate from "@/components/chrome/ReadingPlate";
import ProjectView from "./ProjectView";
import { SITE } from "@/lib/site";

// Cache Components needs at least one param; with no entries yet, a placeholder slug prerenders the 404.
export function generateStaticParams() {
  const slugs = allEntries().map((e) => ({ slug: e.slug }));
  return slugs.length ? slugs : [{ slug: "none" }];
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const e = getEntry(slug);
  if (!e) return {};
  return { title: e.title, description: e.summary, alternates: { canonical: `/projects/${slug}` } };
}

// Params resolve inside Suspense so navigation gets an instant shell; every slug is still prerendered.
export default function EntryPage({ params }: PageProps<"/projects/[slug]">) {
  return (
    <Suspense fallback={<div className="min-h-svh" />}>
      <Entry params={params} />
    </Suspense>
  );
}

async function Entry({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = getEntry(slug);
  if (!e) notFound();
  const ld = {
    "@context": "https://schema.org",
    "@type": e.kind === "case-study" ? "Article" : "CreativeWork",
    headline: e.title,
    description: e.summary,
    datePublished: e.date.toISOString(),
    author: { "@type": "Person", name: SITE.name },
    ...(e.repo ? { codeRepository: e.repo } : {}),
  };

  return (
    <article className="wrap pb-24 pt-[clamp(120px,18vh,200px)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
      <ProjectView slug={slug} />
      <ReadingPlate className="mx-auto max-w-[68ch]">
        <Link href="/projects" className="inline-flex min-h-11 items-center gap-2 text-[15px] font-medium text-ink-2 hover:text-ink">
          <ArrowLeft size={16} strokeWidth={1.6} aria-hidden="true" /> All work
        </Link>
        <p className="t-label mt-8">
          {e.kind === "project" ? "Project" : "Case study"} · {e.tags.join(" · ")} ·{" "}
          {e.date.toLocaleDateString("en-AU", { month: "short", year: "numeric" })}
        </p>
        <h1 className="mt-4 text-[clamp(36px,3vw+26px,64px)] font-bold leading-[1.02] tracking-[-0.035em]">{e.title}</h1>
        <p className="mt-6 text-ink-2">{e.summary}</p>
        {(e.repo || e.demo) && (
          <div className="mt-8 flex flex-wrap gap-3">
            {e.repo && (
              <a href={e.repo} className="glass inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-[15px] font-medium" rel="noopener noreferrer">
                GitHub repo <ArrowUpRight size={16} strokeWidth={1.6} aria-hidden="true" />
              </a>
            )}
            {e.demo && (
              <a href={e.demo} className="glass inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-[15px] font-medium" rel="noopener noreferrer">
                Live demo <ArrowUpRight size={16} strokeWidth={1.6} aria-hidden="true" />
              </a>
            )}
          </div>
        )}
        <div className="prose-tank mt-14">
          <MDXRemote source={e.body} />
        </div>
      </ReadingPlate>
    </article>
  );
}
