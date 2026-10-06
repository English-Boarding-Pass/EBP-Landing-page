"use client";

import type { ReactNode } from "react";
import { clsx } from "clsx";
import { Button } from "@/components/ui/button";
import { cambridgeTestUrl } from "@/lib/links";
import { trackEvent } from "@/lib/analytics";

/** Link to the free Cambridge English test that reports each click. */
export function TestEnglishButton({
  source,
  children,
  className,
  ...buttonProps
}: {
  source: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  size?: "md" | "lg";
  className?: string;
  "aria-label"?: string;
}) {
  return (
    <Button
      href={cambridgeTestUrl}
      {...buttonProps}
      className={clsx("max-w-full whitespace-normal", className)}
      onClick={() => trackEvent({ name: "test_english_click", source })}
    >
      {children}
    </Button>
  );
}
