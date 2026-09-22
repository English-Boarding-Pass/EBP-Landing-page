import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/brand/logo";
import { Perforation } from "@/components/boarding-pass/perforation";
import { AuthForm } from "@/components/check-in/auth-form";
import { Link } from "@/i18n/navigation";

const WHATSAPP_NUMBER = "94770000000";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "checkIn" });
  return { title: `${t("title")} — English Boarding Pass` };
}

export default async function CheckInPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ route?: string }>;
}) {
  const { locale } = await params;
  const { route } = await searchParams;
  setRequestLocale(locale);

  const t = await getTranslations("checkIn");

  const routeLabel =
    route === "sinhala"
      ? t("routes.sinhala")
      : route === "tamil"
        ? t("routes.tamil")
        : null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-navy px-6 py-16">
      <Link href="/" aria-label="English Boarding Pass — home" className="mb-8">
        <Logo variant="inverted" size="md" showTagline={false} />
      </Link>

      <Container className="max-w-md">
        <div className="overflow-hidden rounded-card border border-white/10 bg-white shadow-[0_24px_64px_-24px_rgba(0,0,0,0.6)]">
          <div className="flex flex-col gap-4 p-8 pb-6 text-center">
            <p className="font-board text-xs font-semibold uppercase tracking-[0.25em] text-sky-ink">
              {t("eyebrow")}
            </p>
            <h1 className="font-display text-2xl font-extrabold text-navy">
              {t("title")}
            </h1>
            <p className="text-sm leading-relaxed text-slate">
              {t("subtitle")}
            </p>

            {routeLabel ? (
              <div className="mt-2 flex items-center justify-between rounded-xl bg-ice px-4 py-3 text-left">
                <div>
                  <p className="font-board text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-ink">
                    {t("routeLabel")}
                  </p>
                  <p className="font-display text-sm font-bold text-navy">
                    {routeLabel}
                  </p>
                </div>
                <Link
                  href="/#routes"
                  className="text-xs font-medium text-sky-ink underline underline-offset-2"
                >
                  {t("changeRoute")}
                </Link>
              </div>
            ) : null}
          </div>

          <Perforation orientation="horizontal" notchClassName="bg-white" />

          <AuthForm />

          <div className="border-t border-navy/10 bg-ice px-6 py-4 text-center sm:px-8">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-sky-ink hover:underline"
            >
              {t("whatsappCta")}
            </a>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm font-medium text-white/70 hover:text-white"
          >
            ← {t("backHome")}
          </Link>
        </div>
      </Container>
    </main>
  );
}
