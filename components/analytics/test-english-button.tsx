"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cambridgeTestUrl } from "@/lib/links";
import { trackEvent } from "@/lib/analytics";

/** Link to the free Cambridge English test that reports each click. */
export function TestEnglishButton({
  source,
  children,
  ...buttonProps
}: {
  source: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  size?: "md" | "lg";
  "aria-label"?: string;
}) {
  return (
    <Button
      href={cambridgeTestUrl}
      {...buttonProps}
      onClick={() => trackEvent({ name: "test_english_click", source })}
    >
      {children}
    </Button>
  );
}
