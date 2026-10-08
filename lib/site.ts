// Contact details shown across the site. Both are placeholders until the
// real WhatsApp number and domain mailbox are set up.
export const WHATSAPP_NUMBER = "94770000000";
export const CONTACT_EMAIL = "hello@englishboardingpass.lk";

export const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}`;

// Public address of the site: the canonical and share links on every page,
// the sitemap and robots.txt. ebp.lk is the primary domain;
// englishboardingpass.lk should redirect to it. NEXT_PUBLIC_SITE_URL
// overrides this, e.g. for a preview address. `||` rather than `??` so an
// empty variable on Vercel falls back too, instead of breaking the build.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://ebp.lk"
).replace(/\/$/, "");
