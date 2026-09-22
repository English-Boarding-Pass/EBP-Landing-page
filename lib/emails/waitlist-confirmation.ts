// Boarding-pass styled confirmation email. Email clients ignore <style>
// blocks and modern CSS unevenly, so this is table layout with inline
// styles only. Colours mirror the brand tokens in app/globals.css.

const NAVY = "#0b1956";
const SLATE = "#26344d";
const SKY = "#9cccf6";
const SKY_INK = "#2563a8";
const ICE = "#eaf5fc";
const IVORY = "#f8f3ea";

const SANS =
  "'DM Sans','Segoe UI',Roboto,Helvetica,Arial,'Noto Sans Sinhala','Iskoola Pota','Noto Sans Tamil','Latha',sans-serif";
const MONO = "'JetBrains Mono',Menlo,Consolas,'Courier New',monospace";

export type WaitlistEmailCopy = {
  subject: string;
  preheader: string;
  eyebrow: string;
  heading: string;
  body: string;
  passenger: string;
  route: string;
  status: string;
  statusValue: string;
  departs: string;
  earlyBird: string;
  replyHint: string;
  signoff: string;
  footer: string;
};

export type WaitlistEmailData = {
  name: string;
  routeCode: string;
  routeName: string;
  departs: string;
};

function esc(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function passField(label: string, value: string, highlight = false) {
  return `
    <p style="margin:0;font-family:${MONO};font-size:10px;letter-spacing:2px;text-transform:uppercase;color:${SKY_INK};">${esc(label)}</p>
    <p style="margin:4px 0 0;font-family:${MONO};font-size:15px;font-weight:700;color:${highlight ? SKY_INK : NAVY};">${esc(value)}</p>`;
}

export function waitlistConfirmationEmail(
  copy: WaitlistEmailCopy,
  data: WaitlistEmailData,
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
        <tr>
          <td style="padding:20px 20px 16px;" width="50%" valign="top">${passField(copy.passenger, data.name)}</td>
          <td style="padding:20px 20px 16px;" width="50%" valign="top">${passField(copy.route, data.routeCode)}</td>
        </tr>
        <tr>
          <td style="padding:0 20px 20px;" width="50%" valign="top">${passField(copy.status, copy.statusValue, true)}</td>
          <td style="padding:0 20px 20px;" width="50%" valign="top">${passField(copy.departs, data.departs)}</td>
        </tr>
        <tr><td colspan="2" style="padding:0 20px;"><div style="border-top:2px dashed #c4dcee;font-size:0;line-height:0;">&nbsp;</div></td></tr>
        <tr><td colspan="2" style="padding:14px 20px 18px;font-family:${SANS};font-size:13px;color:${SLATE};">${esc(data.routeName)}</td></tr>
      </table>
    </td></tr>

    <!-- Body -->
    <tr><td style="padding:28px 32px 8px;font-family:${SANS};font-size:15px;line-height:24px;color:${SLATE};">
      <p style="margin:0 0 16px;">${esc(copy.body)}</p>
      <p style="margin:0 0 16px;padding:12px 16px;border:1px solid #d6e8f6;background:#f4f9fd;border-radius:10px;color:${NAVY};font-weight:700;">${esc(copy.earlyBird)}</p>
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
    `${copy.passenger}: ${data.name}`,
    `${copy.route}: ${data.routeCode} (${data.routeName})`,
    `${copy.status}: ${copy.statusValue}`,
    `${copy.departs}: ${data.departs}`,
    "",
    copy.body,
    "",
    copy.earlyBird,
    "",
    copy.replyHint,
    "",
    copy.signoff,
    "English Boarding Pass",
    "",
    "—",
    copy.footer,
  ].join("\n");

  return { subject: copy.subject, html, text };
}
