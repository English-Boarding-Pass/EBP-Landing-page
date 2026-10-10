import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  TeacherCard,
  TeacherPlaceholder,
  type Teacher,
} from "@/components/sections/teacher-card";

// Photo paths under public/ (e.g. "/teachers/mizly-nizar.jpg"), in the same order
// as teachers.items in messages/*.json. A missing entry shows the placeholder
// avatar.
const photos: (string | undefined)[] = [
  undefined,
  "/teachers/chandima-nanayakkara.jpg",
];

// The row holds three tiles. Teachers still to come fill the rest with a
// "profile coming soon" box until their details arrive.
const TILES = 3;

export function Teachers() {
  const t = useTranslations("teachers");
  const items = t.raw("items") as Teacher[];
  const labels = {
    more: t("more"),
    testimonialsTitle: t("testimonialsTitle"),
    close: t("close"),
  };

  return (
    <section id="teachers" className="bg-paper pt-14 pb-10 sm:pt-24 sm:pb-12">
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
          {Array.from({ length: Math.max(0, TILES - items.length) }, (_, i) => (
            <TeacherPlaceholder key={i} label={t("comingSoon")} />
          ))}
        </div>
        <p className="mt-8 max-w-xl text-xs text-slate/70">{t("moreSoon")}</p>
      </Container>
    </section>
  );
}
