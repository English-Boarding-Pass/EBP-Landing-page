import { useTranslations } from "next-intl";
import { Book, EditPencil, Microphone, SoundHigh } from "iconoir-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

type Skill = { name: string; description: string };

// Same order as science.skills.items: listening, reading, writing, speaking.
const icons = [SoundHigh, Book, EditPencil, Microphone];

/** Element one: what there is to improve. */
export function ScienceSkills() {
  const t = useTranslations("science.skills");
  const items = t.raw("items") as Skill[];

  return (
    <section className="bg-ivory py-16 sm:py-28">
      <Container>
        <SectionHeading eyebrow="01" title={t("title")} subtitle={t("body")} />

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((skill, i) => {
            const Icon = icons[i];
            return (
              <li
                key={skill.name}
                className="rounded-card border border-navy/10 bg-paper p-6"
              >
                <span className="inline-flex size-11 items-center justify-center rounded-full bg-ice text-sky-ink">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-4 font-display text-xl font-bold text-navy">
                  {skill.name}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate">
                  {skill.description}
                </p>
              </li>
            );
          })}
        </ul>

        <p className="mt-6 rounded-card bg-navy px-6 py-6 text-center font-display text-lg font-bold text-white sm:px-10 sm:text-xl">
          {t("outcome")}
        </p>
      </Container>
    </section>
  );
}
