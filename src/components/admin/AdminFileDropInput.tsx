"use client";

import { FileImage, FileVideo, UploadCloud } from "lucide-react";
import { useId, useRef, useState } from "react";

type AdminFileDropInputProps = {
  name: string;
  accept: string;
  label: string;
  helperText?: string;
};

export default function AdminFileDropInput({ name, accept, label, helperText }: AdminFileDropInputProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const isVideo = accept.includes("video");

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          const files = event.dataTransfer.files;
          if (!files.length || !inputRef.current) return;
          inputRef.current.files = files;
          setFileName(files[0]?.name ?? "");
        }}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer rounded-xl border border-dashed px-4 py-5 transition ${
          dragging
            ? "border-indigo-400 bg-indigo-50 dark:border-indigo-400/50 dark:bg-indigo-900/20"
            : "border-gray-300 bg-gray-50/70 hover:border-indigo-300 hover:bg-indigo-50/60 dark:border-gray-700 dark:bg-gray-950/50 dark:hover:border-indigo-400/30 dark:hover:bg-indigo-900/10"
        }`}
      >
        <input
          id={id}
          ref={inputRef}
          name={name}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "")}
        />
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-gray-200 bg-white p-3 text-indigo-500 dark:border-gray-700 dark:bg-gray-900">
            {isVideo ? <FileVideo size={18} /> : <FileImage size={18} />}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-gray-900 dark:text-white">
              {fileName || `Drop ${isVideo ? "video" : "image"} here or click to upload`}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {helperText ?? "Drag and drop works here."}
            </p>
          </div>
          <UploadCloud size={18} className="ml-auto shrink-0 text-gray-400" />
        </div>
      </div>
    </div>
  );
}
