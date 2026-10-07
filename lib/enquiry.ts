"use server";

import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { allowAttempts } from "@/lib/rate-limit";
import { isValidEmail, isValidPhone, isValidTestMark } from "@/lib/validation";
import { addContact, isResendConfigured, sendEmail } from "@/lib/resend";
import {
  enquiryConfirmationEmail,
  type EnquiryEmailField,
} from "@/lib/emails/enquiry-confirmation";
import {
  enquiryNotificationEmail,
  type EnquiryDetail,
} from "@/lib/emails/enquiry-notification";

export type ContactValues = {
  name: string;
  email: string;
  phone: string;
  /** Optional mark out of 25 from the free Cambridge English test. */
  testMark: string;
  message: string;
};

type ContactError =
  | "invalidName"
  | "invalidEmail"
  | "invalidPhone"
  | "invalidMark"
  | "rateLimited"
  | "generic";

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

const LEVELS = ["unsure", "beginner", "intermediate", "advanced", "mixed"];

// How the team's email names things the forms store as short codes.
const LEVEL_LABELS: Record<string, string> = {
  unsure: "Not sure yet",
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  mixed: "Mixed levels",
};
const LANGUAGE_LABELS: Record<string, string> = {
  en: "English",
  si: "Sinhala",
  ta: "Tamil",
};

function field(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function contactValues(formData: FormData): ContactValues {
  return {
    name: field(formData, "name").slice(0, 120),
    email: field(formData, "email").toLowerCase().slice(0, 254),
    phone: field(formData, "phone").slice(0, 20),
    testMark: field(formData, "testMark").slice(0, 3),
    message: field(formData, "message").slice(0, 2000),
  };
}

function contactError(values: ContactValues): ContactError | null {
  if (values.name.length < 2) return "invalidName";
  if (!isValidEmail(values.email)) return "invalidEmail";
  if (!isValidPhone(values.phone)) return "invalidPhone";
  if (values.testMark && !isValidTestMark(values.testMark))
    return "invalidMark";
  return null;
}

// Honeypot: real people never see or fill this field. Its name must not look
// like anything browser autofill knows (e.g. "company"), or real enquiries get
// silently dropped.
function isBot(formData: FormData) {
  return Boolean(field(formData, "ebp_hp_field"));
}

const MINUTE = 60 * 1000;

/**
 * Whether this enquiry is within the limits: 5 per visitor in 10 minutes
 * (roomy enough for an office sharing one address) and 3 per email address
 * in an hour. Only enquiries that passed validation are counted, so fixing a
 * typo never uses up an attempt. See lib/rate-limit.ts for what the limiter
 * can and can't promise.
 */
async function withinLimits(email: string) {
  const requestHeaders = await headers();
  // Vercel sets x-forwarded-for itself, so a visitor can't fake it there.
  const visitor =
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    requestHeaders.get("x-real-ip") ||
    "unknown";

  return allowAttempts([
    { key: `visitor:${visitor}`, limit: 5, windowMs: 10 * MINUTE },
    { key: `email:${email}`, limit: 3, windowMs: 60 * MINUTE },
  ]);
}

/**
 * Saves the person as a Resend contact, emails them a confirmation in their
 * language, and emails the team the details. Returns false only when the
 * enquiry reached neither the contact list nor the team's inbox.
 */
async function deliver({
  formData,
  values,
  kind,
  details,
  company,
}: {
  formData: FormData;
  values: ContactValues;
  kind: "individual" | "corporate";
  /** Form answers for the team's email, beyond name, email, phone and message. */
  details: EnquiryDetail[];
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
    notification = sendEmail({
      to: notify.split(",").map((s) => s.trim()),
      ...enquiryNotificationEmail({
        kind,
        name: values.name,
        email: values.email,
        phone: values.phone,
        company,
        details,
        message: values.message,
        language: LANGUAGE_LABELS[locale] ?? locale,
        receivedAt: new Date(),
      }),
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
  if (!(await withinLimits(values.email))) {
    return { status: "error", error: "rateLimited", values };
  }

  const delivered = await deliver({
    formData,
    values,
    kind: "individual",
    details: [
      {
        label: "Cambridge test mark",
        value: values.testMark ? `${values.testMark} / 25` : "",
        highlight: true,
      },
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
  if (!(await withinLimits(values.email))) {
    return { status: "error", error: "rateLimited", values };
  }

  const delivered = await deliver({
    formData,
    values,
    company: values.company,
    kind: "corporate",
    details: [
      { label: "Number of learners", value: values.learners },
      { label: "Current level", value: LEVEL_LABELS[values.level] ?? "" },
      { label: "Job role or team", value: values.role },
    ],
  });

  return delivered
    ? { status: "success" }
    : { status: "error", error: "generic", values };
}
