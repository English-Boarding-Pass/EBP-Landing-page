"use client";

import { clsx } from "clsx";
import { useId, useState, type ReactNode } from "react";
import {
  COUNTRIES,
  DEFAULT_DIAL,
  EMAIL_MAX,
  EMAIL_PATTERN,
  digitsOnly,
  isValidNationalNumber,
  nationalDigits,
} from "@/lib/validation";

const controlClasses =
  // 16px text stops iOS Safari zooming the page on focus; 44px is the touch minimum.
  "min-h-11 w-full rounded-xl border border-navy/15 bg-paper py-2.5 pr-4 text-base text-navy " +
  "placeholder:text-slate/40 focus:border-sky-ink focus:outline-none focus:ring-2 focus:ring-sky-ink/25 " +
  "aria-invalid:border-red-500";

type FieldProps = {
  /** Prefix that keeps ids unique when two forms share a page. */
  form: string;
  id: string;
  label: string;
  hint?: ReactNode;
  error?: string;
  required?: boolean;
  /** Shown beside the label of a field that isn't required. */
  optionalLabel?: string;
  defaultValue?: string;
};

function FieldShell({
  inputId,
  label,
  hint,
  error,
  required,
  optionalLabel,
  children,
}: Omit<FieldProps, "form" | "id" | "defaultValue"> & {
  inputId: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={inputId}
        className="mb-1.5 block text-xs font-semibold text-slate"
      >
        {label}
        {!required && optionalLabel ? (
          <span className="font-normal text-slate/70"> ({optionalLabel})</span>
        ) : null}
      </label>
      {children}
      {error ? (
        <p id={`${inputId}-error`} className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      ) : null}
      {hint ? (
        <p id={`${inputId}-hint`} className="mt-1.5 text-xs text-slate/70">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function describedBy(inputId: string, error?: string, hint?: ReactNode) {
  const ids = [error && `${inputId}-error`, hint && `${inputId}-hint`].filter(
    Boolean,
  );
  return ids.length ? ids.join(" ") : undefined;
}

export function Field({
  form,
  id,
  icon,
  type = "text",
  autoComplete,
  inputMode,
  min,
  max,
  required = true,
  defaultValue,
  invalidMessage,
  ...shell
}: FieldProps & {
  icon?: ReactNode;
  type?: string;
  autoComplete?: string;
  inputMode?: "tel" | "email" | "numeric";
  min?: number;
  max?: number;
  /** Replaces the browser's default message when the value is invalid. */
  invalidMessage?: string;
}) {
  const inputId = `${form}-${id}`;
  const isEmail = type === "email";
  return (
    <FieldShell inputId={inputId} required={required} {...shell}>
      <div className="relative">
        {icon ? (
          <span
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-slate/50"
          >
            {icon}
          </span>
        ) : null}
        <input
          id={inputId}
          name={id}
          type={type}
          required={required}
          autoComplete={autoComplete}
          inputMode={inputMode}
          min={min}
          max={max}
          pattern={isEmail ? EMAIL_PATTERN : undefined}
          maxLength={isEmail ? EMAIL_MAX : undefined}
          defaultValue={defaultValue}
          aria-invalid={shell.error ? true : undefined}
          aria-describedby={describedBy(inputId, shell.error, shell.hint)}
          onInvalid={
            invalidMessage
              ? (e) => e.currentTarget.setCustomValidity(invalidMessage)
              : undefined
          }
          onInput={
            invalidMessage
              ? (e) => e.currentTarget.setCustomValidity("")
              : undefined
          }
          className={clsx(controlClasses, icon ? "pl-10" : "pl-4")}
        />
      </div>
    </FieldShell>
  );
}

/** Splits a stored "+94 771234567" back into its country code and digits. */
function splitPhone(value?: string) {
  const match = value ? /^(\+\d{1,3}) (\d+)$/.exec(value) : null;
  return match
    ? { dial: match[1], national: match[2] }
    : { dial: DEFAULT_DIAL, national: "" };
}

/**
 * Country-code picker plus a digits-only number box. Letters and symbols are
 * stripped as they're typed or pasted. Submits one `phone` value such as
 * "+94 771234567".
 */
export function PhoneField({
  form,
  id,
  required = true,
  defaultValue,
  countryLabel,
  invalidMessage,
  ...shell
}: FieldProps & {
  countryLabel: string;
  invalidMessage: string;
}) {
  const inputId = `${form}-${id}`;
  const initial = splitPhone(defaultValue);
  // Tracked by ISO code because several countries share a dial code (+1).
  const [iso, setIso] = useState(
    (COUNTRIES.find((c) => c.dial === initial.dial) ?? COUNTRIES[0]).iso,
  );
  const [national, setNational] = useState(initial.national);
  const selectId = useId();
  const dial = COUNTRIES.find((c) => c.iso === iso)?.dial ?? DEFAULT_DIAL;

  const digits = nationalDigits(national);
  const value = digits ? `${dial} ${digits}` : "";

  function validate(
    el: HTMLInputElement,
    nextDial: string,
    nextNational: string,
  ) {
    const ok =
      !nextNational ||
      isValidNationalNumber(nextDial, nationalDigits(nextNational));
    el.setCustomValidity(ok ? "" : invalidMessage);
  }

  return (
    <FieldShell inputId={inputId} required={required} {...shell}>
      <div className="flex gap-2">
        <select
          id={selectId}
          aria-label={countryLabel}
          value={iso}
          onChange={(e) => {
            setIso(e.target.value);
            const nextDial =
              COUNTRIES.find((c) => c.iso === e.target.value)?.dial ??
              DEFAULT_DIAL;
            const input = document.getElementById(inputId);
            if (input instanceof HTMLInputElement) {
              validate(input, nextDial, national);
            }
          }}
          className={clsx(
            controlClasses.replace("w-full", "").replace("pr-4", ""),
            "w-[6.5rem] shrink-0 pr-1 pl-3",
          )}
        >
          {COUNTRIES.map((c) => (
            <option key={c.iso} value={c.iso}>
              {c.iso} {c.dial}
            </option>
          ))}
        </select>
        <div className="min-w-0 flex-1">
          <input
            id={inputId}
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            required={required}
            maxLength={14}
            pattern="[0-9]*"
            value={national}
            onChange={(e) => {
              const next = digitsOnly(e.target.value).slice(0, 14);
              setNational(next);
              validate(e.currentTarget, dial, next);
            }}
            // Block letters before they appear; paste and autofill are
            // cleaned by onChange above.
            onKeyDown={(e) => {
              if (
                e.key.length === 1 &&
                !/\d/.test(e.key) &&
                !e.ctrlKey &&
                !e.metaKey
              ) {
                e.preventDefault();
              }
            }}
            onInvalid={(e) => {
              if (e.currentTarget.value) {
                e.currentTarget.setCustomValidity(invalidMessage);
              }
            }}
            aria-invalid={shell.error ? true : undefined}
            aria-describedby={describedBy(inputId, shell.error, shell.hint)}
            className={clsx(controlClasses, "pl-4")}
          />
        </div>
      </div>
      <input type="hidden" name={id} value={value} />
    </FieldShell>
  );
}

export function TextAreaField({
  form,
  id,
  rows = 3,
  required = true,
  defaultValue,
  ...shell
}: FieldProps & { rows?: number }) {
  const inputId = `${form}-${id}`;
  return (
    <FieldShell inputId={inputId} required={required} {...shell}>
      <textarea
        id={inputId}
        name={id}
        rows={rows}
        required={required}
        defaultValue={defaultValue}
        aria-invalid={shell.error ? true : undefined}
        aria-describedby={describedBy(inputId, shell.error, shell.hint)}
        className={clsx(controlClasses, "resize-y pl-4")}
      />
    </FieldShell>
  );
}

export function SelectField({
  form,
  id,
  options,
  required = true,
  defaultValue,
  ...shell
}: FieldProps & { options: { value: string; label: string }[] }) {
  const inputId = `${form}-${id}`;
  return (
    <FieldShell inputId={inputId} required={required} {...shell}>
      <select
        id={inputId}
        name={id}
        required={required}
        defaultValue={defaultValue ?? ""}
        aria-invalid={shell.error ? true : undefined}
        aria-describedby={describedBy(inputId, shell.error, shell.hint)}
        className={clsx(controlClasses, "pl-4")}
      >
        <option value=""></option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

/** Bot trap: hidden from people and assistive tech, so only scripts fill it. */
export function Honeypot() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute size-0 overflow-hidden opacity-0"
    >
      <label>
        Leave this empty
        <input
          type="text"
          name="ebp_hp_field"
          tabIndex={-1}
          autoComplete="off"
          data-1p-ignore
          data-lpignore="true"
        />
      </label>
    </div>
  );
}
