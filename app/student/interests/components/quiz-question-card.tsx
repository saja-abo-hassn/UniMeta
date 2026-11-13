import Image from "next/image";
import {
  QuizQuestion,
  TRAITS_CONFIG,
  TraitKey,
  ORIENTATION_QUESTIONS,
} from "@/src/data/major-orientation-config";
import { MASCOT_HINTS } from "../data/interests-constants";

interface QuizQuestionCardProps {
  currentIdx: number;
  currentQuestion: QuizQuestion;
  progressPercent: number;
  selectedTraitForCurrent?: TraitKey;
  hasRestoredProgress: boolean;
  onSelectOption: (trait: TraitKey) => void;
  onPrevious: () => void;
  onRestart: () => void;
}

export function QuizQuestionCard({
  currentIdx,
  currentQuestion,
  progressPercent,
  selectedTraitForCurrent,
  hasRestoredProgress,
  onSelectOption,
  onPrevious,
  onRestart,
}: QuizQuestionCardProps) {
  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white border border-brand-border-soft shadow-xs space-y-6 relative overflow-hidden">
      {hasRestoredProgress && (
        <div className="p-3 rounded-xl bg-brand-surface-blue border border-brand-border-soft text-brand-ink text-xs flex items-center justify-between gap-2 animate-fade-in">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-brand-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>تم استرجاع إجاباتك المحفوظة تلقائياً؛ يمكنك إكمال الاختبار من حيث توقفت.</span>
          </div>
          <button
            type="button"
            onClick={onRestart}
            className="font-bold text-brand-primary hover:underline shrink-0"
          >
            البدء من جديد
          </button>
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold">
          <div className="flex items-center gap-2 text-brand-ink">
            <span className="px-2.5 py-1 rounded-lg bg-brand-surface-blue text-brand-primary font-mono text-xs">
              {currentIdx + 1} / {ORIENTATION_QUESTIONS.length}
            </span>
            <span className="text-brand-muted">السؤال {currentIdx + 1} من 15</span>
          </div>
          <span className="font-mono text-brand-primary font-bold">{progressPercent}%</span>
        </div>

        <div className="w-full h-2.5 rounded-full bg-brand-surface-blue overflow-hidden p-0.5 border border-brand-border-soft">
          <div
            className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary transition-all duration-400 ease-out rounded-full shadow-xs"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#F4FAFF] to-[#EBF6FE] border border-brand-border-soft flex items-center gap-4">
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 mascot-stationary-float select-none">
          <Image
            src="/mascot/think.png"
            alt="UniMeta Thinking Mascot"
            fill
            className="object-contain drop-shadow-md"
            priority
          />
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-brand-primary">
            <span>مساعدك الذكي UniMeta</span>
            <span className="text-[10px] text-brand-muted font-normal">| توجيه أكاديمي</span>
          </div>
          <p className="text-xs sm:text-sm text-brand-ink leading-relaxed font-medium">
            {MASCOT_HINTS[currentIdx] || "اختر الإجابة الأقرب لشخصيتك الحقيقية."}
          </p>
        </div>
      </div>

      <div className="pt-1 space-y-2">
        <span className="text-[11px] font-bold text-brand-muted bg-[#F0F6FA] px-2.5 py-0.5 rounded-md border border-brand-border-soft inline-block">
          {currentQuestion.categoryHint}
        </span>
        <h2 className="text-lg sm:text-2xl font-extrabold text-brand-ink leading-snug">
          {currentQuestion.question}
        </h2>
      </div>

      <div className="space-y-3 pt-2">
        {currentQuestion.options.map((opt, i) => {
          const isSelected = selectedTraitForCurrent === opt.trait;
          const traitData = TRAITS_CONFIG[opt.trait];

          return (
            <button
              key={i}
              type="button"
              onClick={() => onSelectOption(opt.trait)}
              className={`w-full p-4 rounded-2xl border text-start text-xs sm:text-sm transition-all duration-200 group flex items-center justify-between gap-3 shadow-2xs cursor-pointer ${
                isSelected
                  ? "bg-brand-surface-blue border-brand-primary ring-2 ring-brand-primary/25 shadow-sm"
                  : "bg-white border-brand-border-soft hover:border-brand-secondary hover:bg-brand-surface-muted hover:shadow-sm"
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                <span
                  className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                    isSelected
                      ? "bg-brand-primary text-white"
                      : "bg-[#F0F6FA] text-brand-copy-muted group-hover:bg-brand-surface-blue group-hover:text-brand-primary"
                  }`}
                >
                  {String.fromCharCode(65 + i)}
                </span>

                <div className="flex flex-col gap-0.5">
                  <span className={`font-semibold leading-relaxed ${isSelected ? "text-brand-primary" : "text-brand-ink"}`}>
                    {opt.label}
                  </span>
                  <span className="text-[10px] text-brand-subtle font-normal">
                    سمة: {traitData.name} ({opt.trait})
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-base select-none">{traitData.icon}</span>
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-transform ${
                    isSelected
                      ? "bg-brand-primary text-white scale-110"
                      : "border border-brand-border-soft text-transparent group-hover:border-brand-secondary"
                  }`}
                >
                  ✓
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="pt-4 border-t border-[#EAF2F8] flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onPrevious}
          disabled={currentIdx === 0}
          className="px-4 py-2 rounded-xl text-xs font-bold border border-brand-border-soft text-brand-copy-muted hover:bg-[#F0F6FA] hover:text-brand-ink disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
        >
          <span>&rarr;</span>
          <span>السابق</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-brand-subtle">الحفظ يتم تلقائياً</span>
          <button
            type="button"
            onClick={onRestart}
            className="text-xs text-brand-subtle hover:text-red-600 transition-colors underline"
          >
            إعادة البدء
          </button>
        </div>
      </div>
    </div>
  );
}
