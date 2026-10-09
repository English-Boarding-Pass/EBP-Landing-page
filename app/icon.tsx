import { ImageResponse } from "next/og";
import { iconMark } from "@/lib/icon-mark";

// The browser tab icon: the EBP mark (lib/icon-mark.tsx), in several sizes.
// Google wants a favicon of at least 48px, in multiples of 48, for the small
// picture beside the site name in results; 192 and 512 are for the web app
// manifest (app/manifest.ts). The 32px one keeps the tab icon crisp.
const SIZES = [32, 48, 192, 512];

export function generateImageMetadata() {
  return SIZES.map((px) => ({
    id: String(px),
    size: { width: px, height: px },
    contentType: "image/png",
  }));
}

export default async function Icon({ id }: { id: Promise<string | number> }) {
  const px = Number(await id);
  return new ImageResponse(iconMark(px, { rounded: true }), {
    width: px,
    height: px,
  });
}
