// Contact details shown across the site. Both are placeholders until the
// real WhatsApp number and domain mailbox are set up.
export const WHATSAPP_NUMBER = "94770000000";
export const CONTACT_EMAIL = "hello@englishboardingpass.lk";

export const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}`;

// Public address of the site, used by the sitemap and robots.txt. Set
// NEXT_PUBLIC_SITE_URL once the domain is bought.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://englishboardingpass.lk"
).replace(/\/$/, "");
