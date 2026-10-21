"use client";

import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils/utils";

type PasswordInputProps = Omit<React.ComponentProps<typeof Input>, "type"> & {
  type?: "password";
};

export function PasswordInput({ className, type = "password", ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  return (
    <span className="relative block">
      <Input {...props} type={visible ? "text" : type} className={cn("pr-11", className)} />
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        aria-label={visible ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখান"}
        aria-pressed={visible}
        className="absolute inset-y-0 right-0 flex w-10 items-center justify-center rounded-r-lg text-muted-foreground transition-colors hover:text-foreground focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-ring"
      >
        {visible ? (
          <EyeOffIcon className="size-4" aria-hidden="true" />
        ) : (
          <EyeIcon className="size-4" aria-hidden="true" />
        )}
      </button>
    </span>
  );
}
