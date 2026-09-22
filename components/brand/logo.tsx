import { clsx } from "clsx";

type LogoProps = {
  /** "inverted" is for dark (navy) backgrounds — hero, footer. */
  variant?: "default" | "inverted";
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  className?: string;
};

const sizeMap = {
  sm: { word: "text-lg", tagline: "text-[9px]", bar: "w-16" },
  md: { word: "text-2xl", tagline: "text-[11px]", bar: "w-24" },
  lg: { word: "text-4xl sm:text-5xl", tagline: "text-sm", bar: "w-32" },
} as const;

/**
 * Typographic reconstruction of the EBP wordmark per the brand guidelines
 * (no vector logo file was supplied). "English" in Deep Navy, "Boarding
 * Pass" in Sky Blue, both Manrope ExtraBold, with the tagline in DM Sans
 * and a fading gradient bar beneath — matching the guideline's logomark
 * spec exactly. If an official logo file is produced later, swap this
 * component's markup for an <Image> and keep the same props contract.
 */
export function Logo({
  variant = "default",
  size = "md",
  showTagline = true,
  className,
}: LogoProps) {
  const s = sizeMap[size];
  const inverted = variant === "inverted";

  return (
    <div className={clsx("inline-flex flex-col", className)}>
      <span
        className={clsx(
          "font-display font-extrabold leading-[0.95] tracking-tight",
          s.word,
          inverted ? "text-white" : "text-navy",
        )}
      >
        English
      </span>
      <span
        className={clsx(
          "font-display font-extrabold leading-[0.95] tracking-tight",
          s.word,
          inverted ? "text-sky" : "text-sky-ink",
        )}
      >
        Boarding Pass
      </span>
      {showTagline ? (
        <span
          className={clsx(
            "mt-1 font-body tracking-wide",
            s.tagline,
            inverted ? "text-white/80" : "text-slate",
          )}
        >
          English That Takes You Places
        </span>
      ) : null}
      <span
        aria-hidden
        className={clsx(
          "mt-1.5 h-1 rounded-full",
          s.bar,
          inverted
            ? "bg-gradient-to-r from-white to-white/0"
            : "bg-gradient-to-r from-sky to-sky/0",
        )}
      />
    </div>
  );
}
