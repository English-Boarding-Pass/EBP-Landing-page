"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { clsx } from "clsx";
import { useTranslations } from "next-intl";
import {
  Mail,
  Lock,
  User,
  Whatsapp,
  Eye,
  EyeClosed,
  CheckCircle,
} from "iconoir-react";
import { Button } from "@/components/ui/button";

type Tab = "login" | "signup";

const inputClasses =
  "w-full rounded-xl border border-navy/15 bg-white py-2.5 pl-10 pr-4 text-sm text-navy " +
  "placeholder:text-slate/40 focus:border-sky-ink focus:outline-none focus:ring-2 focus:ring-sky-ink/25";

function Field({
  id,
  label,
  icon,
  type = "text",
  autoComplete,
  children,
}: {
  id: string;
  label: string;
  icon: ReactNode;
  type?: string;
  autoComplete?: string;
  children?: ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs font-semibold text-slate"
      >
        {label}
      </label>
      <div className="relative">
        <span
          aria-hidden
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate/50"
        >
          {icon}
        </span>
        <input
          id={id}
          name={id}
          type={type}
          required
          autoComplete={autoComplete}
          className={inputClasses}
        />
        {children}
      </div>
    </div>
  );
}

/**
 * Phase 1 has no auth backend yet (Supabase Auth is scoped for Phase 2 per
 * the project proposal). This form is a real, validated UI — not a dead
 * mockup — but submitting it can't create an account yet, so it ends in an
 * honest "not live yet, we'll notify you" state rather than pretending to
 * sign the student in.
 */
export function AuthForm() {
  const t = useTranslations("checkIn.auth");
  const [tab, setTab] = useState<Tab>("signup");
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 px-8 py-10 text-center">
        <CheckCircle className="size-10 text-sky-ink" aria-hidden />
        <h2 className="font-display text-xl font-bold text-navy">
          {t("successTitle")}
        </h2>
        <p className="text-sm leading-relaxed text-slate">
          {t("successBody")}
        </p>
      </div>
    );
  }

  return (
    <div className="px-6 pb-8 pt-2 sm:px-8">
      <div
        role="tablist"
        aria-label={`${t("loginTab")} / ${t("signupTab")}`}
        className="mb-6 flex w-full rounded-full border border-navy/10 bg-ice p-1"
      >
        {(["signup", "login"] as const).map((value) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={tab === value}
            onClick={() => setTab(value)}
            className={clsx(
              "flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              tab === value
                ? "bg-navy text-white"
                : "text-slate hover:text-navy",
            )}
          >
            {value === "signup" ? t("signupTab") : t("loginTab")}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {tab === "signup" ? (
          <Field
            id="name"
            label={t("nameLabel")}
            icon={<User className="size-4" />}
            autoComplete="name"
          />
        ) : null}

        <Field
          id="email"
          label={t("emailLabel")}
          icon={<Mail className="size-4" />}
          type="email"
          autoComplete="email"
        />

        {tab === "signup" ? (
          <Field
            id="whatsapp"
            label={t("whatsappLabel")}
            icon={<Whatsapp className="size-4" />}
            type="tel"
            autoComplete="tel"
          />
        ) : null}

        <Field
          id="password"
          label={t("passwordLabel")}
          icon={<Lock className="size-4" />}
          type={showPassword ? "text" : "password"}
          autoComplete={tab === "signup" ? "new-password" : "current-password"}
        >
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate/50 hover:text-navy"
          >
            {showPassword ? (
              <EyeClosed className="size-4" aria-hidden />
            ) : (
              <Eye className="size-4" aria-hidden />
            )}
          </button>
        </Field>

        <Button type="submit" variant="primary" size="md" className="mt-1 w-full">
          {tab === "login" ? t("loginSubmit") : t("signupSubmit")}
        </Button>
      </form>

      <button
        type="button"
        onClick={() => setTab(tab === "login" ? "signup" : "login")}
        className="mt-4 block w-full text-center text-xs font-medium text-sky-ink hover:underline"
      >
        {tab === "login" ? t("needAccount") : t("haveAccount")}
      </button>
    </div>
  );
}
