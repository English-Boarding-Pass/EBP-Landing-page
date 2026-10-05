"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { clsx } from "clsx";
import { NavArrowDown, Quote } from "iconoir-react";

// Every card shows the same fields in the same order: name, experience,
// specialism, one supporting line.
export type Teacher = {
  name: string;
  experience: string;
  specialism: string;
  line: string;
  longBio: string;
  testimonials: { quote: string; name: string }[];
};

// Placeholder avatars: one brand colour per card so the cards stay distinct
// until real photos arrive. Red is left out on purpose; it is an accent.
const placeholderTones = [
  "bg-navy text-white",
  "bg-sky text-navy",
  "bg-sky-ink text-white",
  "bg-slate text-white",
  "bg-ice text-sky-ink",
  "bg-ivory text-navy ring-1 ring-navy/15",
];

// First letter of the name, skipping honorifics. Segmenting by grapheme keeps
// Sinhala and Tamil letters whole.
function initialOf(name: string) {
  const bare = name.replace(/^(Ms|Mr|Mrs|Dr)\.?\s+|^(திருமதி|திரு)\.?\s+/, "");
  const [first] = [...new Intl.Segmenter().segment(bare)];
  return first ? first.segment : "?";
}

function Avatar({
  photo,
  name,
  index,
}: {
  photo?: string;
  name: string;
  index: number;
}) {
  if (photo) {
    return (
      <Image
        src={photo}
        alt=""
        width={192}
        height={192}
        className="size-24 shrink-0 rounded-full object-cover"
      />
    );
  }
  return (
    <div
      aria-hidden
      className={clsx(
        "flex size-24 shrink-0 items-center justify-center rounded-full font-display text-4xl font-extrabold",
        placeholderTones[index % placeholderTones.length],
      )}
    >
      {initialOf(name)}
    </div>
  );
}

/** A teacher tile. Opening it expands the card in place with the longer bio and student feedback. */
export function TeacherCard({
  teacher,
  photo,
  index,
  labels,
}: {
  teacher: Teacher;
  photo?: string;
  index: number;
  labels: { more: string; testimonialsTitle: string; close: string };
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <article className="relative flex flex-col items-start rounded-card border border-navy/10 bg-ivory p-7 transition-colors hover:border-navy/25">
      <Avatar photo={photo} name={teacher.name} index={index} />
      <h3 className="mt-4 font-display text-lg font-bold text-navy">
        {teacher.name}
      </h3>
      <p className="mt-1 text-sm font-semibold text-sky-ink">
        {teacher.experience}
      </p>
      <p className="mt-3 text-sm font-medium text-navy">{teacher.specialism}</p>
      <p className="mt-2 text-sm leading-relaxed text-slate">{teacher.line}</p>

      {/* While closed, the stretched ::after makes the whole tile the click target. */}
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className={clsx(
          "mt-4 inline-flex min-h-11 items-center gap-1.5 rounded-full text-sm font-medium text-sky-ink underline-offset-4 hover:underline focus-visible:outline-none",
          open
            ? "focus-visible:ring-2 focus-visible:ring-navy"
            : "after:absolute after:inset-0 after:rounded-card focus-visible:after:ring-2 focus-visible:after:ring-navy",
        )}
      >
        {open ? labels.close : labels.more}
        <span className="sr-only">: {teacher.name}</span>
        <NavArrowDown
          aria-hidden
          className={clsx(
            "size-4 transition-transform duration-300 motion-reduce:transition-none",
            open && "rotate-180",
          )}
        />
      </button>

      {/* Grid rows animate 0fr to 1fr, so the card grows to fit its content. */}
      <div
        id={panelId}
        inert={!open}
        className={clsx(
          "grid w-full transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className="mt-3 border-t border-navy/10 pt-5">
            <p className="text-sm leading-relaxed text-slate">
              {teacher.longBio}
            </p>

            <h4 className="mt-6 font-board text-xs font-semibold tracking-[0.2em] text-sky-ink uppercase">
              {labels.testimonialsTitle}
            </h4>
            <div className="mt-3 space-y-3">
              {teacher.testimonials.slice(0, 2).map((item) => (
                <figure key={item.quote} className="rounded-stub bg-paper p-5">
                  <Quote className="size-5 text-red" aria-hidden />
                  <blockquote className="mt-2 text-sm leading-relaxed text-navy">
                    {item.quote}
                  </blockquote>
                  <figcaption className="mt-2 text-xs text-slate">
                    {item.name}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
