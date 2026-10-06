import { useLocale, useTranslations } from "next-intl";
import { Facebook, Instagram, Linkedin, Mail, Whatsapp } from "iconoir-react";
import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/ui/container";
import { PrivacyButton } from "@/components/layout/privacy-button";
import { Link } from "@/i18n/navigation";
import { socialLinks, type SocialKey } from "@/lib/links";
import { CONTACT_EMAIL, whatsappUrl } from "@/lib/site";

const socialIcons = {
  linkedin: Linkedin,
  facebook: Facebook,
  instagram: Instagram,
} satisfies Record<SocialKey, typeof Linkedin>;

// One look for every footer link and the privacy button, so they read as a set.
const linkClasses =
  "inline-flex min-h-11 items-center rounded text-sm font-medium text-white/80 hover:text-white focus-visible:text-white focus-visible:ring-2 focus-visible:ring-sky focus-visible:outline-none";

const socialClasses =
  "inline-flex size-11 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:border-sky hover:bg-sky hover:text-navy focus-visible:ring-2 focus-visible:ring-sky focus-visible:ring-offset-2 focus-visible:ring-offset-navy focus-visible:outline-none";

export function SiteFooter() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const locale = useLocale();

  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy">
      <Container className="py-14 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <Logo variant="inverted" size="md" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/70">
              {t("description")}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white/10 px-5 text-sm font-medium text-white transition-colors hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-sky focus-visible:outline-none"
              >
                <Whatsapp className="size-4" aria-hidden />
                {t("columns.contact.whatsapp")}
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/25 px-5 text-sm font-medium text-white transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-sky focus-visible:outline-none"
              >
                <Mail className="size-4" aria-hidden />
                {t("columns.contact.email")}
              </a>
            </div>

            <ul className="mt-6 flex items-center gap-3">
              {socialLinks.map(({ key, href }) => {
                const Icon = socialIcons[key];
                return (
                  <li key={key}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t(`social.${key}`)}
                      className={socialClasses}
                    >
                      <Icon className="size-5" aria-hidden />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Two columns on phones, three from 640px: equal widths, even rows. */}
          <nav
            aria-label={t("columns.explore.title")}
            className="grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-3 lg:content-start"
          >
            <a href={`/${locale}#how-it-works`} className={linkClasses}>
              {tNav("howItWorks")}
            </a>
            <a href={`/${locale}#programmes`} className={linkClasses}>
              {tNav("programmes")}
            </a>
            <Link href="/corporates" className={linkClasses}>
              {tNav("corporates")}
            </Link>
            <Link href="/science" className={linkClasses}>
              {tNav("science")}
            </Link>
            <a href={`/${locale}#teachers`} className={linkClasses}>
              {tNav("teachers")}
            </a>
            <a href={`/${locale}#faq`} className={linkClasses}>
              {tNav("faq")}
            </a>
          </nav>
        </div>

        <hr className="mt-12 border-white/10" />

        <div className="mt-4 flex flex-col items-center gap-1 text-center text-xs text-white/60 sm:flex-row sm:justify-between sm:text-left">
          <p>
            © {year} English Boarding Pass. {t("legal.rights")}
          </p>
          <PrivacyButton className={linkClasses} />
        </div>
      </Container>
    </footer>
  );
}
