"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

type ImageLightboxProps = {
  imageUrl: string;
  title: string;
  onClose: () => void;
};

export default function ImageLightbox({ imageUrl, title, onClose }: ImageLightboxProps) {
  useEffect(() => {
    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    return () => {
      body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-black/80 px-3 pb-4 pt-24 backdrop-blur-md sm:items-center sm:px-4 sm:py-4">
      <div className="surface-outline glass-panel relative w-full max-w-5xl overflow-hidden rounded-[1.6rem] sm:max-h-[90vh] sm:overflow-y-auto sm:rounded-[2rem]">
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

        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 hidden h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10 sm:inline-flex"
          aria-label={`Close ${title}`}
        >
          <X size={18} />
        </button>

        <div className="p-4 sm:p-5 md:p-7">
          <div className="mb-5 pr-0 sm:pr-12">
            <p className="section-kicker">Attached Media</p>
            <h3 className="mt-4 text-2xl font-semibold text-white md:text-3xl">{title}</h3>
          </div>

          <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#040814]">
            <img src={imageUrl} alt={title} className="max-h-[72vh] w-full object-contain" />
          </div>
        </div>
      </div>
    </div>
  );
}
