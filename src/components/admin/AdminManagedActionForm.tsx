"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import type { AdminActionState } from "@/app/admin/action-state";
import { initialAdminActionState } from "@/app/admin/action-state";

type AdminManagedActionFormProps = {
  action: (state: AdminActionState, formData: FormData) => Promise<AdminActionState>;
  children: ReactNode;
  className?: string;
  mediaFieldNames?: string[];
  refreshOnSuccess?: boolean;
  resetOnSuccess?: boolean;
};

export default function AdminManagedActionForm({
  action,
  children,
  className,
  mediaFieldNames = [],
  refreshOnSuccess = false,
  resetOnSuccess = false,
}: AdminManagedActionFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [state, formAction] = useActionState(action, initialAdminActionState);

  useEffect(() => {
    if (!state.ok || !formRef.current) return;

    if (state.media) {
      for (const fieldName of mediaFieldNames) {
        const input = formRef.current.elements.namedItem(fieldName);
        if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
          input.value = state.media[fieldName] ?? "";
        }
      }
    }

    if (resetOnSuccess) {
      formRef.current.reset();
      formRef.current.dispatchEvent(new Event("reset", { bubbles: true }));
    }

    if (refreshOnSuccess) {
      router.refresh();
    }
  }, [mediaFieldNames, refreshOnSuccess, resetOnSuccess, router, state]);

  return (
    <form ref={formRef} action={formAction} className={className}>
      {children}
      {state.message ? (
        <p className={`text-sm ${state.ok ? "text-emerald-400" : "text-rose-400"}`}>{state.message}</p>
      ) : null}
    </form>
  );
}
