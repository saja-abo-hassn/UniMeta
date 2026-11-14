"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  QuizResultCalculation,
  TRAITS_CONFIG,
  TraitKey,
  STORAGE_QUIZ_RESULT_KEY,
} from "@/src/data/major-orientation-config";
import { useStudyPlan } from "@/src/contexts/study-plan-context";
import { useNotifications } from "@/src/contexts/notifications-context";
import { apiClient } from "@/src/services/api-client";

export function OrientationResultBanner() {
  const [result, setResult] = useState<QuizResultCalculation | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { selectedPlanId, selectPlan } = useStudyPlan();
  const { notify } = useNotifications();

  const loadSavedResult = () => {
    try {
      const raw = localStorage.getItem(STORAGE_QUIZ_RESULT_KEY);
      if (raw) {
        setResult(JSON.parse(raw));
      } else {
        setResult(null);
      }
    } catch {
      setResult(null);
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    if(!apiClient.isUsingMock())return;
    loadSavedResult();

    const handleUpdate = () => loadSavedResult();
    window.addEventListener("unimeta_orientation_result_updated", handleUpdate);
    return () => window.removeEventListener("unimeta_orientation_result_updated", handleUpdate);
  }, []);

  if (!isLoaded) return null;

  // Case A: Student has completed the orientation quiz
  if (result) {
    const isPlanAlreadySelected = selectedPlanId === result.topMajor.planId;

    return (
      <section className="card-entrance p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#EAF4FD] via-[#F4FAFF] to-[#EAF4FD] border border-[#BEE3F8] shadow-xs relative overflow-hidden" dir="rtl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          {/* Mascot & Details */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="relative w-16 h-16 sm:w-18 sm:h-18 shrink-0 mascot-stationary-float select-none">
              <Image
                src="/mascot/think.png"
                alt="UniMeta Guidance Mascot"
                fill
                className="object-contain drop-shadow-sm"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold text-[#0057C8] bg-white px-2.5 py-0.5 rounded-full border border-[#BEE3F8]">
                  توصية مقياس الميول الجامعية (15 سؤالاً)
                </span>
                <span className="text-xs font-black text-[#0057C8] bg-white px-2 py-0.5 rounded-full border border-[#BEE3F8]">
                  {result.topMajor.matchPercentage}% تطابق
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-extrabold text-[#16324A]">
                التخصص الأنسب لك: {result.topMajor.majorName}
              </h2>

              <p className="text-xs text-[#48627A] leading-relaxed max-w-xl">
                {result.summaryExplanation.split("\n")[0]}
              </p>

              {/* Trait Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[11px] text-[#8297A8]">أبرز سماتك:</span>
                {result.topTraits.map((tKey: TraitKey) => {
                  const trait = TRAITS_CONFIG[tKey];
                  const percent = result.percentages[tKey] || 0;
                  return (
                    <span
                      key={tKey}
                      className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-white border border-[#D7EAF7] text-[#16324A]"
                    >
                      <span>{trait.icon}</span>
                      <span>{trait.name}</span>
                      <span className="text-[#0057C8] font-mono">({percent}%)</span>
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-row md:flex-col items-center sm:items-stretch gap-2.5 shrink-0 pt-2 md:pt-0">
            {!isPlanAlreadySelected ? (
              <button
                type="button"
                onClick={() => {
                  selectPlan(result.topMajor.planId);
                  notify({
                    type: "general",
                    title: "تم اعتماد الخطة المقترحة! 🎓",
                    message: `تم اعتماد خطة تخصص "${result.topMajor.majorName}" بنجاح.`,
                    playSound: true,
                  });
                }}
                className="px-4 py-2 rounded-xl bg-[#0057C8] hover:bg-[#0045A5] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>اعتماد خطة {result.topMajor.majorName}</span>
                <span>&larr;</span>
              </button>
            ) : (
              <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                <span>✓</span>
                <span>خطتك المعتمدة حالياً</span>
              </div>
            )}

            <Link
              href="/student/interests"
              className="px-4 py-2 rounded-xl bg-white border border-[#D7EAF7] hover:border-[#4DB7F2] text-[#48627A] hover:text-[#0057C8] text-xs font-semibold text-center transition-colors shadow-2xs"
            >
              عرض التفاصيل / إعادة الاختبار
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // Case B: Student has NOT taken the quiz yet -> Show gentle encouraging callout
  return (
    <section className="card-entrance p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#F4FAFF] via-white to-[#F4FAFF] border border-[#D7EAF7] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4" dir="rtl">
      <div className="flex items-center gap-4">
        <div className="relative w-14 h-14 shrink-0 mascot-stationary-float select-none">
          <Image
            src="/mascot/think.png"
            alt="UniMeta Question Mascot"
            fill
            className="object-contain drop-shadow-sm"
          />
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-[#0057C8] bg-[#EAF4FD] px-2.5 py-0.5 rounded-md border border-[#BEE3F8]">
              مقياس الميول وتوجيه التخصصات
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-extrabold text-[#16324A]">
            محتار في اختيار التخصص الأنسب لقدراتك؟
          </h2>
          <p className="text-xs text-[#66788A] leading-relaxed max-w-xl">
            أجب عن 15 سؤالاً تفاعلياً مبنية على معايير الميول المهنية لنقترح لك الخطة الدراسية الأكثر تطابقاً مع شغفك من بين خطط جامعة الأزهر المعتمدة.
          </p>
        </div>
      </div>

      <Link
        href="/student/interests"
        className="px-5 py-2.5 rounded-xl bg-[#0057C8] hover:bg-[#0045A5] text-white text-xs font-bold transition-all shadow-xs hover:shadow shrink-0 flex items-center gap-1.5 cursor-pointer"
      >
        <span>ابدأ مقياس الميول (15 سؤالاً)</span>
        <span>&larr;</span>
      </Link>
    </section>
  );
}
