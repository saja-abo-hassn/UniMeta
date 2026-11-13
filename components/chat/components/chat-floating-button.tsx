import React from "react";
import Image from "next/image";

interface ChatFloatingButtonProps {
  buttonRef: React.RefObject<HTMLButtonElement | null>;
  isOpen: boolean;
  onToggle: () => void;
}

export function ChatFloatingButton({
  buttonRef,
  isOpen,
  onToggle,
}: ChatFloatingButtonProps) {
  return (
    <aside
      aria-label="المساعد الذكي UniMeta AI"
      className="fixed bottom-6 end-6 z-40 select-none"
    >
      <button
        ref={buttonRef}
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={isOpen ? "إغلاق نافذة UniMeta AI" : "فتح المساعد الذكي UniMeta AI"}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-white/95 backdrop-blur-md shadow-lg border border-brand-border-soft hover:border-brand-secondary hover:shadow-[0_0_24px_rgba(77,183,242,0.45)] hover:scale-110 hover:-rotate-6 active:scale-95 transition-all duration-300 focus-ring cursor-pointer mascot-btn-float"
      >
        {isOpen ? (
          <svg
            className="w-6 h-6 text-brand-primary transition-transform duration-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <div className="relative w-10 h-10 flex items-center justify-center">
            <Image
              src="/mascot/head.png"
              alt="UniMeta AI Mascot Head"
              fill
              className="object-contain drop-shadow-xs"
              sizes="40px"
            />
            <span className="absolute -top-0.5 -end-0.5 w-3 h-3 rounded-full bg-[#10B981] ring-2 ring-white animate-pulse" />
          </div>
        )}
      </button>
    </aside>
  );
}

