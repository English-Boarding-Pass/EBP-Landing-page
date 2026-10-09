"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { clsx } from "clsx";
import { Quote, User } from "iconoir-react";
import { Modal } from "@/components/ui/modal";

// Every card shows the same fields in the same order: name and a short bio.
// Student reviews open in a popup.
export type Teacher = {
  name: string;
  bio: string;
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
  size,
}: {
  photo?: string;
  name: string;
  index: number;
  size: "card" | "profile";
}) {
  const box = size === "card" ? "size-24" : "size-28";
  if (photo) {
    return (
      <Image
        src={photo}
        alt=""
        width={224}
        height={224}
        className={clsx(box, "shrink-0 rounded-full object-cover")}
      />
    );
  }
  return (
    <div
      aria-hidden
      className={clsx(
        box,
        "flex shrink-0 items-center justify-center rounded-full font-display font-extrabold",
        size === "card" ? "text-4xl" : "text-5xl",
        placeholderTones[index % placeholderTones.length],
      )}
    >
      {initialOf(name)}
    </div>
  );
}

/**
 * A teacher tile of fixed layout, so every card in a row is the same height.
 * "Read more" opens the longer bio and student feedback in a popup.
 */
export function TeacherCard({
  teacher,
  photo,
  index,
  labels,
}: {
  teacher: Teacher;
  photo?: string;
  index: number;
  labels: {
    more: string;
    moreAbout: string;
    testimonialsTitle: string;
    close: string;
  };
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  // Five reviews at most, so the popup stays easy to read.
  const testimonials = teacher.testimonials.slice(0, 5);

  return (
    <>
      <article className="relative flex h-full flex-col items-start rounded-card border border-navy/10 bg-ivory p-7 transition-colors hover:border-navy/25">
        <Avatar photo={photo} name={teacher.name} index={index} size="card" />
        <h3 className="mt-4 font-display text-lg font-bold text-navy">
          {teacher.name}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-slate">{teacher.bio}</p>

        {/* mt-auto pins the button to the bottom; the stretched ::after makes the whole tile the click target. */}
        <button
          ref={triggerRef}
          type="button"
          aria-haspopup="dialog"
          aria-label={labels.moreAbout}
          onClick={() => setOpen(true)}
          className="mt-auto inline-flex min-h-11 items-center rounded-full pt-4 text-sm font-medium text-sky-ink underline-offset-4 after:absolute after:inset-0 after:rounded-card hover:underline focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-navy"
        >
          {labels.more}
        </button>
      </article>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={teacher.name}
        closeLabel={labels.close}
        size="lg"
        returnFocusRef={triggerRef}
      >
        <div className="flex items-center gap-4">
          <Avatar
            photo={photo}
            name={teacher.name}
            index={index}
            size="profile"
          />
          <p className="min-w-0 text-sm leading-relaxed text-slate">
            {teacher.bio}
          </p>
        </div>

        {testimonials.length > 0 ? (
          <>
            <h3 className="mt-6 font-board text-xs font-semibold tracking-[0.2em] text-sky-ink uppercase">
              {labels.testimonialsTitle}
            </h3>
            <div className="mt-3 space-y-3">
              {testimonials.map((item) => (
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
          </>
        ) : null}
      </Modal>
    </>
  );
}

/** A box held for a teacher whose profile is still to come, so the row keeps its three tiles. */
export function TeacherPlaceholder({ label }: { label: string }) {
  return (
    <div className="flex h-full flex-col items-start rounded-card border border-dashed border-navy/20 bg-ivory/60 p-7">
      <div
        aria-hidden
        className="flex size-24 shrink-0 items-center justify-center rounded-full bg-paper text-slate/40 ring-1 ring-navy/10"
      >
        <User className="size-9" />
      </div>
      <p className="mt-4 text-sm font-medium text-slate">{label}</p>
    </div>
  );
}
