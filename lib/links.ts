// Outbound links used across the site. Order here is the order they render in.
export const socialLinks = [
  {
    key: "linkedin",
    href: "https://www.linkedin.com/company/english-boarding-pass/",
  },
  {
    key: "facebook",
    href: "https://www.facebook.com/profile.php?id=61593682063957",
  },
  {
    key: "instagram",
    href: "https://www.instagram.com/englishboardingpass.lk/",
  },
] as const;

export type SocialKey = (typeof socialLinks)[number]["key"];
