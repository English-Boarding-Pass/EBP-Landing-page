import Image from "next/image";
import { clsx } from "clsx";
import { Quote } from "iconoir-react";

// One teacher: name, a short bio and what students say. Photo comes from
// the `photos` list in teachers.tsx; without one, the first letter of the
// name sits on a brand colour.
export type Teacher = {
  name: string;
  bio: string;
  testimonials: { quote: string; name: string }[];
};

// Placeholder avatars: one brand colour per teacher so profiles stay distinct
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
        width={256}
        height={256}
        className="size-32 shrink-0 rounded-full object-cover"
      />
    );
  }
  return (
    <div
      aria-hidden
      className={clsx(
        "flex size-32 shrink-0 items-center justify-center rounded-full font-display text-5xl font-extrabold",
        placeholderTones[index % placeholderTones.length],
      )}
    >
      {initialOf(name)}
    </div>
  );
}

export function TeacherProfile({
  teacher,
  photo,
  index,
  testimonialsTitle,
}: {
  teacher: Teacher;
  photo?: string;
  index: number;
  testimonialsTitle: string;
}) {
  return (
    <article className="grid gap-8 rounded-card border border-navy/10 bg-ivory p-7 sm:p-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
      <div>
        <Avatar photo={photo} name={teacher.name} index={index} />
        <h3 className="mt-5 font-display text-2xl font-extrabold text-navy">
          {teacher.name}
        </h3>
        <p className="mt-3 text-base leading-relaxed text-slate">
          {teacher.bio}
        </p>
      </div>

      {teacher.testimonials.length > 0 ? (
        <div>
          <h4 className="font-board text-xs font-semibold tracking-[0.2em] text-sky-ink uppercase">
            {testimonialsTitle}
          </h4>
          <div className="mt-4 space-y-3">
            {teacher.testimonials.map((item) => (
              <figure key={item.quote} className="rounded-stub bg-paper p-5">
                <Quote className="size-5 text-red" aria-hidden />
                <blockquote className="mt-2 text-sm leading-relaxed text-navy sm:text-base">
                  {item.quote}
                </blockquote>
                <figcaption className="mt-2 text-xs text-slate">
                  {item.name}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      ) : null}
    </article>
  );
}
