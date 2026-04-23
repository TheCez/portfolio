"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import type { AdminActionState } from "@/app/admin/action-state";
import { initialAdminActionState } from "@/app/admin/action-state";

const MAX_SERVER_ACTION_UPLOAD_BYTES = 256 * 1024 * 1024;

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
  const handledStateRef = useRef<AdminActionState | null>(null);
  const [clientError, setClientError] = useState("");
  const [state, formAction] = useActionState(action, initialAdminActionState);

  useEffect(() => {
    if (!state.ok || !formRef.current) return;
    if (handledStateRef.current === state) return;

    handledStateRef.current = state;

    setClientError("");

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
    <form
      ref={formRef}
      action={formAction}
      className={className}
      onSubmit={(event) => {
        const form = formRef.current;
        if (!form) return;

        const fileInputs = Array.from(form.querySelectorAll('input[type="file"]'));
        const totalBytes = fileInputs.reduce((sum, input) => sum + (input.files?.[0]?.size ?? 0), 0);

        if (totalBytes > MAX_SERVER_ACTION_UPLOAD_BYTES) {
          event.preventDefault();
          setClientError("Selected upload is too large for the current form limit. Please use a smaller file or switch to an external link for very large media.");
          return;
        }

        setClientError("");
      }}
    >
      {children}
      {clientError ? <p className="text-sm text-rose-400">{clientError}</p> : null}
      {state.message ? (
        <p className={`text-sm ${state.ok ? "text-emerald-400" : "text-rose-400"}`}>{state.message}</p>
      ) : null}
    </form>
  );
}
