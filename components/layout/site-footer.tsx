import { useTranslations } from "next-intl";
import { Whatsapp, Mail } from "iconoir-react";
import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/ui/container";

const WHATSAPP_NUMBER = "94770000000";
const CONTACT_EMAIL = "hello@englishboardingpass.lk";

export function SiteFooter() {
  const t = useTranslations("footer");

  const year = new Date().getFullYear();

  const exploreLinks = [
    { href: "#how-it-works", key: "howItWorks" },
    { href: "#routes", key: "routes" },
    { href: "#pricing", key: "pricing" },
    { href: "#teachers", key: "teachers" },
    { href: "#faq", key: "faq" },
  ] as const;

  return (
    <footer className="border-t border-white/10 bg-navy">
      <Container className="py-14 sm:py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <Logo variant="inverted" size="md" showTagline={false} />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
              {t("description")}
            </p>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/15"
            >
              <Whatsapp className="size-4" aria-hidden />
              {t("columns.contact.whatsapp")}
            </a>
          </div>

          <nav aria-label={t("columns.explore.title")}>
            <h2 className="font-display text-sm font-bold tracking-wide text-white/50 uppercase">
              {t("columns.explore.title")}
            </h2>
            <ul className="mt-4 space-y-3">
              {exploreLinks.map((link) => (
                <li key={link.key}>
                  <a
                    href={link.href}
                    className="text-sm text-white/75 hover:text-white"
                  >
                    {t(`columns.explore.links.${link.key}`)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t("columns.contact.title")}>
            <h2 className="font-display text-sm font-bold tracking-wide text-white/50 uppercase">
              {t("columns.contact.title")}
            </h2>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-white/75 hover:text-white"
                >
                  <Whatsapp className="size-4" aria-hidden />
                  {t("columns.contact.whatsapp")}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="inline-flex items-center gap-2 text-sm text-white/75 hover:text-white"
                >
                  <Mail className="size-4" aria-hidden />
                  {t("columns.contact.email")}
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} English Boarding Pass. {t("legal.rights")}
          </p>
          <a href="#" className="hover:text-white/80">
            {t("legal.privacy")}
          </a>
        </div>
      </Container>
    </footer>
  );
}
