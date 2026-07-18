import { ImageResponse } from "next/og";
import { site } from "@/config/site";

export const runtime = "edge";
export const alt = site.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 72,
          background:
            "linear-gradient(135deg, #06101f 0%, #0b1d3a 45%, #123a7a 100%)",
          color: "#f4f7ff",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            fontSize: 28,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#7eb6ff",
            marginBottom: 24,
          }}
        >
          {site.shortName}
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.15,
            maxWidth: 900,
          }}
        >
          {site.name}
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 28,
            color: "#c5d4f0",
            maxWidth: 820,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          {site.tagline}
        </div>
        <div
          style={{
            marginTop: 48,
            fontSize: 22,
            color: "#22d3ee",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          {site.trialOffer} · from {site.startingPrice}
        </div>
      </div>
    ),
    { ...size },
  );
}
