"use client";

import { useActionState, useEffect, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CheckCircle } from "iconoir-react";
import { Button } from "@/components/ui/button";
import {
  Field,
  Honeypot,
  PhoneField,
  SelectField,
  TextAreaField,
} from "@/components/ui/form-field";
import { trackEvent } from "@/lib/analytics";
import { sendCorporateEnquiry, type CorporateState } from "@/lib/enquiry";

const LEVELS = [
  "unsure",
  "beginner",
  "intermediate",
  "advanced",
  "mixed",
] as const;

/**
 * The corporate page's own form. Contact details are required; everything
 * about the team is optional, there to help us prepare for the first call.
 */
export function EnquiryForm() {
  const t = useTranslations("corporates.form");
  // Labels and errors shared with the "Get in touch" popup.
  const tContact = useTranslations("contact");
  const locale = useLocale();
  const [state, action, pending] = useActionState<CorporateState, FormData>(
    sendCorporateEnquiry,
    { status: "idle" },
  );
  const formRef = useRef<HTMLFormElement>(null);

  // After a failed submit, jump to the field that needs fixing.
  useEffect(() => {
    if (state.status === "error") {
      formRef.current
        ?.querySelector<HTMLElement>('[aria-invalid="true"]')
        ?.focus();
    }
  }, [state]);

  useEffect(() => {
    if (state.status === "success") {
      trackEvent({ name: "corporate_enquiry_submitted" });
    }
  }, [state.status]);

  if (state.status === "success") {
    return (
      <div
        role="status"
        className="flex flex-col items-center gap-3 rounded-card border border-navy/10 bg-ivory px-8 py-14 text-center"
      >
        <CheckCircle className="size-10 text-sky-ink" aria-hidden />
        <h3 className="font-display text-xl font-bold text-navy">
          {t("successTitle")}
        </h3>
        <p className="max-w-sm text-sm leading-relaxed text-slate">
          {t("successBody")}
        </p>
      </div>
    );
  }

  const values = state.status === "error" ? state.values : undefined;
  const error = state.status === "error" ? state.error : undefined;
  const optional = tContact("optional");

  return (
    <form
      ref={formRef}
      action={action}
      className="relative flex flex-col gap-4 rounded-card border border-navy/10 bg-ivory p-6 sm:p-8"
    >
      <input type="hidden" name="locale" value={locale} />
      <Honeypot />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          form="corporate"
          id="name"
          label={tContact("nameLabel")}
          autoComplete="name"
          defaultValue={values?.name}
          error={error === "invalidName" ? tContact("errors.name") : undefined}
        />
        <Field
          form="corporate"
          id="company"
          label={t("companyLabel")}
          autoComplete="organization"
          defaultValue={values?.company}
          error={error === "invalidCompany" ? t("errors.company") : undefined}
        />
        <Field
          form="corporate"
          id="email"
          label={tContact("emailLabel")}
          type="email"
          inputMode="email"
          autoComplete="email"
          invalidMessage={tContact("errors.email")}
          defaultValue={values?.email}
          error={
            error === "invalidEmail" ? tContact("errors.email") : undefined
          }
        />
        <PhoneField
          form="corporate"
          id="phone"
          label={tContact("phoneLabel")}
          countryLabel={tContact("countryCodeLabel")}
          invalidMessage={tContact("errors.phone")}
          defaultValue={values?.phone}
          error={
            error === "invalidPhone" ? tContact("errors.phone") : undefined
          }
        />
      </div>

      <div className="grid gap-4 border-t border-navy/10 pt-5 sm:grid-cols-2">
        <Field
          form="corporate"
          id="learners"
          label={t("learnersLabel")}
          type="number"
          inputMode="numeric"
          min={1}
          required={false}
          optionalLabel={optional}
          defaultValue={values?.learners}
        />
        <SelectField
          form="corporate"
          id="level"
          label={t("levelLabel")}
          required={false}
          optionalLabel={optional}
          defaultValue={values?.level}
          options={LEVELS.map((level) => ({
            value: level,
            label: t(`levels.${level}`),
          }))}
        />
      </div>

      <Field
        form="corporate"
        id="role"
        label={t("roleLabel")}
        hint={t("roleHint")}
        required={false}
        optionalLabel={optional}
        defaultValue={values?.role}
      />

      <TextAreaField
        form="corporate"
        id="message"
        label={t("messageLabel")}
        required={false}
        optionalLabel={optional}
        defaultValue={values?.message}
      />

      {error === "generic" || error === "rateLimited" ? (
        <p role="alert" className="text-xs text-red-600">
          {tContact(`errors.${error}`)}
        </p>
      ) : null}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="mt-1 w-full sm:w-auto sm:self-start"
        disabled={pending}
      >
        {pending ? tContact("submitting") : t("submit")}
      </Button>

      <p className="text-[11px] leading-relaxed text-slate/70">
        {tContact("privacy")}
      </p>
    </form>
  );
}
