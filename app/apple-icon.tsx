import { ImageResponse } from "next/og";

// The icon phones use when someone saves the site to their home screen.
// Same mark as app/icon.tsx, at the size iOS asks for. No rounded corners:
// iOS applies its own mask.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0B1956",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          color: "#9CCCF6",
          fontSize: 112,
          fontWeight: 800,
          lineHeight: 1,
        }}
      >
        E
      </div>
    </div>,
    { ...size },
  );
}
