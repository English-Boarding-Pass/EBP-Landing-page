import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
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
    <section id="teachers" className="bg-white py-20 sm:py-28">
      <Container>
        <SectionHeading
          title={t("title")}
          subtitle={t("subtitle")}
          align="center"
          className="mx-auto"
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((teacher, i) => (
            <TeacherCard
              key={teacher.name}
              teacher={teacher}
              photo={photos[i]}
              labels={labels}
            />
          ))}
        </div>
        <p className="mt-8 text-center text-xs text-slate/70">
          {t("sampleNote")}
        </p>
      </Container>
    </section>
  );
}
