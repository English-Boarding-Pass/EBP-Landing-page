"use client";

import { useSyncExternalStore } from "react";

// The visitor's analytics choice, kept in this browser only.
export type Consent = "accepted" | "rejected" | "unset";

const KEY = "ebp-analytics-consent";
const EVENT = "ebp-consent-change";

export function readConsent(): Consent {
  try {
    const value = window.localStorage.getItem(KEY);
    return value === "accepted" || value === "rejected" ? value : "unset";
  } catch {
    // Storage blocked: treat it as no choice made, so nothing is tracked.
    return "unset";
  }
}

function write(value: Consent) {
  try {
    if (value === "unset") window.localStorage.removeItem(KEY);
    else window.localStorage.setItem(KEY, value);
  } catch {
    // Nothing to save to; the choice then only lasts until the page reloads.
  }
  window.dispatchEvent(new Event(EVENT));
}

export const setConsent = (value: "accepted" | "rejected") => write(value);

/** Brings the banner back so the visitor can choose again. */
export const resetConsent = () => write("unset");

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** "loading" on the server and during hydration, so the banner never flashes. */
export function useConsent(): Consent | "loading" {
  return useSyncExternalStore(subscribe, readConsent, () => "loading" as const);
}
