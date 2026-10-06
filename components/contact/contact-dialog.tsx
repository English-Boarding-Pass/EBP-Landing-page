"use client";

import {
  createContext,
  useActionState,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Mail,
  User,
  CheckCircle,
  NavArrowLeft,
  NavArrowRight,
  Xmark,
} from "iconoir-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  Field,
  Honeypot,
  PhoneField,
  TextAreaField,
} from "@/components/ui/form-field";
import { cambridgeTestUrl } from "@/lib/links";
import { trackEvent } from "@/lib/analytics";
import { sendContact, type ContactState } from "@/lib/enquiry";

type OpenOptions = {
  /** Skip the "who is this for" step and go straight to the individual form. */
  direct?: boolean;
};

const ContactContext = createContext<((options?: OpenOptions) => void) | null>(
  null,
);

export function useContact() {
  const open = useContext(ContactContext);
  if (!open) throw new Error("useContact must be used inside ContactProvider");
  return open;
}

/**
 * Owns the single "Get in touch" dialog for the site. Every contact button
 * calls `useContact()` to open it.
 */
export function ContactProvider({ children }: { children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  // Bumped on every open so each one starts with a fresh form.
  const [formKey, setFormKey] = useState(0);
  const [direct, setDirect] = useState(false);

  const open = useCallback((options?: OpenOptions) => {
    setDirect(Boolean(options?.direct));
    setFormKey((k) => k + 1);
    dialogRef.current?.showModal();
  }, []);

  const close = useCallback(() => dialogRef.current?.close(), []);

  return (
    <ContactContext.Provider value={open}>
      {children}
      <dialog
        ref={dialogRef}
        aria-labelledby="contact-title"
        // Click on the backdrop (the dialog element itself, outside the panel) closes it.
        onClick={(e) => e.target === e.currentTarget && close()}
        className="m-auto w-[calc(100%-2rem)] max-w-md overflow-visible bg-transparent p-0 backdrop:bg-navy/70"
      >
        <ContactPanel key={formKey} onClose={close} startAtForm={direct} />
      </dialog>
    </ContactContext.Provider>
  );
}

const choiceClasses =
  "block w-full rounded-card border border-navy/15 bg-paper p-5 text-left transition-colors hover:border-navy/40 hover:bg-ice focus-visible:ring-2 focus-visible:ring-navy focus-visible:outline-none";

function ContactPanel({
  onClose,
  startAtForm,
}: {
  onClose: () => void;
  startAtForm: boolean;
}) {
  const t = useTranslations("contact");
  // "choose" asks whether this is for a person or a company; "form" is the individual form.
  const [step, setStep] = useState<"choose" | "form">(
    startAtForm ? "form" : "choose",
  );
  const locale = useLocale();
  const [state, action, pending] = useActionState<ContactState, FormData>(
    sendContact,
    { status: "idle" },
  );

  const formRef = useRef<HTMLFormElement>(null);
  // The mark is read on submit only to record whether one was given; its value is never sent anywhere.
  const hadMarkRef = useRef(false);

  const values = state.status === "error" ? state.values : undefined;
  const error = state.status === "error" ? state.error : undefined;

  useEffect(() => {
    if (state.status === "success") {
      trackEvent({
        name: "contact_submitted",
        hasTestMark: hadMarkRef.current,
      });
    }
  }, [state.status]);

  // After a failed submit, jump to the field that needs fixing.
  useEffect(() => {
    if (state.status === "error") {
      formRef.current
        ?.querySelector<HTMLElement>('[aria-invalid="true"]')
        ?.focus();
    }
  }, [state]);

  return (
    <div className="relative max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-card bg-paper shadow-float">
      <button
        type="button"
        onClick={onClose}
        aria-label={t("close")}
        className="absolute top-2 right-2 inline-flex size-11 items-center justify-center rounded-full text-slate/60 hover:bg-ice hover:text-navy"
      >
        <Xmark className="size-5" aria-hidden />
      </button>

      {step === "choose" ? (
        <div className="flex flex-col gap-4 px-6 pt-8 pb-6 sm:px-8">
          <div className="pr-8">
            <h2
              id="contact-title"
              className="font-display text-2xl font-extrabold text-navy"
            >
              {t("title")}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate">
              {t("choose.subtitle")}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              trackEvent({ name: "contact_choice", audience: "individual" });
              setStep("form");
            }}
            className={choiceClasses}
          >
            <span className="font-display text-base font-bold text-navy">
              {t("choose.individual.title")}
            </span>
            <span className="mt-1 block text-sm text-slate">
              {t("choose.individual.description")}
            </span>
          </button>
          <Link
            href="/corporates#enquiry"
            onClick={() => {
              trackEvent({ name: "contact_choice", audience: "corporate" });
              onClose();
            }}
            className={choiceClasses}
          >
            <span className="flex items-center justify-between gap-3 font-display text-base font-bold text-navy">
              {t("choose.corporate.title")}
              <NavArrowRight className="size-4 shrink-0" aria-hidden />
            </span>
            <span className="mt-1 block text-sm text-slate">
              {t("choose.corporate.description")}
            </span>
          </Link>
        </div>
      ) : state.status === "success" ? (
        <div
          role="status"
          className="flex flex-col items-center gap-3 px-8 py-12 text-center"
        >
          <CheckCircle className="size-10 text-sky-ink" aria-hidden />
          <h2
            id="contact-title"
            className="font-display text-xl font-bold text-navy"
          >
            {t("successTitle")}
          </h2>
          <p className="text-sm leading-relaxed text-slate">
            {t("successBody")}
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
          ref={formRef}
          action={action}
          onSubmit={(e) => {
            const mark = new FormData(e.currentTarget).get("testMark");
            hadMarkRef.current = typeof mark === "string" && mark.trim() !== "";
          }}
          className="flex flex-col gap-4 px-6 pt-8 pb-6 sm:px-8"
        >
          <div className="pr-8">
            {!startAtForm ? (
              <button
                type="button"
                onClick={() => setStep("choose")}
                className="mb-2 inline-flex min-h-11 items-center gap-1 rounded text-sm font-medium text-sky-ink hover:text-navy focus-visible:ring-2 focus-visible:ring-navy focus-visible:outline-none"
              >
                <NavArrowLeft className="size-4" aria-hidden />
                {t("choose.back")}
              </button>
            ) : null}
            <h2
              id="contact-title"
              className="font-display text-2xl font-extrabold text-navy"
            >
              {t("title")}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate">
              {t("subtitle")}
            </p>
          </div>

          <input type="hidden" name="locale" value={locale} />
          <Honeypot />

          <Field
            form="contact"
            id="name"
            label={t("nameLabel")}
            icon={<User className="size-4" />}
            autoComplete="name"
            defaultValue={values?.name}
            error={error === "invalidName" ? t("errors.name") : undefined}
          />

          <Field
            form="contact"
            id="email"
            label={t("emailLabel")}
            icon={<Mail className="size-4" />}
            type="email"
            inputMode="email"
            autoComplete="email"
            invalidMessage={t("errors.email")}
            defaultValue={values?.email}
            error={error === "invalidEmail" ? t("errors.email") : undefined}
          />

          <PhoneField
            form="contact"
            id="phone"
            label={t("phoneLabel")}
            hint={t("phoneHint")}
            countryLabel={t("countryCodeLabel")}
            invalidMessage={t("errors.phone")}
            defaultValue={values?.phone}
            error={error === "invalidPhone" ? t("errors.phone") : undefined}
          />

          <Field
            form="contact"
            id="testMark"
            label={t("testMarkLabel")}
            type="number"
            inputMode="numeric"
            min={0}
            max={25}
            required={false}
            optionalLabel={t("optional")}
            hint={
              <>
                {t("testMarkHint")}{" "}
                <a
                  href={cambridgeTestUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent({
                      name: "test_english_click",
                      source: "contact_form",
                    })
                  }
                  className="font-medium text-sky-ink underline underline-offset-2 hover:text-navy"
                >
                  {t("testLink")}
                </a>
              </>
            }
            defaultValue={values?.testMark}
            error={error === "invalidMark" ? t("errors.testMark") : undefined}
          />

          <TextAreaField
            form="contact"
            id="message"
            label={t("messageLabel")}
            required={false}
            optionalLabel={t("optional")}
            rows={2}
            defaultValue={values?.message}
          />

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

/** A button that opens the contact dialog instead of navigating. */
export function ContactButton({
  children,
  source,
  direct,
  ...buttonProps
}: {
  children: ReactNode;
  /** Where on the site the button sits, for analytics. */
  source: string;
  /** For buttons that are already about individuals: skip the "who is this for" step. */
  direct?: boolean;
  variant?: "primary" | "accent";
  size?: "md" | "lg";
  className?: string;
  onClick?: () => void;
}) {
  const open = useContact();
  return (
    <Button
      type="button"
      aria-haspopup="dialog"
      {...buttonProps}
      onClick={() => {
        buttonProps.onClick?.();
        trackEvent({ name: "get_in_touch_click", source });
        open({ direct });
      }}
    >
      {children}
    </Button>
  );
}
