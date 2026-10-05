"use client";

import { useId, useRef } from "react";
import Image from "next/image";
import { clsx } from "clsx";
import { Quote, User, Xmark } from "iconoir-react";

export type Teacher = {
  name: string;
  bio: string;
  longBio: string;
  testimonials: { quote: string; name: string }[];
};

function Avatar({ photo, size }: { photo?: string; size: "card" | "profile" }) {
  const box = size === "card" ? "size-24" : "size-20";
  if (photo) {
    return (
      <Image
        src={photo}
        alt=""
        width={192}
        height={192}
        className={clsx(box, "shrink-0 rounded-full object-cover")}
      />
    );
  }
  return (
    <div
      className={clsx(
        box,
        "flex shrink-0 items-center justify-center rounded-full bg-ice text-sky-ink",
      )}
    >
      <User className="size-10" aria-hidden />
    </div>
  );
}

/** A teacher tile. Opening it shows the longer bio and student feedback. */
export function TeacherCard({
  teacher,
  photo,
  labels,
}: {
  teacher: Teacher;
  photo?: string;
  labels: { more: string; testimonialsTitle: string; close: string };
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  return (
    <>
      <article className="relative flex flex-col items-center rounded-card border border-navy/10 bg-ivory p-7 text-center transition-colors hover:border-navy/25">
        <Avatar photo={photo} size="card" />
        <h3 className="mt-4 font-display text-lg font-bold text-navy">
          {teacher.name}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate">
          {teacher.bio}
        </p>
        {/* The stretched ::after makes the whole tile the click target. */}
        <button
          type="button"
          aria-haspopup="dialog"
          onClick={() => dialogRef.current?.showModal()}
          className="mt-5 rounded-full text-sm font-medium text-sky-ink underline-offset-4 after:absolute after:inset-0 after:rounded-card hover:underline focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-navy"
        >
          {labels.more}
          <span className="sr-only">: {teacher.name}</span>
        </button>
      </article>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        // Click on the backdrop (the dialog element itself, outside the panel) closes it.
        onClick={(e) =>
          e.target === e.currentTarget && dialogRef.current?.close()
        }
        className="m-auto w-[calc(100%-2rem)] max-w-lg overflow-visible bg-transparent p-0 backdrop:bg-navy/70 backdrop:backdrop-blur-sm"
      >
        <div className="relative max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-card bg-white p-6 text-left shadow-[0_24px_64px_-24px_rgba(0,0,0,0.6)] sm:p-8">
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label={labels.close}
            className="absolute top-3 right-3 inline-flex size-9 items-center justify-center rounded-full text-slate/60 hover:bg-ice hover:text-navy"
          >
            <Xmark className="size-5" aria-hidden />
          </button>

          <div className="flex items-center gap-4 pr-8">
            <Avatar photo={photo} size="profile" />
            <h3
              id={titleId}
              className="font-display text-xl font-extrabold text-navy"
            >
              {teacher.name}
            </h3>
          </div>

          <p className="mt-5 text-sm leading-relaxed text-slate sm:text-base">
            {teacher.longBio}
          </p>

          <h4 className="mt-7 font-board text-xs font-semibold tracking-[0.2em] text-sky-ink uppercase">
            {labels.testimonialsTitle}
          </h4>
          <div className="mt-3 space-y-3">
            {teacher.testimonials.map((item) => (
              <figure key={item.quote} className="rounded-stub bg-ivory p-5">
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
      </dialog>
    </>
  );
}
