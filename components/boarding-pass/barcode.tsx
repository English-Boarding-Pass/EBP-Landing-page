/**
 * Purely decorative boarding-pass barcode. Bar widths are derived
 * deterministically from `seed` (e.g. a route code) so each route gets a
 * visually distinct pattern that stays stable across server/client render.
 */
export function Barcode({
  seed,
  className,
  tone = "navy",
}: {
  seed: string;
  className?: string;
  tone?: "navy" | "white";
}) {
  const { bars, totalWidth } = generateBars(seed, 42);
  const height = 32;

  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${totalWidth} ${height}`}
      preserveAspectRatio="none"
      className={className}
      role="presentation"
    >
      {bars.map((bar, i) => (
        <rect
          key={i}
          x={bar.x}
          y={0}
          width={bar.width}
          height={height}
          fill={tone === "white" ? "#ffffff" : "var(--color-brand-navy)"}
          opacity={tone === "white" ? 0.9 : 0.85}
        />
      ))}
    </svg>
  );
}

function generateBars(seed: string, count: number) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  const bars: { x: number; width: number }[] = [];
  let cursor = 0;
  for (let i = 0; i < count; i++) {
    h = (h * 1103515245 + 12345) >>> 0;
    const width = 1 + (h % 4);
    h = (h * 1103515245 + 12345) >>> 0;
    const gap = 1 + (h % 3);
    bars.push({ x: cursor, width });
    cursor += width + gap;
  }
  return { bars, totalWidth: cursor };
}
