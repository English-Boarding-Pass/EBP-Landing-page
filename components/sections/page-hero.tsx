import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";

/** The navy header band at the top of every page except the home page. */
export function PageHero({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-navy pt-14 pb-16 sm:pt-20 sm:pb-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(156,204,246,0.18),transparent_55%)]"
      />
      <Container className="relative">
        <div className="max-w-3xl">
          <p className="font-board text-xs font-semibold tracking-[0.25em] text-sky uppercase">
            {eyebrow}
          </p>
          <h1 className="mt-4 font-display text-4xl leading-[1.08] font-extrabold tracking-tight text-white sm:text-5xl">
            {title}
          </h1>
          <span
            aria-hidden
            className="mt-6 block h-1.5 w-20 rounded-full bg-red"
          />
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80">
            {subtitle}
          </p>
          {children ? <div className="mt-9">{children}</div> : null}
        </div>
      </Container>
    </section>
  );
}
