// The team's copy of an enquiry: who it is and everything they entered.
// English only, because only the team reads it.

import {
  ICE,
  IVORY,
  MONO,
  NAVY,
  RED,
  SANS,
  SKY,
  SKY_INK,
  SLATE,
  esc,
} from "./theme";

/** One labelled answer from the form. Empty values are left out. */
export type EnquiryDetail = {
  label: string;
  value: string;
  highlight?: boolean;
};

export type EnquiryNotification = {
  kind: "individual" | "corporate";
  /** The person who filled in the form. */
  name: string;
  email: string;
  /** As submitted by PhoneField, e.g. "+94 771234567". */
  phone: string;
  company?: string;
  details: EnquiryDetail[];
  message: string;
  /** The language the site was in, so the team knows how to reply. */
  language: string;
  receivedAt: Date;
};

const LABEL = `margin:0;font-family:${MONO};font-size:10px;letter-spacing:2px;text-transform:uppercase;color:${SKY_INK};`;

function detailCell({ label, value, highlight }: EnquiryDetail) {
  return `
          <p style="${LABEL}">${esc(label)}</p>
          <p style="margin:4px 0 0;font-family:${SANS};font-size:15px;line-height:22px;font-weight:700;color:${highlight ? SKY_INK : NAVY};word-break:break-word;">${esc(value)}</p>`;
}

// Details sit two to a row; an odd one out gets the row to itself.
function detailRows(details: EnquiryDetail[]) {
  const rows: string[] = [];
  for (let i = 0; i < details.length; i += 2) {
    const pair = details.slice(i, i + 2);
    const padding = i === 0 ? "20px 20px 16px" : "0 20px 16px";
    rows.push(
      `<tr>${pair
        .map(
          (detail) =>
            `<td style="padding:${padding};" width="50%"${pair.length === 1 ? ' colspan="2"' : ""} valign="top">${detailCell(detail)}</td>`,
        )
        .join("")}</tr>`,
    );
  }
  return rows.join("\n        ");
}

export function enquiryNotificationEmail(enquiry: EnquiryNotification) {
  const corporate = enquiry.kind === "corporate";
  const [firstName] = enquiry.name.split(/\s+/);
  const eyebrow = corporate ? "New corporate enquiry" : "New enquiry";
  const heading = corporate && enquiry.company ? enquiry.company : enquiry.name;
  const subheading = corporate ? `From ${enquiry.name}` : "Individual student";
  const subject = corporate
    ? `New corporate enquiry: ${enquiry.company}`
    : `New enquiry: ${enquiry.name}`;

  const received = `${new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Colombo",
  }).format(enquiry.receivedAt)}, Sri Lanka time`;

  const details = [
    { label: "Email", value: enquiry.email },
    { label: "Phone", value: enquiry.phone },
    ...enquiry.details,
    { label: "Site language", value: enquiry.language },
  ].filter((detail) => detail.value);

  const message = enquiry.message
    ? `
    <!-- Message -->
    <tr><td style="padding:24px 32px 0;">
      <p style="${LABEL}">Message</p>
      <div style="margin:8px 0 0;padding:16px 18px;background:${IVORY};border-radius:14px;font-family:${SANS};font-size:15px;line-height:24px;color:${SLATE};">${esc(enquiry.message).replaceAll("\n", "<br>")}</div>
    </td></tr>`
    : "";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only">
<title>${esc(subject)}</title>
</head>
<body style="margin:0;padding:0;background:${IVORY};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(`${enquiry.name}, ${enquiry.phone}`)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${IVORY};">
<tr><td align="center" style="padding:32px 16px;">

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid #e6e2d9;">

    <!-- Header -->
    <tr><td style="background:${NAVY};padding:28px 32px 30px;">
      <p style="margin:0;font-family:${SANS};font-size:18px;line-height:20px;font-weight:700;color:#ffffff;">English<br><span style="color:${SKY};">Boarding Pass</span></p>
      <p style="margin:28px 0 0;font-family:${MONO};font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${SKY};"><span style="color:${RED};">&#9679;</span>&nbsp; ${esc(eyebrow)}</p>
      <h1 style="margin:10px 0 0;font-family:${SANS};font-size:28px;line-height:34px;font-weight:800;color:#ffffff;">${esc(heading)}</h1>
      <p style="margin:6px 0 0;font-family:${SANS};font-size:15px;line-height:22px;color:#c9d6f2;">${esc(subheading)}</p>
    </td></tr>

    <!-- What they entered -->
    <tr><td style="padding:28px 32px 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${ICE};border-radius:14px;">
        ${detailRows(details)}
        <tr><td colspan="2" style="padding:0 0 4px;font-size:0;line-height:0;">&nbsp;</td></tr>
      </table>
    </td></tr>
${message}

    <!-- Footer -->
    <tr><td style="padding:28px 32px 28px;">
      <div style="border-top:1px solid #ece8df;padding-top:18px;font-family:${SANS};font-size:12px;line-height:18px;color:#7a8394;">Received ${esc(received)}, from the ${corporate ? "corporate enquiry form" : "Get in touch form"}. Replying to this email goes straight to ${esc(firstName)}.</div>
    </td></tr>

  </table>

</td></tr>
</table>
</body>
</html>`;

  const text = [
    `${eyebrow}: ${heading}`,
    subheading,
    "",
    ...details.map((detail) => `${detail.label}: ${detail.value}`),
    ...(enquiry.message ? ["", "Message:", enquiry.message] : []),
    "",
    `Received ${received}.`,
  ].join("\n");

  return { subject, html, text };
}
