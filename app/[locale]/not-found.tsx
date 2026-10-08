import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/sections/page-hero";

// Shown, inside the usual header and footer, for any address under a
// language that isn't a real page.
export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <main id="main-content">
      <PageHero eyebrow={t("eyebrow")} title={t("title")} subtitle={t("body")}>
        <Button href="/" variant="accent" size="lg">
          {t("cta")}
        </Button>
      </PageHero>
    </main>
  );
}
