import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const alt = "V — AI Engineer & Product Builder. Ideas in. Systems out.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const grid = "linear-gradient(to right, rgba(236,235,230,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(236,235,230,0.06) 1px, transparent 1px)";
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
          backgroundImage: grid,
          backgroundSize: "72px 72px",
          color: "#ecebe6",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 22, color: "#95928b", letterSpacing: 4 }}>
          <div style={{ width: 40, height: 2, background: "#ff5b1f" }} />
          HI, I&apos;M V — {site.name.toUpperCase()}
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 128, fontWeight: 700, letterSpacing: -6, lineHeight: 0.95 }}>
          <span>Ideas in.</span>
          <span style={{ display: "flex" }}>
            Systems&nbsp;<span style={{ color: "#ff5b1f", fontStyle: "italic" }}>out.</span>
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#c8c6bf", letterSpacing: 3 }}>
          <span>AI ENGINEER × PRODUCT BUILDER × FULL-STACK</span>
          <span style={{ color: "#ff5b1f" }}>V.</span>
        </div>
      </div>
    ),
    size,
  );
}
