import type { ReactNode } from "react";
import { Barcode } from "./barcode";
import { Perforation } from "./perforation";
import { Button } from "@/components/ui/button";

export type RouteFact = {
  icon: ReactNode;
  label: string;
};

export function RouteCard({
  code,
  flagLabel,
  nativeWord,
  tagline,
  description,
  facts,
  seatsRemaining,
  seatsLabel,
  departsLabel,
  departs,
  ctaLabel,
  ctaHref,
}: {
  code: string;
  flagLabel: string;
  nativeWord: string;
  tagline: string;
  description: string;
  facts: RouteFact[];
  seatsRemaining: number;
  seatsLabel: string;
  departsLabel: string;
  departs: string;
  ctaLabel: string;
  ctaHref: string;
}) {
  return (
    <article className="flex w-full flex-col overflow-hidden rounded-card border border-navy/10 bg-white shadow-[0_1px_2px_rgba(11,25,86,0.04),0_12px_32px_-16px_rgba(11,25,86,0.18)] sm:flex-row">
      {/* Info side */}
      <div className="flex flex-1 flex-col gap-5 p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <span className="inline-flex size-8 items-center justify-center rounded-full bg-ice font-board text-xs font-semibold text-sky-ink">
            {flagLabel}
          </span>
          <span className="font-board text-xs font-semibold tracking-[0.15em] text-slate">
            {code}
          </span>
        </div>

        <div>
          <h3 className="font-display text-2xl font-extrabold text-navy">
            {nativeWord} <span className="text-sky-ink">→</span> English
          </h3>
          <p className="mt-1 font-body text-sm font-medium text-sky-ink">
            {tagline}
          </p>
        </div>

        <p className="text-sm leading-relaxed text-slate sm:text-base">
          {description}
        </p>

        <dl className="mt-1 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-navy/10 pt-5">
          {facts.map((fact, i) => (
            <div key={i} className="flex items-center gap-2">
              <span aria-hidden className="text-sky-ink">
                {fact.icon}
              </span>
              <dd className="text-sm text-navy">{fact.label}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-2">
          <Button href={ctaHref} variant="primary" size="md">
            {ctaLabel}
          </Button>
        </div>
      </div>

      <Perforation orientation="vertical" notchClassName="bg-white" />
      <Perforation orientation="horizontal" notchClassName="bg-white" />

      {/* Stub side */}
      <div className="flex flex-row items-stretch justify-between gap-4 bg-ice p-6 sm:w-52 sm:flex-col sm:justify-between sm:p-6">
        <div>
          <p className="font-board text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-ink">
            {seatsLabel}
          </p>
          <p className="font-board text-3xl font-semibold text-navy">
            {seatsRemaining}
          </p>
        </div>
        <div className="sm:mt-4">
          <p className="font-board text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-ink">
            {departsLabel}
          </p>
          <p className="font-board text-sm font-semibold text-navy">
            {departs}
          </p>
        </div>
        <Barcode
          seed={code}
          className="hidden h-8 w-full sm:mt-6 sm:block"
          tone="navy"
        />
      </div>
    </article>
  );
}
