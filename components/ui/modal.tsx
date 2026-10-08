"use client";

import {
  useEffect,
  useId,
  useRef,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import { Xmark } from "iconoir-react";

const maxWidths = { md: "28rem", lg: "36rem", "2xl": "42rem" } as const;

/**
 * The one dialog the site uses for popups (teacher profiles, privacy notice).
 * Built on the native <dialog>, so focus is trapped, the page behind is inert
 * and Escape closes it without extra code. Centered on desktop, a bottom sheet
 * below 640px. Look and motion live in the `.modal` rules in globals.css.
 *
 * The parent owns the open state. Pass the opening button as `returnFocusRef`
 * so focus goes back to it on close (Safari does not focus buttons on click,
 * so the browser's own focus restore is not enough).
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  closeLabel,
  size = "md",
  returnFocusRef,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  closeLabel: string;
  size?: keyof typeof maxWidths;
  returnFocusRef?: RefObject<HTMLElement | null>;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  // Keep the native dialog in step with the parent's state.
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-modal="true"
      // Light dismiss where the browser supports it; the click handler below
      // covers the rest (Safari).
      {...{ closedby: "any" }}
      className="modal"
      style={{ "--modal-max": maxWidths[size] } as CSSProperties}
      onClose={() => {
        onClose();
        returnFocusRef?.current?.focus();
      }}
      onClick={(event) => {
        const dialog = event.currentTarget;
        // A click on the backdrop reports the dialog itself as the target.
        if (event.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();
        const inside =
          rect.top <= event.clientY &&
          event.clientY <= rect.bottom &&
          rect.left <= event.clientX &&
          event.clientX <= rect.right;
        if (!inside) dialog.close();
      }}
    >
      <div className="flex items-start justify-between gap-4 border-b border-navy/10 py-4 pr-3 pl-6">
        <div className="min-w-0 pt-1.5">
          <h2
            id={titleId}
            className="font-display text-xl font-extrabold text-navy"
          >
            {title}
          </h2>
          {description ? (
            <p className="mt-1 text-sm text-slate">{description}</p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => ref.current?.close()}
          aria-label={closeLabel}
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-full text-slate hover:bg-ice hover:text-navy focus-visible:ring-2 focus-visible:ring-navy focus-visible:outline-none"
        >
          <Xmark className="size-5" aria-hidden />
        </button>
      </div>
      <div className="overflow-y-auto overscroll-contain px-6 py-6">
        {children}
      </div>
    </dialog>
  );
}
