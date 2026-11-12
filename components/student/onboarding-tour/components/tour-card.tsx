import React from "react";
import Image from "next/image";
import { CardPosition, TourStepConfig } from "../types";

interface TourCardProps {
  cardRef: React.RefObject<HTMLDivElement | null>;
  cardPos: CardPosition;
  prefersReducedMotion: boolean;
  currentTourStep: TourStepConfig;
  validStepIndex: number;
  totalSteps: number;
  isLastStep: boolean;
  progressPercent: number;
  activeSteps: TourStepConfig[];
  onMarkDone: () => void;
  onNext: () => void;
  onPrev: () => void;
  onTryNow: (url: string) => void;
  onStepSelect: (index: number) => void;
}

export function TourCard({
  cardRef,
  cardPos,
  prefersReducedMotion,
  currentTourStep,
  validStepIndex,
  totalSteps,
  isLastStep,
  progressPercent,
  activeSteps,
  onMarkDone,
  onNext,
  onPrev,
  onTryNow,
  onStepSelect,
}: TourCardProps) {
  return (
    <div
      ref={cardRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-step-title"
      className="fixed z-50 bg-white/95 backdrop-blur-2xl rounded-2xl border border-white/90 shadow-[0_20px_50px_rgba(0,87,200,0.22)] p-4 sm:p-5 overflow-visible select-none animate-scale-in"
      style={{
        width: `${Math.min(320, typeof window !== "undefined" ? window.innerWidth - 32 : 320)}px`,
        left: `${cardPos.left}px`,
        top: `${cardPos.top}px`,
        transition: prefersReducedMotion
          ? "none"
          : "top 250ms cubic-bezier(0.4, 0, 0.2, 1), left 250ms cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {!cardPos.isMobile && cardPos.arrowPlacement === "right" && (
        <div
          className="absolute -right-2 w-3.5 h-3.5 bg-white border-t border-r border-[#D7EAF7] pointer-events-none"
          style={{
            top: `${cardPos.arrowTop}px`,
            transform: "translateY(-50%) rotate(45deg)",
          }}
          aria-hidden="true"
        />
      )}
      {!cardPos.isMobile && cardPos.arrowPlacement === "left" && (
        <div
          className="absolute -left-2 w-3.5 h-3.5 bg-white border-b border-l border-[#D7EAF7] pointer-events-none"
          style={{
            top: `${cardPos.arrowTop}px`,
            transform: "translateY(-50%) rotate(45deg)",
          }}
          aria-hidden="true"
        />
      )}

      <div className="absolute -top-10 -end-10 w-24 h-24 rounded-full bg-[#38BDF8]/15 blur-xl pointer-events-none" />

      <div className="absolute top-0 inset-x-0 h-1.5 rounded-t-2xl overflow-hidden bg-[#EAF4FD]">
        <div
          className="h-full bg-gradient-to-r from-[#0057C8] via-[#0EA5E9] to-[#38BDF8] transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="flex items-center justify-between pb-2.5 mt-1 border-b border-[#D7EAF7]/70">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0057C8] bg-[#EAF4FD] px-2 py-0.5 rounded-full border border-[#D7EAF7]">
            جولة تعريفية
          </span>

          <span className="text-xs font-bold text-[#66788A]" dir="ltr">
            {validStepIndex + 1} / {totalSteps}
          </span>
        </div>

        <button
          type="button"
          onClick={onMarkDone}
          className="text-xs font-semibold text-[#66788A] hover:text-[#0057C8] hover:bg-[#F0F7FD] px-2 py-0.5 rounded-lg transition-colors cursor-pointer"
        >
          تخطّي
        </button>
      </div>

      <div className="py-3 flex items-start gap-3">
        <div className="relative w-14 h-18 sm:w-16 sm:h-20 shrink-0 mascot-stationary-float drop-shadow-[0_4px_10px_rgba(0,87,200,0.18)]">
          <Image
            key={currentTourStep.id}
            src={currentTourStep.mascotSrc}
            alt={currentTourStep.mascotAlt}
            fill
            className="object-contain"
            priority
          />
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <h3
            id="onboarding-step-title"
            className="text-sm sm:text-base font-extrabold text-[#16324A] leading-snug"
          >
            {currentTourStep.title}
          </h3>
          <p className="text-xs text-[#4A6478] leading-relaxed line-clamp-2">
            {currentTourStep.description}
          </p>
        </div>
      </div>

      <div className="pt-2.5 border-t border-[#D7EAF7]/70 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 shrink-0" aria-label="نقاط الخطوات">
          {activeSteps.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onStepSelect(idx)}
              aria-label={`الانتقال للخطوة ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                idx === validStepIndex
                  ? "w-4 bg-[#0057C8]"
                  : "w-1.5 bg-[#D7EAF7] hover:bg-[#BAE6FD]"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          {validStepIndex > 0 && (
            <button
              type="button"
              onClick={onPrev}
              className="px-2.5 py-1 text-xs font-bold text-[#66788A] hover:text-[#16324A] hover:bg-[#F0F7FD] rounded-lg transition-colors border border-[#D7EAF7] cursor-pointer"
            >
              السابق
            </button>
          )}

          {currentTourStep.actionUrl && !isLastStep && (
            <button
              type="button"
              onClick={() => onTryNow(currentTourStep.actionUrl)}
              className="px-2.5 py-1 text-xs font-bold text-[#0057C8] hover:text-[#0284C7] bg-[#EAF4FD] hover:bg-[#D7EAF7] rounded-lg transition-colors border border-[#D7EAF7] cursor-pointer"
            >
              جرّبها الآن
            </button>
          )}

          <button
            type="button"
            onClick={onNext}
            className="px-3.5 py-1 text-xs font-extrabold text-white bg-[#0057C8] hover:bg-[#2D78B7] active:scale-95 rounded-lg transition-all shadow-[0_2px_6px_rgba(0,87,200,0.25)] cursor-pointer"
          >
            {isLastStep ? "ابدأ 🚀" : "التالي ←"}
          </button>
        </div>
      </div>

      <div className="mt-2 text-center text-[10px] text-[#8297A8]">
        استخدم ← → للتنقل • Esc للإغلاق
      </div>
    </div>
  );
}

