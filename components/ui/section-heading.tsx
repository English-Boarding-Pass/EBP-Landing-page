import { clsx } from "clsx";
import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  tone = "navy",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "left" | "center";
  tone?: "navy" | "white";
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <span
        aria-hidden
        className={clsx(
          "mb-4 block h-1 w-10 rounded-full bg-red",
          align === "center" && "mx-auto",
        )}
      />
      {eyebrow ? (
        <p
          className={clsx(
            "font-board text-xs font-semibold tracking-[0.2em] uppercase",
            tone === "white" ? "text-sky" : "text-sky-ink",
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={clsx(
          "mt-3 font-display text-[clamp(1.875rem,1.4rem+2vw,2.25rem)] font-extrabold tracking-tight",
          tone === "white" ? "text-white" : "text-navy",
        )}
      >
        {title}
      </h2>
      {subtitle ? (
        <p
          className={clsx(
            "mt-4 text-base leading-relaxed sm:text-lg",
            tone === "white" ? "text-white/80" : "text-slate",
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
