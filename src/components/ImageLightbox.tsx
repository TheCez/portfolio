"use client";

import { X } from "lucide-react";

type ImageLightboxProps = {
  imageUrl: string;
  title: string;
  onClose: () => void;
};

export default function ImageLightbox({ imageUrl, title, onClose }: ImageLightboxProps) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 px-4 backdrop-blur-md">
      <div className="surface-outline glass-panel relative max-h-[90vh] w-full max-w-5xl rounded-[2rem] p-5 md:p-7">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
          aria-label={`Close ${title}`}
        >
          <X size={18} />
        </button>

        <div className="mb-5 pr-12">
          <p className="section-kicker">Attached Media</p>
          <h3 className="mt-4 text-2xl font-semibold text-white md:text-3xl">{title}</h3>
        </div>

        <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#040814]">
          <img src={imageUrl} alt={title} className="max-h-[72vh] w-full object-contain" />
        </div>
      </div>
    </div>
  );
}
