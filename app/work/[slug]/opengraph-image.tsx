import { ImageResponse } from "next/og";
import { getProject, projects } from "@/data/projects";

export const alt = "Project case study by V — Vansh Apurva Dave";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectOgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  const name = project?.name ?? "Project";
  const accent = project?.accent ?? "#ff5b1f";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#08080a",
          backgroundImage: `radial-gradient(900px 500px at 85% 110%, ${accent}33, transparent 70%)`,
          color: "#ecebe6",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 22, letterSpacing: 4, color: accent }}>
          <div style={{ width: 40, height: 2, background: accent }} />
          {(project?.category ?? "Case study").toUpperCase()}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 120, fontWeight: 700, letterSpacing: -5, lineHeight: 1 }}>{name}</div>
          <div style={{ fontSize: 34, color: "#c8c6bf", maxWidth: 900 }}>{project?.subtitle}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: 3, color: "#95928b" }}>
          <span>V — AI ENGINEER × PRODUCT BUILDER</span>
          <span style={{ color: "#ff5b1f" }}>V.</span>
        </div>
      </div>
    ),
    size,
  );
}
