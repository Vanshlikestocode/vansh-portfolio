import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#08080a",
          color: "#ecebe6",
          fontSize: 120,
          fontWeight: 700,
          letterSpacing: -8,
        }}
      >
        V<span style={{ color: "#ff5b1f" }}>.</span>
      </div>
    ),
    size,
  );
}
