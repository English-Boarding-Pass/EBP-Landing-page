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
import { Mail, User, CheckCircle, Xmark } from "iconoir-react";
import { Button } from "@/components/ui/button";
import {
  Field,
  Honeypot,
  PhoneField,
  TextAreaField,
} from "@/components/ui/form-field";
import { sendContact, type ContactState } from "@/lib/enquiry";

const ContactContext = createContext<(() => void) | null>(null);

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

  const open = useCallback(() => {
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
        className="m-auto w-[calc(100%-2rem)] max-w-md overflow-visible bg-transparent p-0 backdrop:bg-navy/70 backdrop:backdrop-blur-sm"
      >
        <ContactPanel key={formKey} onClose={close} />
      </dialog>
    </ContactContext.Provider>
  );
}

function ContactPanel({ onClose }: { onClose: () => void }) {
  const t = useTranslations("contact");
  const locale = useLocale();
  const [state, action, pending] = useActionState<ContactState, FormData>(
    sendContact,
    { status: "idle" },
  );

  const formRef = useRef<HTMLFormElement>(null);

  const values = state.status === "error" ? state.values : undefined;
  const error = state.status === "error" ? state.error : undefined;

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

      {state.status === "success" ? (
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
          className="flex flex-col gap-4 px-6 pt-8 pb-6 sm:px-8"
        >
          <div className="pr-8">
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
  ...buttonProps
}: {
  children: ReactNode;
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
        open();
      }}
    >
      {children}
    </Button>
  );
}
