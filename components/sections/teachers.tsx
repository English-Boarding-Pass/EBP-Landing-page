import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  TeacherProfile,
  type Teacher,
} from "@/components/sections/teacher-profile";

// Photo paths under public/ (e.g. "/teachers/mizly.jpg"), in the same order
// as teachers.items in messages/*.json. A missing entry shows the placeholder
// avatar.
const photos: (string | undefined)[] = [];

export function Teachers() {
  const t = useTranslations("teachers");
  const items = t.raw("items") as Teacher[];

  return (
    <section id="teachers" className="bg-paper pt-14 pb-10 sm:pt-24 sm:pb-12">
      <Container>
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />

        <div className="mt-12 space-y-6">
          {items.map((teacher, i) => (
            <TeacherProfile
              key={teacher.name}
              teacher={teacher}
              photo={photos[i]}
              index={i}
              testimonialsTitle={t("testimonialsTitle")}
            />
          ))}
        </div>
        <p className="mt-8 max-w-xl text-xs text-slate/70">{t("moreSoon")}</p>
      </Container>
    </section>
  );
}
