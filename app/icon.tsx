import { ImageResponse } from "next/og";
import { iconMark } from "@/lib/icon-mark";

// The browser tab icon: the EBP mark (lib/icon-mark.tsx).
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(iconMark(size.width, { rounded: true }), {
    ...size,
  });
}
