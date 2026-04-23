"use client";

import { useEffect, useId, useRef, useState } from "react";
import MarkdownContent from "@/components/MarkdownContent";

type ProjectMarkdownEditorProps = {
  name: string;
  label: string;
  defaultValue?: string | null;
  placeholder?: string;
  rows?: number;
  required?: boolean;
};

export default function ProjectMarkdownEditor({
  name,
  label,
  defaultValue = "",
  placeholder,
  rows = 8,
  required = true,
}: ProjectMarkdownEditorProps) {
  const id = useId();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [value, setValue] = useState(defaultValue ?? "");

  useEffect(() => {
    const textarea = textareaRef.current;
    const form = textarea?.form;

    if (!form) return;

    const handleReset = () => setValue(defaultValue ?? "");
    form.addEventListener("reset", handleReset);
    return () => form.removeEventListener("reset", handleReset);
  }, [defaultValue]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Supports headings, bullets, **bold**, `code`, and [links](https://...).
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <textarea
          id={id}
          ref={textareaRef}
          name={name}
          rows={rows}
          required={required}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
          className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 font-mono text-sm leading-7 dark:border-gray-700 dark:text-white"
        />

        <div className="min-h-48 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950/60">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
            Preview
          </p>
          {value.trim() ? (
            <MarkdownContent value={value} />
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">Start typing to preview the project detail formatting.</p>
          )}
        </div>
      </div>
    </div>
  );
}
