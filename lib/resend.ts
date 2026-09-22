// Server-side only (reads RESEND_API_KEY). Thin wrapper over Resend's REST
// API (https://resend.com/docs/api-reference). Plain fetch keeps the landing page free of an SDK dependency for two calls.

const API = "https://api.resend.com";

type ResendResult =
  { ok: true } | { ok: false; status: number; message: string };

async function call(path: string, body: unknown): Promise<ResendResult> {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (res.ok) return { ok: true };
  const data = (await res.json().catch(() => null)) as {
    message?: string;
  } | null;
  return {
    ok: false,
    status: res.status,
    message: data?.message ?? res.statusText,
  };
}

export function isResendConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

/**
 * Saves the person as a Resend contact. With RESEND_AUDIENCE_ID set they go
 * into that audience; otherwise into the account's contact list. Someone who
 * joins twice is not an error.
 */
export async function addContact(contact: {
  email: string;
  firstName: string;
  lastName: string;
}): Promise<ResendResult> {
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  const result = await call(
    audienceId ? `/audiences/${audienceId}/contacts` : "/contacts",
    {
      email: contact.email,
      first_name: contact.firstName,
      last_name: contact.lastName,
      unsubscribed: false,
    },
  );
  if (
    !result.ok &&
    (result.status === 409 || /already exists/i.test(result.message))
  ) {
    return { ok: true };
  }
  return result;
}

export function sendEmail(email: {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}): Promise<ResendResult> {
  return call("/emails", {
    from: process.env.RESEND_FROM_EMAIL,
    to: email.to,
    subject: email.subject,
    html: email.html,
    text: email.text,
    ...(email.replyTo ? { reply_to: email.replyTo } : {}),
  });
}
