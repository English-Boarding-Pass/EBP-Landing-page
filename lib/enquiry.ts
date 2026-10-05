"use server";

import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { addContact, isResendConfigured, sendEmail } from "@/lib/resend";
import {
  enquiryConfirmationEmail,
  type EnquiryEmailField,
} from "@/lib/emails/enquiry-confirmation";

export type ContactValues = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

type ContactError = "invalidName" | "invalidEmail" | "invalidPhone" | "generic";

export type ContactState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; error: ContactError; values: ContactValues };

export type CorporateValues = ContactValues & {
  company: string;
  learners: string;
  level: string;
  role: string;
};

export type CorporateState =
  | { status: "idle" }
  | { status: "success" }
  | {
      status: "error";
      error: ContactError | "invalidCompany";
      values: CorporateValues;
    };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Loose on purpose: people type Sri Lankan numbers as 07x, +947x, with spaces or dashes.
const PHONE_RE = /^\+?[\d\s-]{9,16}$/;

const LEVELS = ["unsure", "beginner", "intermediate", "advanced", "mixed"];

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

function contactValues(formData: FormData): ContactValues {
  return {
    name: field(formData, "name").slice(0, 120),
    email: field(formData, "email").toLowerCase().slice(0, 254),
    phone: field(formData, "phone").slice(0, 20),
    message: field(formData, "message").slice(0, 2000),
  };
}

function contactError(values: ContactValues): ContactError | null {
  if (values.name.length < 2) return "invalidName";
  if (!EMAIL_RE.test(values.email)) return "invalidEmail";
  if (!PHONE_RE.test(values.phone)) return "invalidPhone";
  return null;
}

// Honeypot: real people never see or fill this field. Its name must not look
// like anything browser autofill knows (e.g. "company"), or real enquiries get
// silently dropped.
function isBot(formData: FormData) {
  return Boolean(field(formData, "ebp_hp_field"));
}

/**
 * Saves the person as a Resend contact, emails them a confirmation in their
 * language, and emails the team the details. Returns false only when the
 * enquiry reached neither the contact list nor the team's inbox.
 */
async function deliver({
  formData,
  values,
  notifySubject,
  notifyRows,
  company,
}: {
  formData: FormData;
  values: ContactValues;
  notifySubject: string;
  notifyRows: [string, string][];
  company?: string;
}): Promise<boolean> {
  if (!isResendConfigured()) {
    if (process.env.NODE_ENV === "production") {
      console.error("[enquiry] RESEND_API_KEY is not set");
      return false;
    }
    // Local dev without a key: let the UI flow be tested end to end.
    console.warn("[enquiry] RESEND_API_KEY not set, skipping send", values);
    return true;
  }

  const rawLocale = field(formData, "locale");
  const locale = routing.locales.includes(rawLocale as never)
    ? rawLocale
    : routing.defaultLocale;

  const [firstName, ...rest] = values.name.split(/\s+/);
  const contact = await addContact({
    email: values.email,
    firstName,
    lastName: rest.join(" "),
  });
  if (!contact.ok) console.error("[enquiry] Resend contact failed", contact);

  const t = await getTranslations({ locale, namespace: "contact.email" });
  const passFields: EnquiryEmailField[] = [
    { label: t("passenger"), value: values.name },
    { label: t("status"), value: t("statusValue"), highlight: true },
  ];
  if (company) passFields.push({ label: t("company"), value: company });

  // The team's inbox keeps its original env name so existing deployments
  // carry on working.
  const notify = process.env.WAITLIST_NOTIFY_EMAIL;

  const confirmation = sendEmail({
    to: values.email,
    ...enquiryConfirmationEmail(
      {
        subject: t("subject"),
        preheader: t("preheader"),
        eyebrow: t("eyebrow"),
        heading: t("heading", { name: firstName }),
        body: t("body"),
        replyHint: t("replyHint"),
        signoff: t("signoff"),
        footer: t("footer"),
      },
      passFields,
    ),
    replyTo: notify,
  });

  let notification: ReturnType<typeof sendEmail> | undefined;
  if (notify) {
    const rows = notifyRows.filter(([, value]) => value);
    notification = sendEmail({
      to: notify.split(",").map((s) => s.trim()),
      subject: notifySubject,
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
  if (!confirmed.ok) console.error("[enquiry] Confirmation failed", confirmed);
  if (notified && !notified.ok) {
    console.error("[enquiry] Notification failed", notified);
  }

  return contact.ok || Boolean(notified?.ok);
}

/** The "Get in touch" popup: name, email and phone, plus an optional note. */
export async function sendContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const values = contactValues(formData);

  if (isBot(formData)) {
    console.warn("[enquiry] Honeypot filled, ignoring", values.email);
    return { status: "success" };
  }

  const error = contactError(values);
  if (error) return { status: "error", error, values };

  const delivered = await deliver({
    formData,
    values,
    notifySubject: `New enquiry: ${values.name}`,
    notifyRows: [
      ["Name", values.name],
      ["Email", values.email],
      ["Phone", values.phone],
      ["Message", values.message],
    ],
  });

  return delivered
    ? { status: "success" }
    : { status: "error", error: "generic", values };
}

/** The corporate page form: contact details required, team details optional. */
export async function sendCorporateEnquiry(
  _prev: CorporateState,
  formData: FormData,
): Promise<CorporateState> {
  const rawLevel = field(formData, "level");
  const values: CorporateValues = {
    ...contactValues(formData),
    company: field(formData, "company").slice(0, 160),
    learners: field(formData, "learners").replace(/\D/g, "").slice(0, 6),
    level: LEVELS.includes(rawLevel) ? rawLevel : "",
    role: field(formData, "role").slice(0, 160),
  };

  if (isBot(formData)) {
    console.warn("[enquiry] Honeypot filled, ignoring", values.email);
    return { status: "success" };
  }

  const error = contactError(values);
  if (error) return { status: "error", error, values };
  if (values.company.length < 2) {
    return { status: "error", error: "invalidCompany", values };
  }

  const delivered = await deliver({
    formData,
    values,
    company: values.company,
    notifySubject: `New corporate enquiry: ${values.company}`,
    notifyRows: [
      ["Company", values.company],
      ["Name", values.name],
      ["Email", values.email],
      ["Phone", values.phone],
      ["Learners", values.learners],
      ["Current level", values.level],
      ["Job role or team", values.role],
      ["Message", values.message],
    ],
  });

  return delivered
    ? { status: "success" }
    : { status: "error", error: "generic", values };
}
