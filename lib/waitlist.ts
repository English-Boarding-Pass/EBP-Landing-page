"use server";

import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { addContact, isResendConfigured, sendEmail } from "@/lib/resend";
import { waitlistConfirmationEmail } from "@/lib/emails/waitlist-confirmation";

export type WaitlistRoute = "sinhala" | "tamil";

export type WaitlistValues = {
  name: string;
  email: string;
  phone: string;
  route: WaitlistRoute | "";
};

export type WaitlistState =
  | { status: "idle" }
  | { status: "success"; email: string }
  | {
      status: "error";
      error:
        | "invalidName"
        | "invalidEmail"
        | "invalidPhone"
        | "invalidRoute"
        | "generic";
      values: WaitlistValues;
    };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Loose on purpose: people type Sri Lankan numbers as 07x, +947x, with spaces or dashes.
const PHONE_RE = /^\+?[\d\s-]{9,16}$/;

function field(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export async function joinWaitlist(
  _prev: WaitlistState,
  formData: FormData,
): Promise<WaitlistState> {
  const rawRoute = field(formData, "route");
  const values: WaitlistValues = {
    name: field(formData, "name").slice(0, 120),
    email: field(formData, "email").toLowerCase().slice(0, 254),
    phone: field(formData, "phone").slice(0, 20),
    route: rawRoute === "sinhala" || rawRoute === "tamil" ? rawRoute : "",
  };
  const rawLocale = field(formData, "locale");
  const locale = routing.locales.includes(rawLocale as never)
    ? rawLocale
    : routing.defaultLocale;

  // Honeypot: real people never see or fill this field. Pretend it worked.
  // Its name must not look like anything browser autofill knows (e.g.
  // "company"), or real signups get silently dropped.
  if (field(formData, "ebp_hp_field")) {
    console.warn("[waitlist] Honeypot filled — ignoring signup", values.email);
    return { status: "success", email: values.email };
  }

  if (values.name.length < 2) {
    return { status: "error", error: "invalidName", values };
  }
  if (!EMAIL_RE.test(values.email)) {
    return { status: "error", error: "invalidEmail", values };
  }
  if (!PHONE_RE.test(values.phone)) {
    return { status: "error", error: "invalidPhone", values };
  }
  if (!values.route) {
    return { status: "error", error: "invalidRoute", values };
  }

  const routeLabel =
    values.route === "sinhala" ? "Sinhala to English" : "Tamil to English";

  if (!isResendConfigured()) {
    if (process.env.NODE_ENV === "production") {
      console.error("[waitlist] RESEND_API_KEY is not set");
      return { status: "error", error: "generic", values };
    }
    // Local dev without a key: let the UI flow be tested end to end.
    console.warn("[waitlist] RESEND_API_KEY not set — skipping send", values);
    return { status: "success", email: values.email };
  }

  const [firstName, ...rest] = values.name.split(/\s+/);
  const contact = await addContact({
    email: values.email,
    firstName,
    lastName: rest.join(" "),
  });
  if (!contact.ok) console.error("[waitlist] Resend contact failed", contact);

  const t = await getTranslations({ locale, namespace: "waitlist.email" });
  const tRoutes = await getTranslations({ locale, namespace: "routes" });
  const tPricing = await getTranslations({ locale, namespace: "pricing" });
  const email = waitlistConfirmationEmail(
    {
      subject: t("subject"),
      preheader: t("preheader"),
      eyebrow: t("eyebrow"),
      heading: t("heading", { name: firstName }),
      body: t("body"),
      passenger: t("passenger"),
      route: t("route"),
      status: t("status"),
      statusValue: t("statusValue"),
      departs: t("departs"),
      earlyBird: t("earlyBird", { price: tPricing("earlyBirdPrice") }),
      replyHint: t("replyHint"),
      signoff: t("signoff"),
      footer: t("footer"),
    },
    {
      name: values.name,
      routeCode: tRoutes(`${values.route}.code`),
      routeName: tRoutes(`${values.route}.name`),
      departs: tRoutes(`${values.route}.departs`),
    },
  );

  const confirmation = sendEmail({
    to: values.email,
    ...email,
    replyTo: process.env.WAITLIST_NOTIFY_EMAIL,
  });

  const notify = process.env.WAITLIST_NOTIFY_EMAIL;
  let notification: ReturnType<typeof sendEmail> | undefined;
  if (notify) {
    const rows: [string, string][] = [
      ["Name", values.name],
      ["Email", values.email],
      ["Phone", values.phone],
      ["Route", routeLabel],
    ];
    notification = sendEmail({
      to: notify.split(",").map((s) => s.trim()),
      subject: `New waitlist signup: ${values.name}`,
      text: rows.map(([k, v]) => `${k}: ${v}`).join("\n"),
      html: `<table>${rows
        .map(
          ([k, v]) =>
            `<tr><td><strong>${k}</strong></td><td>${escapeHtml(v)}</td></tr>`,
        )
        .join("")}</table>`,
      replyTo: values.email,
    });
  }

  const [confirmed, notified] = await Promise.all([confirmation, notification]);
  if (!confirmed.ok) console.error("[waitlist] Confirmation failed", confirmed);
  if (notified && !notified.ok) {
    console.error("[waitlist] Notification failed", notified);
  }

  // The signup counts as captured if it reached the contact list or the
  // team's inbox; only when both failed is it lost, so ask them to retry.
  if (!contact.ok && !notified?.ok) {
    return { status: "error", error: "generic", values };
  }

  return { status: "success", email: values.email };
}
