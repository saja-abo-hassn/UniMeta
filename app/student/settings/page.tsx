"use client";
import { apiClient } from "@/src/services/api-client";
import { LiveProfile } from "@/components/integration/live-profile";

import React, { useState } from "react";
import { useStudentUser } from "@/src/hooks/use-student-user";
import { useStudyPlan } from "@/src/contexts/study-plan-context";

export default function StudentSettingsPage() { return apiClient.isUsingMock() ? <MockStudentSettingsPage/> : <LiveProfile/>; }
function MockStudentSettingsPage() {
  const { user, fullName } = useStudentUser();
  const { selectedPlan, hasPlanSelected } = useStudyPlan();

  const [phone, setPhone] = useState("059-9123456");
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [showInTeams, setShowInTeams] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);

  const initials = fullName
    ? fullName.split(/\s+/).slice(0, 2).map((w) => w[0]).join("")
    : "ط";

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setNotice("تم حفظ التفضيلات محلياً. سيتم مزامنة تعديلات الحساب مع السجل الجامعي عند ربط الخادم.");
    setTimeout(() => setNotice(null), 4000);
  };

  const openOnboarding = () => {
    window.dispatchEvent(new Event("unimeta_open_onboarding"));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in" dir="rtl">
      {/* Header with Vertical Bilingual Stacking */}
      <section className="card-entrance p-6 sm:p-7 rounded-3xl bg-white border border-[#D7EAF7] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-col mb-1">
            <span className="text-xs font-bold text-[#0057C8] uppercase tracking-wider">
              Student Profile & Account Settings
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#16324A] mt-0.5">
              إعدادات الحساب والملف الشخصي
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#66788A] leading-relaxed max-w-xl">
            إدارة بياناتك الأكاديمية المسجلة، تفضيلات التواصل، وضبط ظهورك الأكاديمي في مجتمع UniMeta.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            الحساب: نشط ومنتظم
          </span>
        </div>
      </section>

      {/* Notice Banner */}
      {notice && (
        <div className="p-3.5 rounded-2xl bg-[#EAF4FD] border border-[#BEE3F8] text-[#0057C8] text-xs font-semibold animate-fade-in flex items-center gap-2">
          <span>✓</span>
          <span>{notice}</span>
        </div>
      )}

      {/* Profile Overview Card */}
      <section className="p-6 rounded-3xl bg-white border border-[#D7EAF7] shadow-xs">
        <div className="flex items-center gap-4 pb-6 border-b border-[#D7EAF7]">
          <div className="w-16 h-16 rounded-full bg-[#0057C8] text-white flex items-center justify-center font-extrabold text-xl shadow-xs">
            {initials}
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#16324A]">
              {fullName || "طالب جامعي"}
            </h2>
            <p className="text-xs text-[#66788A]">
              {hasPlanSelected ? selectedPlan.major : (user?.faculty || "كلية الهندسة وتكنولوجيا المعلومات")}
            </p>
            <span className="text-[10px] font-semibold text-[#0057C8] bg-[#EAF4FD] px-2 py-0.5 rounded-md mt-1 inline-block">
              الرقم الجامعي: {user?.studentId || "20241084"}
            </span>
          </div>
        </div>

        {/* Readonly Academic Record Data */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
          <div className="space-y-1">
            <span className="text-[11px] text-[#66788A] font-semibold block">الكلية</span>
            <div className="p-3 rounded-xl bg-[#F8FBFE] border border-[#D7EAF7] text-xs font-bold text-[#16324A]">
              {user?.faculty || "كلية الهندسة وتكنولوجيا المعلومات"}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] text-[#66788A] font-semibold block">التخصص الأكاديمي</span>
            <div className="p-3 rounded-xl bg-[#F8FBFE] border border-[#D7EAF7] text-xs font-bold text-[#16324A]">
              {hasPlanSelected ? selectedPlan.major : "لم يتم اختيار الخطة الدراسية"}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] text-[#66788A] font-semibold block">المستوى الدراسي</span>
            <div className="p-3 rounded-xl bg-[#F8FBFE] border border-[#D7EAF7] text-xs font-bold text-[#16324A]">
              السنة الثالثة
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] text-[#66788A] font-semibold block">الفصل الدراسي النشط</span>
            <div className="p-3 rounded-xl bg-[#F8FBFE] border border-[#D7EAF7] text-xs font-bold text-[#16324A]">
              الفصل الثاني 2025/2026
            </div>
          </div>
        </div>
      </section>

      {/* Preferences Form */}
      <form onSubmit={handleSave} className="p-6 rounded-3xl bg-white border border-[#D7EAF7] shadow-xs space-y-4">
        <h2 className="text-base font-bold text-[#16324A] pb-2 border-b border-[#D7EAF7]">
          تفضيلات التواصل والخصوصية
        </h2>

        <div className="space-y-1.5">
          <label htmlFor="phone" className="block text-xs font-semibold text-[#16324A]">
            رقم الهاتف للتواصل في الاتفاقيات
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full h-11 px-3.5 rounded-xl border border-[#D7EAF7] text-xs sm:text-sm text-[#16324A] focus:outline-none focus:border-[#4DB7F2]"
            dir="ltr"
          />
          <p className="text-[10px] text-[#66788A]">
            لا يظهر رقم هاتفك للعامة، ويقتصر على الزملاء في الاتفاقيات المعتمدة فقط.
          </p>
        </div>

        <div className="space-y-2 pt-2">
          <label className="flex items-center gap-2.5 text-xs text-[#16324A] cursor-pointer">
            <input
              type="checkbox"
              checked={notifyEmail}
              onChange={(e) => setNotifyEmail(e.target.checked)}
              className="w-4 h-4 rounded border-[#D7EAF7] text-[#0057C8] focus:ring-[#4DB7F2]/30"
            />
            <span>استلام إشعارات المهام والاتفاقيات عبر البريد الجامعي</span>
          </label>

          <label className="flex items-center gap-2.5 text-xs text-[#16324A] cursor-pointer">
            <input
              type="checkbox"
              checked={showInTeams}
              onChange={(e) => setShowInTeams(e.target.checked)}
              className="w-4 h-4 rounded border-[#D7EAF7] text-[#0057C8] focus:ring-[#4DB7F2]/30"
            />
            <span>إتاحة ظهور ملفي الشخصي في قائمة البحث عن شركاء لمشاريع التخرج</span>
          </label>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#0057C8] hover:bg-[#2D78B7] text-white text-xs font-bold transition-all shadow-xs"
          >
            حفظ التغييرات
          </button>
        </div>
      </form>

      {/* Onboarding Tour Re-trigger Section */}
      <section className="p-6 rounded-3xl bg-white border border-[#D7EAF7] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#EAF4FD] text-[#0057C8] flex items-center justify-center shrink-0 border border-[#D7EAF7]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#16324A]">
              الجولة التعريفية بالمنصة
            </h3>
            <p className="text-xs text-[#66788A] mt-0.5">
              إعادة استعراض الميزات الأساسية: الخطة الدراسية، الحاسبات، ومساحة التركيز والتبادل.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={openOnboarding}
          className="px-4 py-2 text-xs font-bold text-[#0057C8] hover:text-[#0284C7] bg-[#EAF4FD] hover:bg-[#D7EAF7] rounded-xl border border-[#D7EAF7] transition-colors shrink-0"
        >
          بدء الجولة التعريفية 🧭
        </button>
      </section>
    </div>
  );
}
