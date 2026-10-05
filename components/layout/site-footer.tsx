import { clsx } from "clsx";
import { useLocale, useTranslations } from "next-intl";
import {
  Facebook,
  Instagram,
  Mail,
  Tiktok,
  Whatsapp,
  Youtube,
} from "iconoir-react";
import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/ui/container";
import { Link } from "@/i18n/navigation";
import { CONTACT_EMAIL, socialLinks, whatsappUrl } from "@/lib/site";

const socials = [
  { key: "facebook", Icon: Facebook },
  { key: "instagram", Icon: Instagram },
  { key: "tiktok", Icon: Tiktok },
  { key: "youtube", Icon: Youtube },
] as const;

export function SiteFooter() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const locale = useLocale();

  const year = new Date().getFullYear();
  const linkClasses =
    "inline-flex min-h-11 min-w-11 items-center text-sm text-white/75 hover:text-white";

  return (
    <footer className="bg-navy">
      <Container className="py-14 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          <div>
            <Logo variant="inverted" size="md" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/70">
              {t("description")}
            </p>
          </div>

          <div className="flex flex-col gap-6 lg:items-end">
            <nav
              aria-label={t("columns.explore.title")}
              className="flex flex-wrap gap-x-6 lg:justify-end"
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

            <div className="flex flex-wrap items-center gap-3 lg:justify-end">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white/10 px-5 text-sm font-medium text-white transition-colors hover:bg-white/15"
              >
                <Whatsapp className="size-4" aria-hidden />
                {t("columns.contact.whatsapp")}
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/25 px-5 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                <Mail className="size-4" aria-hidden />
                {t("columns.contact.email")}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-white/10 pt-6">
          <p className="text-sm text-white/70">{t("social.label")}</p>
          <ul className="flex items-center gap-1">
            {socials.map(({ key, Icon }) => {
              const href = socialLinks[key];
              const label = t(`social.${key}`);
              const iconClasses =
                "inline-flex size-11 items-center justify-center rounded-full text-white/80";
              return (
                <li key={key}>
                  {href === "#" ? (
                    // Account not live yet: the icon holds its place without a dead link.
                    <span
                      role="img"
                      aria-label={label}
                      className={clsx(iconClasses, "opacity-60")}
                    >
                      <Icon className="size-5" aria-hidden />
                    </span>
                  ) : (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className={clsx(
                        iconClasses,
                        "hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none",
                      )}
                    >
                      <Icon className="size-5" aria-hidden />
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-4 flex flex-col gap-1 border-t border-white/10 pt-6 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} English Boarding Pass. {t("legal.rights")}
          </p>
          <a
            href="#"
            className="inline-flex min-h-11 items-center hover:text-white/80"
          >
            {t("legal.privacy")}
          </a>
        </div>
      </Container>
    </footer>
  );
}
