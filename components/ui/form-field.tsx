import { clsx } from "clsx";
import type { ReactNode } from "react";

const controlClasses =
  "w-full rounded-xl border border-navy/15 bg-white py-2.5 pr-4 text-sm text-navy " +
  "placeholder:text-slate/40 focus:border-sky-ink focus:outline-none focus:ring-2 focus:ring-sky-ink/25 " +
  "aria-invalid:border-red-500";

type FieldProps = {
  /** Prefix that keeps ids unique when two forms share a page. */
  form: string;
  id: string;
  label: string;
  hint?: string;
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
      ) : hint ? (
        <p id={`${inputId}-hint`} className="mt-1.5 text-xs text-slate/70">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function describedBy(inputId: string, error?: string, hint?: string) {
  return error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;
}

export function Field({
  form,
  id,
  icon,
  type = "text",
  autoComplete,
  inputMode,
  min,
  required = true,
  defaultValue,
  ...shell
}: FieldProps & {
  icon?: ReactNode;
  type?: string;
  autoComplete?: string;
  inputMode?: "tel" | "email" | "numeric";
  min?: number;
}) {
  const inputId = `${form}-${id}`;
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
          defaultValue={defaultValue}
          aria-invalid={shell.error ? true : undefined}
          aria-describedby={describedBy(inputId, shell.error, shell.hint)}
          className={clsx(controlClasses, icon ? "pl-10" : "pl-4")}
        />
      </div>
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
