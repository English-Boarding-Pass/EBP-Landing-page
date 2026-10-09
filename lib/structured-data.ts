import { socialLinks } from "@/lib/links";
import { CONTACT_EMAIL, SITE_URL } from "@/lib/site";

// The structured data (JSON-LD) search engines and AI answer engines read to
// learn who the site is, what it offers and how its pages fit together.
// Every function takes the page's locale so addresses and text match it.

const NAME = "English Boarding Pass";
const LANGUAGES = ["en", "si", "ta"];

/** The organisation, defined once and pointed to by id from other entries. */
export function organizationData(locale: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": `${SITE_URL}/#organization`,
    name: NAME,
    alternateName: "EBP",
    url: `${SITE_URL}/${locale}`,
    logo: `${SITE_URL}/icon/512`,
    description,
    areaServed: { "@type": "Country", name: "Sri Lanka" },
    knowsLanguage: LANGUAGES,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: CONTACT_EMAIL,
      availableLanguage: ["English", "Sinhala", "Tamil"],
    },
    sameAs: socialLinks.map((link) => link.href),
  };
}

/** The website itself, so the brand name and its short form are clear. */
export function websiteData(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: NAME,
    alternateName: "EBP",
    url: `${SITE_URL}/${locale}`,
    inLanguage: locale,
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

/** Home page, then the current page: the trail shown under a result. */
export function breadcrumbData(
  locale: string,
  homeName: string,
  page: { name: string; path: string },
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: homeName,
        item: `${SITE_URL}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: page.name,
        item: `${SITE_URL}/${locale}${page.path}`,
      },
    ],
  };
}

/** The corporate training offer. */
export function corporateServiceData(
  locale: string,
  name: string,
  description: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Corporate English training",
    name,
    description,
    url: `${SITE_URL}/${locale}/corporates`,
    inLanguage: locale,
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: { "@type": "Country", name: "Sri Lanka" },
    audience: { "@type": "BusinessAudience", name: "Companies in Sri Lanka" },
  };
}

/** The science page: an explanation of how English skills are learned and measured. */
export function sciencePageData(
  locale: string,
  name: string,
  description: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url: `${SITE_URL}/${locale}/science`,
    inLanguage: locale,
    about: [
      { "@type": "Thing", name: "English language learning" },
      {
        "@type": "DefinedTerm",
        name: "CEFR",
        description:
          "The Common European Framework of Reference for Languages, a six level scale from A1 to C2.",
      },
    ],
    isPartOf: { "@id": `${SITE_URL}/#website` },
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}
