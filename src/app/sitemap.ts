import type { MetadataRoute } from "next";
import { allEntries } from "@/lib/content";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/projects", "/contact"].map((p) => ({ url: `${SITE.url}${p}`, lastModified: new Date("2026-10-27") }));
  const entries = allEntries().map((e) => ({ url: `${SITE.url}/projects/${e.slug}`, lastModified: e.date }));
  return [...pages, ...entries];
}
