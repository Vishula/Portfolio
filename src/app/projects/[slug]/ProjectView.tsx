"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

export default function ProjectView({ slug }: { slug: string }) {
  useEffect(() => track("project_view", { slug }), [slug]);
  return null;
}
