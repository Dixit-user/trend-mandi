import * as React from "react";

import { cn } from "@/lib/utils";

type BadgeTone = "neutral" | "fresh" | "peaking" | "overused" | "teal" | "saffron";

const tones: Record<BadgeTone, string> = {
  neutral: "bg-[#f5f0e9] text-ink",
  fresh: "bg-mint text-[#0f5f59]",
  peaking: "bg-[#fff0cf] text-[#8a5a00]",
  overused: "bg-[#ffe0dc] text-[#9e2f24]",
  teal: "bg-[#d9f4f1] text-[#0f5f59]",
  saffron: "bg-[#fff0cf] text-[#8a5a00]"
};

export function Badge({
  className,
  tone = "neutral",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return (
    <span
      className={cn(
        "inline-flex min-h-6 items-center rounded-md px-2.5 py-1 text-xs font-semibold",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}
