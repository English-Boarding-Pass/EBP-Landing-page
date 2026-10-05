// Simple brand-colour illustrations for the corporate page, standing in until
// real photography is supplied. Shapes only, no text, so they need no
// translation; each is decorative and hidden from assistive tech.

const frame = "h-auto w-full";

/** A boarding pass holding a batch of learners: the course cut to fit. */
export function TailoredIllustration() {
  const seats = Array.from({ length: 12 }, (_, i) => ({
    x: 86 + (i % 4) * 46,
    y: 100 + Math.floor(i / 4) * 40,
  }));

  return (
    <svg viewBox="0 0 400 280" aria-hidden className={frame}>
      <rect width="400" height="280" rx="20" className="fill-ice" />
      <rect
        x="50"
        y="60"
        width="300"
        height="160"
        rx="16"
        className="fill-white"
      />
      <line
        x1="260"
        y1="72"
        x2="260"
        y2="208"
        strokeWidth="2"
        strokeDasharray="6 6"
        className="stroke-navy/20"
      />
      <circle cx="260" cy="60" r="10" className="fill-ice" />
      <circle cx="260" cy="220" r="10" className="fill-ice" />
      {seats.map((seat, i) => (
        <circle
          key={i}
          cx={seat.x}
          cy={seat.y}
          r="12"
          className={i < 7 ? "fill-navy" : "fill-sky"}
        />
      ))}
      <rect x="280" y="92" width="50" height="8" rx="4" className="fill-navy" />
      <rect x="280" y="110" width="36" height="8" rx="4" className="fill-sky" />
      <rect x="280" y="128" width="44" height="8" rx="4" className="fill-sky" />
      <circle cx="305" cy="182" r="15" className="fill-red" />
      <path
        d="M298 182l5 5 9-10"
        fill="none"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-white"
      />
    </svg>
  );
}

/** A conversation, with a cup and a gem: the language of the actual job. */
export function WorkplaceIllustration() {
  return (
    <svg viewBox="0 0 400 280" aria-hidden className={frame}>
      <rect width="400" height="280" rx="20" className="fill-ice" />

      <rect
        x="50"
        y="48"
        width="190"
        height="84"
        rx="18"
        className="fill-navy"
      />
      <path d="M86 130v28l30-28z" className="fill-navy" />
      <rect x="74" y="74" width="120" height="9" rx="4.5" fill="#fff" />
      <rect x="74" y="95" width="84" height="9" rx="4.5" className="fill-sky" />

      <rect
        x="160"
        y="150"
        width="190"
        height="84"
        rx="18"
        className="fill-white"
      />
      <path d="M314 152v-28l-30 28z" className="fill-white" />
      <rect
        x="184"
        y="176"
        width="110"
        height="9"
        rx="4.5"
        className="fill-navy"
      />
      <rect
        x="184"
        y="197"
        width="140"
        height="9"
        rx="4.5"
        className="fill-sky"
      />

      {/* Cup */}
      <rect
        x="286"
        y="62"
        width="44"
        height="36"
        rx="8"
        className="fill-navy"
      />
      <path
        d="M330 70h6a10 10 0 010 20h-6"
        fill="none"
        strokeWidth="5"
        className="stroke-navy"
      />
      <path
        d="M299 52q5-6 0-12M315 52q5-6 0-12"
        fill="none"
        strokeWidth="3"
        strokeLinecap="round"
        className="stroke-red"
      />

      {/* Gem */}
      <path d="M68 198l18-20h28l18 20-32 36z" className="fill-sky" />
      <path
        d="M68 198h64M86 178l14 20 14-20M100 198v36"
        fill="none"
        strokeWidth="2"
        strokeLinejoin="round"
        className="stroke-navy/30"
      />
    </svg>
  );
}

/** Before and after bars for each learner, with the trend rising. */
export function EvaluationIllustration() {
  const learners = [
    { x: 80, before: 50, after: 110 },
    { x: 170, before: 70, after: 140 },
    { x: 260, before: 40, after: 100 },
  ];

  return (
    <svg viewBox="0 0 400 280" aria-hidden className={frame}>
      <rect width="400" height="280" rx="20" className="fill-ice" />
      {learners.map((learner) => (
        <g key={learner.x}>
          <rect
            x={learner.x}
            y={226 - learner.before}
            width="28"
            height={learner.before}
            rx="6"
            className="fill-sky"
          />
          <rect
            x={learner.x + 34}
            y={226 - learner.after}
            width="28"
            height={learner.after}
            rx="6"
            className="fill-navy"
          />
        </g>
      ))}
      <line
        x1="56"
        y1="230"
        x2="344"
        y2="230"
        strokeWidth="3"
        strokeLinecap="round"
        className="stroke-navy/20"
      />
      <path
        d="M70 96L332 44M308 38l24 6-14 20"
        fill="none"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-red"
      />
    </svg>
  );
}
