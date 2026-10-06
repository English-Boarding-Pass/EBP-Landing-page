import { clsx } from "clsx";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import { Link } from "@/i18n/navigation";

type Variant =
  "primary" | "accent" | "secondary" | "ghost" | "outline-inverted";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-body font-medium " +
  "transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 " +
  "focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  // Light-background contexts.
  primary:
    "bg-navy text-white hover:bg-slate focus-visible:ring-navy focus-visible:ring-offset-ivory",
  // Dark-background contexts (hero, footer): sky fill reads clearly on navy.
  accent:
    "bg-sky text-navy hover:bg-white focus-visible:ring-sky focus-visible:ring-offset-navy",
  secondary:
    "border border-navy/15 bg-paper text-navy hover:border-navy/30 hover:bg-ice " +
    "focus-visible:ring-navy focus-visible:ring-offset-ivory",
  ghost:
    "text-navy hover:bg-navy/5 focus-visible:ring-navy focus-visible:ring-offset-ivory",
  // Dark-background contexts where a filled button would be too heavy
  // (paired next to an accent CTA, e.g. the hero's secondary action).
  "outline-inverted":
    "border border-sky text-ivory hover:bg-white/10 focus-visible:ring-sky focus-visible:ring-offset-navy",
};

const sizes: Record<Size, string> = {
  md: "min-h-11 px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type ButtonAsLink = CommonProps & {
  href: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className">;

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {
    href?: undefined;
  };

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: ButtonAsLink | ButtonAsButton) {
  const classes = clsx(base, variants[variant], sizes[size], className);

  if ("href" in rest && rest.href) {
    const { href, ...anchorRest } = rest;
    // Full URLs (WhatsApp, mailto) leave the site: a plain anchor, no locale prefix.
    if (/^(https?:|mailto:)/.test(href)) {
      return (
        <a
          href={href}
          className={classes}
          {...(href.startsWith("http")
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
          {...anchorRest}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...anchorRest}>
        {children}
      </Link>
    );
  }

  return (
    <button
      className={classes}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
}
