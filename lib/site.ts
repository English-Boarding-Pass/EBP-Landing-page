// Contact details shown across the site. The WhatsApp number is a
// placeholder until the real one is set up. The email is the team's Gmail
// address until a domain mailbox exists.
export const WHATSAPP_NUMBER = "94770000000";
export const CONTACT_EMAIL = "englishboardingpass.lk@gmail.com";

export const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}`;

// Public address of the site: the canonical and share links on every page,
// the sitemap and robots.txt. ebp.lk is the primary domain;
// englishboardingpass.lk should redirect to it. NEXT_PUBLIC_SITE_URL
// overrides this, e.g. for a preview address. `||` rather than `??` so an
// empty variable on Vercel falls back too, instead of breaking the build.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://ebp.lk"
).replace(/\/$/, "");
