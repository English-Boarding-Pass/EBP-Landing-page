import { clsx } from "clsx";

/**
 * The torn-stub divider between a boarding pass's info side and stub side.
 * Notch color must match whatever sits immediately behind the card
 * (`notchClassName`) so the punch-hole illusion reads correctly.
 */
export function Perforation({
  orientation,
  notchClassName = "bg-ivory",
  className,
}: {
  orientation: "vertical" | "horizontal";
  notchClassName?: string;
  className?: string;
}) {
  if (orientation === "vertical") {
    return (
      <div
        aria-hidden
        className={clsx(
          "relative hidden shrink-0 self-stretch border-l-2 border-dashed border-navy/20 sm:block",
          className,
        )}
      >
        <span
          className={clsx(
            "absolute -top-3 -left-3 size-6 rounded-full",
            notchClassName,
          )}
        />
        <span
          className={clsx(
            "absolute -bottom-3 -left-3 size-6 rounded-full",
            notchClassName,
          )}
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden
      className={clsx(
        "relative w-full border-t-2 border-dashed border-navy/20 sm:hidden",
        className,
      )}
    >
      <span
        className={clsx(
          "absolute -top-3 -left-3 size-6 rounded-full",
          notchClassName,
        )}
      />
      <span
        className={clsx(
          "absolute -top-3 -right-3 size-6 rounded-full",
          notchClassName,
        )}
      />
    </div>
  );
}
