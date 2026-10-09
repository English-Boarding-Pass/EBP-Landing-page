import { ImageResponse } from "next/og";
import { iconMark } from "@/lib/icon-mark";

// The icon phones use when someone saves the site to their home screen.
// Same mark as app/icon.tsx, at the size iOS asks for. No rounded corners:
// iOS applies its own mask.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(iconMark(size.width, { rounded: false }), {
    ...size,
  });
}
