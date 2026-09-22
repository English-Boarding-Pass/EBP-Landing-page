import { useTranslations } from "next-intl";
import { User } from "iconoir-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

type Teacher = { name: string; role: string; bio: string };

export function Teachers() {
  const t = useTranslations("teachers");
  const items = t.raw("items") as Teacher[];

  return (
    <section id="teachers" className="bg-ivory py-20 sm:py-28">
      <Container>
        <SectionHeading
          title={t("title")}
          subtitle={t("subtitle")}
          align="center"
          className="mx-auto"
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {items.map((teacher) => (
            <div
              key={teacher.name}
              className="rounded-card border border-navy/10 bg-white p-7 text-center"
            >
              <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-ice text-sky-ink">
                <User className="size-9" aria-hidden />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-navy">
                {teacher.name}
              </h3>
              <p className="mt-1 text-xs font-semibold tracking-wide text-sky-ink uppercase">
                {teacher.role}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate">
                {teacher.bio}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-xs text-slate/70">
          {t("photoNote")}
        </p>
      </Container>
    </section>
  );
}
