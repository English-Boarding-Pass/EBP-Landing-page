import { track } from "@vercel/analytics";
import { readConsent } from "@/lib/consent";

// Every event the site reports. Anonymous and cookieless: never put a name,
// email, phone number or test mark in the properties.
export type AnalyticsEvent =
  | { name: "get_in_touch_click"; source: string }
  | { name: "test_english_click"; source: string }
  | { name: "contact_submitted"; hasTestMark: boolean }
  | { name: "corporate_enquiry_submitted" };

export function trackEvent(event: AnalyticsEvent) {
  const { name, ...props } = event;
  // Nothing is recorded unless the visitor accepted.
  if (readConsent() !== "accepted") return;
  try {
    track(name, props);
  } catch {
    // Analytics must never break the page.
  }
}
