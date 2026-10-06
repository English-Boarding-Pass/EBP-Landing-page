import { useTranslations } from "next-intl";
import { NavArrowRight } from "iconoir-react";
import { Container } from "@/components/ui/container";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "@/components/ui/section-heading";
import { TeacherCard, type Teacher } from "@/components/sections/teacher-card";

// Photo paths under public/ (e.g. "/teachers/shamil.jpg"), in the same order
// as teachers.items in messages/*.json. A missing entry shows the placeholder
// avatar.
const photos: (string | undefined)[] = [];

export function Teachers() {
  const t = useTranslations("teachers");
  const items = t.raw("items") as Teacher[];
  const labels = {
    more: t("more"),
    testimonialsTitle: t("testimonialsTitle"),
    close: t("close"),
  };

  return (
    <section id="teachers" className="bg-paper py-16 sm:py-28">
      <Container>
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />

        <div className="mt-12 grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((teacher, i) => (
            <TeacherCard
              key={teacher.name}
              teacher={teacher}
              photo={photos[i]}
              index={i}
              labels={{
                ...labels,
                moreAbout: t("readMoreAbout", { name: teacher.name }),
              }}
            />
          ))}
        </div>
        <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <p className="max-w-xl text-xs text-slate/70">{t("sampleNote")}</p>
          <Link
            href="/teachers"
            className="inline-flex min-h-11 items-center gap-1.5 self-start rounded-full text-sm font-semibold whitespace-nowrap text-sky-ink underline underline-offset-4 hover:text-navy focus-visible:ring-2 focus-visible:ring-navy focus-visible:outline-none"
          >
            {t("all")}
            <NavArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </Container>
    </section>
  );
}
