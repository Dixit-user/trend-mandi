import * as React from "react";

import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "focus-ring min-h-40 w-full resize-y rounded-md border border-line bg-white px-3 py-3 text-sm text-ink placeholder:text-muted",
        className
      )}
      {...props}
    />
  )
);

Textarea.displayName = "Textarea";
