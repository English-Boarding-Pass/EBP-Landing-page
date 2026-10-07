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
    <section className="bg-navy pt-30 pb-14 sm:pt-40 sm:pb-20">
      <Container>
        <div className="max-w-3xl">
          <p className="font-board text-xs font-semibold tracking-[0.25em] text-sky uppercase">
            {eyebrow}
          </p>
          <h1 className="mt-4 font-display text-[clamp(2.25rem,1.2rem+4vw,3rem)] leading-[1.08] font-extrabold tracking-tight text-white">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80">
            {subtitle}
          </p>
          {children ? <div className="mt-9">{children}</div> : null}
        </div>
      </Container>
    </section>
  );
}
