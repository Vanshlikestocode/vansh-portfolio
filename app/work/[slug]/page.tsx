import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectDetail } from "@/components/work/ProjectDetail";
import { getProject, projects } from "@/data/projects";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const title = `${project.name} — ${project.subtitle}`;
  return {
    title,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: { title, description: project.summary, url: `/work/${project.slug}`, type: "article" },
    twitter: { title, description: project.summary },
  };
}

/** Shareable, crawlable version of each case study (the homepage opens the same content in a modal). */
export default async function ProjectPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <div className="mx-auto max-w-6xl px-0 pb-16 pt-24 sm:px-4">
      <div className="px-5 sm:px-10 lg:px-16">
        <Link
          href="/#work"
          className="label inline-flex items-center gap-2 text-mute transition-colors hover:text-paper"
        >
          <ArrowLeft className="size-3.5" /> All work
        </Link>
      </div>
      <div className="-mt-10">
        <ProjectDetail project={project} variant="page" />
      </div>
    </div>
  );
}
