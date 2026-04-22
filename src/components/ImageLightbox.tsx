"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

type ImageLightboxProps = {
  mediaUrl: string;
  title: string;
  onClose: () => void;
};

function isPdfFile(url: string) {
  try {
    const parsed = new URL(url, "http://localhost");
    return parsed.pathname.toLowerCase().endsWith(".pdf");
  } catch {
    return url.toLowerCase().includes(".pdf");
  }
}

export default function ImageLightbox({ mediaUrl, title, onClose }: ImageLightboxProps) {
  const isPdf = isPdfFile(mediaUrl);

  useEffect(() => {
    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    return () => {
      body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-black/80 px-3 pb-4 pt-24 backdrop-blur-md sm:px-4 sm:pb-6 sm:pt-28">
      <div className="surface-outline glass-panel relative w-full max-w-4xl overflow-hidden rounded-[1.6rem] sm:max-h-[calc(100vh-8.5rem)] sm:rounded-[2rem]">
        <div className="sticky top-0 z-20 flex justify-end border-b border-white/10 bg-[#0c1526]/92 px-4 py-3 backdrop-blur-xl sm:hidden">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
            aria-label={`Close ${title}`}
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[calc(100vh-6.5rem)] overflow-y-auto p-4 sm:max-h-[calc(100vh-8.5rem)] sm:p-5 md:p-7">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-20 hidden h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10 sm:inline-flex"
            aria-label={`Close ${title}`}
          >
            <X size={18} />
          </button>

          <div className="mb-5 pr-0 sm:pr-16">
            <p className="section-kicker">Attached Media</p>
            <h3 className="mt-4 text-2xl font-semibold text-white md:text-3xl">{title}</h3>
          </div>

          <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#040814] p-2 sm:p-3">
            {isPdf ? (
              <iframe
                src={mediaUrl}
                title={title}
                className="h-[calc(100vh-15rem)] w-full rounded-[1rem] bg-white sm:h-[calc(100vh-17rem)]"
              />
            ) : (
              <img
                src={mediaUrl}
                alt={title}
                className="mx-auto max-h-[calc(100vh-15rem)] w-full rounded-[1rem] object-contain sm:max-h-[calc(100vh-17rem)]"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
