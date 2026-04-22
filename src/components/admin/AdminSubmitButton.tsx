"use client";

import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

type AdminSubmitButtonProps = {
  idleLabel: string;
  pendingLabel?: string;
  className?: string;
};

export default function AdminSubmitButton({
  idleLabel,
  pendingLabel,
  className,
}: AdminSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={className}
    >
      {pending ? (
        <span className="inline-flex items-center gap-2">
          <Loader2 size={16} className="animate-spin" />
          {pendingLabel ?? "Saving..."}
        </span>
      ) : (
        idleLabel
      )}
    </button>
  );
}
