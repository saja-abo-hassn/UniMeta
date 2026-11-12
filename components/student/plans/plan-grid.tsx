"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { StudyPlan } from "@/src/data/study-plans-data";
import { useStudyPlan } from "@/src/contexts/study-plan-context";
import { useNotifications } from "@/src/contexts/notifications-context";
import { PlanCard } from "./plan-card";
import { PlanDetailsModal } from "./plan-details-modal";
import { SelectedPlanBanner } from "./selected-plan-banner";

export function PlanGrid() {
  const router = useRouter();
  const {
    plans,
    selectedPlanId,
    selectedPlan,
    hasPlanSelected,
    selectPlan,
    completedCredits,
    remainingCredits,
    completionPercentage,
    cumulativeGpa,
    gpaRating,
  } = useStudyPlan();

  const { notify } = useNotifications();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDegree, setSelectedDegree] = useState<"all" | "بكالوريوس" | "ماجستير">("all");

  // Plan Details Modal State
  const [modalPlan, setModalPlan] = useState<StudyPlan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filtered Plans
  const filteredPlans = useMemo(() => {
    return plans.filter((plan) => {
      // Degree Filter
      if (selectedDegree !== "all" && plan.degree !== selectedDegree) {
        return false;
      }

      // Search Filter
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchesMajor = plan.major.toLowerCase().includes(query);
        const matchesCollege = plan.college.toLowerCase().includes(query);
        const matchesDescription = plan.description.toLowerCase().includes(query);
        const matchesCode = plan.courses.some(
          (c) => c.code.toLowerCase().includes(query) || c.name.toLowerCase().includes(query)
        );
        return matchesMajor || matchesCollege || matchesDescription || matchesCode;
      }

      return true;
    });
  }, [plans, selectedDegree, searchQuery]);

  const handleSelectPlan = (plan: StudyPlan) => {
    selectPlan(plan.id);
    notify({
      type: "general",
      title: "تم اعتماد الخطة الدراسية بنجاح! 🎓",
      message: `تم اعتماد خطة تخصص "${plan.major}" والانتقال إلى صفحة الساعات المعتمدة.`,
      playSound: true,
      browserNotify: true,
    });
    router.push("/my-hours");
  };

  const handleOpenDetails = (plan: StudyPlan) => {
    setModalPlan(plan);
    setIsModalOpen(true);
  };

  const scrollToGrid = () => {
    const el = document.getElementById("plans-catalog-grid");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* 1. Selected Plan Banner or Choose Plan Prompt */}
      {hasPlanSelected ? (
        <SelectedPlanBanner
          plan={selectedPlan}
          completedCredits={completedCredits}
          remainingCredits={remainingCredits}
          completionPercentage={completionPercentage}
          cumulativeGpa={cumulativeGpa}
          gpaRating={gpaRating}
          onChangePlanRequest={scrollToGrid}
          onViewPlanDetails={handleOpenDetails}
        />
      ) : (
        <div className="card-entrance p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-[#EAF4FD] to-white border border-[#D7EAF7] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#0057C8] text-white flex items-center justify-center shrink-0 shadow-md">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18C5 19.94 8.13 22 12 22C15.87 22 19 19.94 19 17.18V13.18L12 17.09L5 13.18Z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-base text-[#16324A]">
                لم تقم باختيار خطتك الدراسية بعد
              </h3>
              <p className="text-xs text-[#66788A] mt-0.5">
                تصفح قائمة التخصصات المعتمدة أدناه واضغط &quot;اعتماد الخطة&quot; لربط خطتك تلقائياً وتفعيل حسابات الساعات والمعدل في لوحة التحكم.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={scrollToGrid}
            className="px-4 py-2.5 rounded-xl bg-[#0057C8] text-white text-xs font-bold hover:bg-[#2D78B7] transition-colors shrink-0 shadow-xs"
          >
            تصفح الخطط أدناه ↓
          </button>
        </div>
      )}

      {/* 2. Plans Catalog Section (Grid matching Al-Azhar portal) */}
      <section id="plans-catalog-grid" className="space-y-5">
        {/* Controls: Search + Degree Filter Pills */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#D7EAF7] shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-[#16324A]">
                دليل البرامج والخطط الدراسية المعتمدة
              </h2>
              <p className="text-xs text-[#66788A] mt-0.5">
                تصفح خطط كلية الهندسة وتكنولوجيا المعلومات واختر تخصصك الأكاديمي لربطه تلقائياً مع أدوات المنصة.
              </p>
            </div>

            {/* Degree Filter Tabs (Matching screenshot tabs: برامج البكالوريوس / برامج الماجستير) */}
            <div className="flex items-center gap-1.5 p-1 bg-[#F4FAFF] rounded-2xl border border-[#D7EAF7] text-xs font-bold">
              <button
                type="button"
                onClick={() => setSelectedDegree("all")}
                className={`px-3.5 py-2 rounded-xl transition-all ${
                  selectedDegree === "all"
                    ? "bg-[#0057C8] text-white shadow-xs"
                    : "text-[#16324A] hover:text-[#0057C8] hover:bg-white"
                }`}
              >
                كافة البرامج ({plans.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedDegree("بكالوريوس")}
                className={`px-3.5 py-2 rounded-xl transition-all ${
                  selectedDegree === "بكالوريوس"
                    ? "bg-[#0057C8] text-white shadow-xs"
                    : "text-[#16324A] hover:text-[#0057C8] hover:bg-white"
                }`}
              >
                برامج البكالوريوس
              </button>
              <button
                type="button"
                onClick={() => setSelectedDegree("ماجستير")}
                className={`px-3.5 py-2 rounded-xl transition-all ${
                  selectedDegree === "ماجستير"
                    ? "bg-[#0057C8] text-white shadow-xs"
                    : "text-[#16324A] hover:text-[#0057C8] hover:bg-white"
                }`}
              >
                برامج الماجستير
              </button>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <span className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-[#66788A]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن تخصص، كلية، أو مساق دراسي (مثال: علوم الحاسوب، أنظمة، ذكاء اصطناعي، 128 ساعة)..."
              className="w-full ps-10 pe-4 py-2.5 rounded-xl border border-[#D7EAF7] bg-[#F8FBFE] text-xs sm:text-sm font-semibold text-[#16324A] placeholder:text-[#66788A] focus:outline-none focus:border-[#4DB7F2] focus:bg-white focus:ring-2 focus:ring-[#4DB7F2]/20 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 end-0 flex items-center pe-3.5 text-xs text-[#66788A] hover:text-[#16324A]"
              >
                مسح ✕
              </button>
            )}
          </div>
        </div>

        {/* 3. Responsive Plans Grid (3 cols desktop, 2 cols tablet, 1 col mobile) */}
        {filteredPlans.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-[#D7EAF7] shadow-xs space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#EAF4FD] text-[#0057C8] flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-base text-[#16324A]">
              لم يتم العثور على تخصص يطابق البحث
            </h3>
            <p className="text-xs text-[#66788A] max-w-sm mx-auto">
              تأكد من كتابة الكلمات بشكل صحيح أو قم بإعادة ضبط معايير التصفية.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedDegree("all");
              }}
              className="px-4 py-2 rounded-xl bg-[#0057C8] text-white text-xs font-bold shadow-xs hover:bg-[#2D78B7]"
            >
              عرض كافة الخطط
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
            {filteredPlans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isSelected={plan.id === selectedPlanId}
                onSelect={handleSelectPlan}
                onViewDetails={handleOpenDetails}
              />
            ))}
          </div>
        )}
      </section>

      {/* 4. Plan Details Modal */}
      <PlanDetailsModal
        plan={modalPlan}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectPlan={handleSelectPlan}
        isCurrentlySelected={modalPlan?.id === selectedPlanId}
      />
    </div>
  );
}

