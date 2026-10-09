// The small EBP mark used for the browser tab icon and the home screen icon.
// It echoes the wordmark: "E" in white, "BP" in sky blue, and the fading bar
// underneath. The letters are drawn as bold strokes, not set in a font: the
// image renderer only has a thin default font, and strokes stay crisp at 16px.
// Everything is drawn in a 100 x 100 box and scaled to `px`.
export function iconMark(px: number, { rounded }: { rounded: boolean }) {
  const stroke = 7;
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0B1956",
        borderRadius: rounded ? Math.round(px * 0.22) : 0,
      }}
    >
      <svg
        width={px}
        height={px}
        viewBox="0 0 100 100"
        fill="none"
        strokeWidth={stroke}
        strokeLinejoin="miter"
      >
        <defs>
          <linearGradient id="bar" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#FFFFFF" />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g transform="translate(1.5 0)">
          {/* E */}
          <path d="M27 29 H11 V63 H27 M11 46 H24" stroke="#FFFFFF" />
          {/* B */}
          <path
            d="M38 29 H46 Q54 29 54 37.5 Q54 46 46 46 H38 M46 46 Q55 46 55 54.5 Q55 63 46 63 H38 V29"
            stroke="#9CCCF6"
          />
          {/* P */}
          <path
            d="M66.5 63 V29 H76 Q86 29 86 37.5 Q86 46 76 46 H66.5"
            stroke="#9CCCF6"
          />
        </g>
        <rect x="28" y="75" width="44" height="6" rx="3" fill="url(#bar)" />
      </svg>
    </div>
  );
}
