"use client";

import {
  createContext,
  useActionState,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { clsx } from "clsx";
import { useLocale, useTranslations } from "next-intl";
import { Mail, User, Phone, CheckCircle, Xmark } from "iconoir-react";
import { Button } from "@/components/ui/button";
import {
  joinWaitlist,
  type WaitlistRoute,
  type WaitlistState,
} from "@/lib/waitlist";

type OpenWaitlist = (route?: WaitlistRoute) => void;

const WaitlistContext = createContext<OpenWaitlist | null>(null);

export function useWaitlist() {
  const open = useContext(WaitlistContext);
  if (!open)
    throw new Error("useWaitlist must be used inside WaitlistProvider");
  return open;
}

/**
 * Owns the single waitlist dialog for the page. Every "Join the waitlist"
 * button calls `useWaitlist()` to open it, optionally with a route picked.
 */
export function WaitlistProvider({ children }: { children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [route, setRoute] = useState<WaitlistRoute | undefined>();
  // Bumped on every open so each one starts with a fresh form and the
  // picked route pre-selected (radios only read defaultChecked on mount).
  const [formKey, setFormKey] = useState(0);

  const open = useCallback<OpenWaitlist>((picked) => {
    setRoute(picked);
    setFormKey((k) => k + 1);
    dialogRef.current?.showModal();
  }, []);

  const close = useCallback(() => dialogRef.current?.close(), []);

  return (
    <WaitlistContext.Provider value={open}>
      {children}
      <dialog
        ref={dialogRef}
        aria-labelledby="waitlist-title"
        // Click on the backdrop (the dialog element itself, outside the panel) closes it.
        onClick={(e) => e.target === e.currentTarget && close()}
        className="m-auto w-[calc(100%-2rem)] max-w-md overflow-visible bg-transparent p-0 backdrop:bg-navy/70 backdrop:backdrop-blur-sm"
      >
        <WaitlistPanel key={formKey} route={route} onClose={close} />
      </dialog>
    </WaitlistContext.Provider>
  );
}

const inputClasses =
  "w-full rounded-xl border border-navy/15 bg-white py-2.5 pl-10 pr-4 text-sm text-navy " +
  "placeholder:text-slate/40 focus:border-sky-ink focus:outline-none focus:ring-2 focus:ring-sky-ink/25 " +
  "aria-invalid:border-red-500";

const ROUTES: WaitlistRoute[] = ["sinhala", "tamil"];

function Field({
  id,
  label,
  hint,
  icon,
  type = "text",
  autoComplete,
  inputMode,
  defaultValue,
  error,
}: {
  id: string;
  label: string;
  hint?: string;
  icon: ReactNode;
  type?: string;
  autoComplete?: string;
  inputMode?: "tel" | "email";
  defaultValue?: string;
  error?: string;
}) {
  const inputId = `waitlist-${id}`;
  const describedBy = error
    ? `${inputId}-error`
    : hint
      ? `${inputId}-hint`
      : undefined;
  return (
    <div>
      <label
        htmlFor={inputId}
        className="mb-1.5 block text-xs font-semibold text-slate"
      >
        {label}
      </label>
      <div className="relative">
        <span
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-slate/50"
        >
          {icon}
        </span>
        <input
          id={inputId}
          name={id}
          type={type}
          required
          autoComplete={autoComplete}
          inputMode={inputMode}
          defaultValue={defaultValue}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={inputClasses}
        />
      </div>
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

function WaitlistPanel({
  route,
  onClose,
}: {
  route?: WaitlistRoute;
  onClose: () => void;
}) {
  const t = useTranslations("waitlist");
  const tRoutes = useTranslations("routes");
  const locale = useLocale();
  const [state, action, pending] = useActionState<WaitlistState, FormData>(
    joinWaitlist,
    { status: "idle" },
  );

  const values = state.status === "error" ? state.values : undefined;
  const error = state.status === "error" ? state.error : undefined;
  const selectedRoute = values ? values.route : route;

  return (
    <div className="relative max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-card bg-white shadow-[0_24px_64px_-24px_rgba(0,0,0,0.6)]">
      <button
        type="button"
        onClick={onClose}
        aria-label={t("close")}
        className="absolute top-3 right-3 inline-flex size-9 items-center justify-center rounded-full text-slate/60 hover:bg-ice hover:text-navy"
      >
        <Xmark className="size-5" aria-hidden />
      </button>

      {state.status === "success" ? (
        <div
          role="status"
          className="flex flex-col items-center gap-3 px-8 py-12 text-center"
        >
          <CheckCircle className="size-10 text-sky-ink" aria-hidden />
          <h2
            id="waitlist-title"
            className="font-display text-xl font-bold text-navy"
          >
            {t("successTitle")}
          </h2>
          <p className="text-sm leading-relaxed text-slate">
            {t("successBody", { email: state.email })}
          </p>
          <Button
            type="button"
            variant="primary"
            size="md"
            className="mt-3"
            onClick={onClose}
          >
            {t("done")}
          </Button>
        </div>
      ) : (
        <form
          action={action}
          className="flex flex-col gap-4 px-6 pt-8 pb-6 sm:px-8"
        >
          <div className="pr-8">
            <h2
              id="waitlist-title"
              className="font-display text-2xl font-extrabold text-navy"
            >
              {t("title")}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate">
              {t("subtitle")}
            </p>
          </div>

          <input type="hidden" name="locale" value={locale} />
          {/* Honeypot for bots — hidden from people and assistive tech. */}
          <div
            aria-hidden
            className="pointer-events-none absolute size-0 overflow-hidden opacity-0"
          >
            <label>
              Company
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
              />
            </label>
          </div>

          <Field
            id="name"
            label={t("nameLabel")}
            icon={<User className="size-4" />}
            autoComplete="name"
            defaultValue={values?.name}
            error={error === "invalidName" ? t("errors.name") : undefined}
          />

          <Field
            id="email"
            label={t("emailLabel")}
            icon={<Mail className="size-4" />}
            type="email"
            inputMode="email"
            autoComplete="email"
            defaultValue={values?.email}
            error={error === "invalidEmail" ? t("errors.email") : undefined}
          />

          <Field
            id="phone"
            label={t("phoneLabel")}
            hint={t("phoneHint")}
            icon={<Phone className="size-4" />}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            defaultValue={values?.phone}
            error={error === "invalidPhone" ? t("errors.phone") : undefined}
          />

          <fieldset
            aria-describedby={
              error === "invalidRoute" ? "waitlist-route-error" : undefined
            }
          >
            <legend className="mb-1.5 block text-xs font-semibold text-slate">
              {t("routeLegend")}
            </legend>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {ROUTES.map((value) => (
                <label
                  key={value}
                  className={clsx(
                    "flex cursor-pointer items-center justify-center rounded-xl border px-3 py-3 text-center text-sm font-medium transition-colors",
                    "border-navy/15 text-slate hover:border-navy/30",
                    "has-checked:border-navy has-checked:bg-navy has-checked:text-white",
                    "has-focus-visible:ring-2 has-focus-visible:ring-sky-ink/40",
                  )}
                >
                  <input
                    type="radio"
                    name="route"
                    value={value}
                    required
                    defaultChecked={selectedRoute === value}
                    className="sr-only"
                  />
                  {tRoutes(`${value}.name`)}
                </label>
              ))}
            </div>
            {error === "invalidRoute" ? (
              <p
                id="waitlist-route-error"
                className="mt-1.5 text-xs text-red-600"
              >
                {t("errors.route")}
              </p>
            ) : null}
          </fieldset>

          {error === "generic" ? (
            <p role="alert" className="text-xs text-red-600">
              {t("errors.generic")}
            </p>
          ) : null}

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="mt-1 w-full"
            disabled={pending}
          >
            {pending ? t("submitting") : t("submit")}
          </Button>

          <p className="text-center text-[11px] leading-relaxed text-slate/70">
            {t("privacy")}
          </p>
        </form>
      )}
    </div>
  );
}

/** A "Join the waitlist" button that opens the dialog instead of navigating. */
export function WaitlistButton({
  route,
  children,
  ...buttonProps
}: {
  route?: WaitlistRoute;
  children: ReactNode;
  variant?: "primary" | "accent";
  size?: "md" | "lg";
  className?: string;
  onClick?: () => void;
}) {
  const open = useWaitlist();
  return (
    <Button
      type="button"
      aria-haspopup="dialog"
      {...buttonProps}
      onClick={() => {
        buttonProps.onClick?.();
        open(route);
      }}
    >
      {children}
    </Button>
  );
}
