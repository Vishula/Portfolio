import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

// Typed content collections from MDX files in src/content.
const Frontmatter = z.object({
  title: z.string(),
  summary: z.string(),
  tags: z.array(z.enum(["Azure", "M365", "Networking", "Automation"])),
  date: z.coerce.date(),
  repo: z.string().url().optional(),
  demo: z.string().url().optional(),
  cover: z.string().optional(),
});

export type Kind = "project" | "case-study";
export type Entry = z.infer<typeof Frontmatter> & { slug: string; kind: Kind; body: string };

const ROOT = path.join(process.cwd(), "src", "content");
const DIRS: Record<Kind, string> = { project: "projects", "case-study": "case-studies" };

function load(kind: Kind): Entry[] {
  const dir = path.join(ROOT, DIRS[kind]);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => {
      const { data, content } = matter(fs.readFileSync(path.join(dir, f), "utf8"));
      const fm = Frontmatter.parse(data);
      return { ...fm, slug: f.replace(/\.mdx$/, ""), kind, body: content };
    });
}

export function allEntries(): Entry[] {
  return [...load("project"), ...load("case-study")].sort((a, b) => +b.date - +a.date);
}

export function getEntry(slug: string) {
  return allEntries().find((e) => e.slug === slug) ?? null;
}
