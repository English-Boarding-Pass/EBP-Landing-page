// Shared by the form fields (browser) and the server actions, so both sides
// apply exactly the same rules.

export const EMAIL_MAX = 254;

// local@domain.tld: no spaces, no consecutive/leading/trailing dots in the
// local part, domain labels of letters/digits/hyphens, TLD of 2+ letters.
export const EMAIL_PATTERN =
  "[A-Za-z0-9!#$%&'*+/=?^_`{|}~\\-]+(\\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~\\-]+)*@([A-Za-z0-9]([A-Za-z0-9\\-]{0,61}[A-Za-z0-9])?\\.)+[A-Za-z]{2,}";

const EMAIL_RE = new RegExp(`^${EMAIL_PATTERN}$`);

export function isValidEmail(email: string) {
  if (email.length > EMAIL_MAX) return false;
  const [local] = email.split("@");
  if (local.length > 64) return false;
  return EMAIL_RE.test(email);
}

export type Country = { iso: string; name: string; dial: string };

export const DEFAULT_DIAL = "+94";

export const COUNTRIES: Country[] = [
  { iso: "LK", name: "Sri Lanka", dial: "+94" },
  { iso: "IN", name: "India", dial: "+91" },
  { iso: "MV", name: "Maldives", dial: "+960" },
  { iso: "PK", name: "Pakistan", dial: "+92" },
  { iso: "BD", name: "Bangladesh", dial: "+880" },
  { iso: "NP", name: "Nepal", dial: "+977" },
  { iso: "AE", name: "United Arab Emirates", dial: "+971" },
  { iso: "SA", name: "Saudi Arabia", dial: "+966" },
  { iso: "QA", name: "Qatar", dial: "+974" },
  { iso: "KW", name: "Kuwait", dial: "+965" },
  { iso: "OM", name: "Oman", dial: "+968" },
  { iso: "BH", name: "Bahrain", dial: "+973" },
  { iso: "GB", name: "United Kingdom", dial: "+44" },
  { iso: "IE", name: "Ireland", dial: "+353" },
  { iso: "US", name: "United States", dial: "+1" },
  { iso: "CA", name: "Canada", dial: "+1" },
  { iso: "AU", name: "Australia", dial: "+61" },
  { iso: "NZ", name: "New Zealand", dial: "+64" },
  { iso: "SG", name: "Singapore", dial: "+65" },
  { iso: "MY", name: "Malaysia", dial: "+60" },
  { iso: "TH", name: "Thailand", dial: "+66" },
  { iso: "ID", name: "Indonesia", dial: "+62" },
  { iso: "PH", name: "Philippines", dial: "+63" },
  { iso: "HK", name: "Hong Kong", dial: "+852" },
  { iso: "CN", name: "China", dial: "+86" },
  { iso: "JP", name: "Japan", dial: "+81" },
  { iso: "KR", name: "South Korea", dial: "+82" },
  { iso: "DE", name: "Germany", dial: "+49" },
  { iso: "FR", name: "France", dial: "+33" },
  { iso: "IT", name: "Italy", dial: "+39" },
  { iso: "ES", name: "Spain", dial: "+34" },
  { iso: "NL", name: "Netherlands", dial: "+31" },
  { iso: "CH", name: "Switzerland", dial: "+41" },
  { iso: "SE", name: "Sweden", dial: "+46" },
  { iso: "NO", name: "Norway", dial: "+47" },
  { iso: "DK", name: "Denmark", dial: "+45" },
  { iso: "ZA", name: "South Africa", dial: "+27" },
  { iso: "BR", name: "Brazil", dial: "+55" },
];

/** Strips everything except digits, so letters can never get through. */
export function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

/** National digits for a country: drops the trunk "0" people type locally. */
export function nationalDigits(value: string) {
  return digitsOnly(value).replace(/^0+/, "");
}

export function isValidNationalNumber(dial: string, national: string) {
  if (!/^\d+$/.test(national)) return false;
  // Sri Lankan numbers are always 9 digits after the country code.
  if (dial === "+94") return national.length === 9;
  return national.length >= 6 && national.length <= 12;
}

/** Validates a combined "+94 771234567" value as submitted by PhoneField. */
export function isValidPhone(phone: string) {
  const match = /^(\+\d{1,3}) (\d+)$/.exec(phone);
  if (!match) return false;
  const [, dial, national] = match;
  if (!COUNTRIES.some((c) => c.dial === dial)) return false;
  return isValidNationalNumber(dial, national);
}
