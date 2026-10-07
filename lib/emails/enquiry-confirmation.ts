// Boarding-pass styled confirmation email, sent to the person who filled in
// a form. The team's copy of the enquiry is in enquiry-notification.ts.

import {
  ICE,
  IVORY,
  MONO,
  NAVY,
  SANS,
  SKY,
  SKY_INK,
  SLATE,
  esc,
} from "./theme";

export type EnquiryEmailCopy = {
  subject: string;
  preheader: string;
  eyebrow: string;
  heading: string;
  body: string;
  replyHint: string;
  signoff: string;
  footer: string;
};

/** One labelled value on the boarding pass, e.g. Passenger / Status. */
export type EnquiryEmailField = {
  label: string;
  value: string;
  highlight?: boolean;
};

function passField({ label, value, highlight }: EnquiryEmailField) {
  return `
    <p style="margin:0;font-family:${MONO};font-size:10px;letter-spacing:2px;text-transform:uppercase;color:${SKY_INK};">${esc(label)}</p>
    <p style="margin:4px 0 0;font-family:${MONO};font-size:15px;font-weight:700;color:${highlight ? SKY_INK : NAVY};">${esc(value)}</p>`;
}

// Fields sit two to a row; an odd one out gets the row to itself.
function passRows(fields: EnquiryEmailField[]) {
  const rows: string[] = [];
  for (let i = 0; i < fields.length; i += 2) {
    const pair = fields.slice(i, i + 2);
    const padding = i === 0 ? "20px 20px 16px" : "0 20px 20px";
    rows.push(
      `<tr>${pair
        .map(
          (field) =>
            `<td style="padding:${padding};" width="50%"${pair.length === 1 ? ' colspan="2"' : ""} valign="top">${passField(field)}</td>`,
        )
        .join("")}</tr>`,
    );
  }
  return rows.join("\n        ");
}

export function enquiryConfirmationEmail(
  copy: EnquiryEmailCopy,
  fields: EnquiryEmailField[],
) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only">
<title>${esc(copy.subject)}</title>
</head>
<body style="margin:0;padding:0;background:${IVORY};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(copy.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${IVORY};">
<tr><td align="center" style="padding:32px 16px;">

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid #e6e2d9;">

    <!-- Header -->
    <tr><td style="background:${NAVY};padding:28px 32px 32px;">
      <p style="margin:0;font-family:${SANS};font-size:18px;line-height:20px;font-weight:700;color:#ffffff;">English<br><span style="color:${SKY};">Boarding Pass</span></p>
      <p style="margin:28px 0 0;font-family:${MONO};font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${SKY};">&#10003;&nbsp; ${esc(copy.eyebrow)}</p>
      <h1 style="margin:10px 0 0;font-family:${SANS};font-size:28px;line-height:34px;font-weight:800;color:#ffffff;">${esc(copy.heading)}</h1>
    </td></tr>

    <!-- Boarding pass -->
    <tr><td style="padding:28px 32px 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${ICE};border-radius:14px;">
        ${passRows(fields)}
      </table>
    </td></tr>

    <!-- Body -->
    <tr><td style="padding:28px 32px 8px;font-family:${SANS};font-size:15px;line-height:24px;color:${SLATE};">
      <p style="margin:0 0 16px;">${esc(copy.body)}</p>
      <p style="margin:0 0 24px;">${esc(copy.replyHint)}</p>
      <p style="margin:0;">${esc(copy.signoff)}<br><strong style="color:${NAVY};">English Boarding Pass</strong></p>
    </td></tr>

    <!-- Footer -->
    <tr><td style="padding:28px 32px 28px;">
      <div style="border-top:1px solid #ece8df;padding-top:18px;font-family:${SANS};font-size:12px;line-height:18px;color:#7a8394;">${esc(copy.footer)}</div>
    </td></tr>

  </table>

</td></tr>
</table>
</body>
</html>`;

  const text = [
    copy.heading,
    "",
    ...fields.map((field) => `${field.label}: ${field.value}`),
    "",
    copy.body,
    "",
    copy.replyHint,
    "",
    copy.signoff,
    "English Boarding Pass",
    "",
    "--",
    copy.footer,
  ].join("\n");

  return { subject: copy.subject, html, text };
}
