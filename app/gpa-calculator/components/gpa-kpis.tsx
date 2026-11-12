import { StudyPlan } from "@/src/data/study-plans-data";

interface GpaKPIsProps {
  overallGpa: number;
  overallRating: { label: string; color: string };
  totalGradedCredits: number;
  totalYears: number;
  selectedPlan: StudyPlan;
}

export function GpaKPIs({
  overallGpa,
  overallRating,
  totalGradedCredits,
  totalYears,
  selectedPlan,
}: GpaKPIsProps) {
  return (
    <>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-hover-effect p-5 rounded-2xl bg-white border border-[#D7EAF7] shadow-xs space-y-1">
          <span className="text-xs font-semibold text-[#66788A] block">المعدل التراكمي الكلي</span>
          <div className="text-2xl sm:text-3xl font-black text-[#0057C8]" dir="ltr">
            {overallGpa > 0 ? `${overallGpa.toFixed(2)}%` : "0.00%"}
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border inline-block ${overallRating.color}`}>
            {overallRating.label}
          </span>
        </div>

        <div className="card-hover-effect p-5 rounded-2xl bg-white border border-[#D7EAF7] shadow-xs space-y-1">
          <span className="text-xs font-semibold text-[#66788A] block">الساعات المحسوبة في المعدل</span>
          <div className="text-2xl sm:text-3xl font-black text-[#16324A]">
            {totalGradedCredits} <span className="text-xs font-normal text-[#66788A]">/ {selectedPlan.totalCredits} س</span>
          </div>
          <span className="text-[11px] text-[#2D78B7] block font-medium">
            مجموع ساعات المساقات ذات العلامات
          </span>
        </div>

        <div className="card-hover-effect p-5 rounded-2xl bg-white border border-[#D7EAF7] shadow-xs space-y-1">
          <span className="text-xs font-semibold text-[#66788A] block">عدد السنوات المقررة</span>
          <div className="text-2xl sm:text-3xl font-black text-[#4DB7F2]">
            {totalYears} <span className="text-xs font-normal text-[#66788A]">سنوات دراسية</span>
          </div>
          <span className="text-[11px] text-[#66788A] block">
            {selectedPlan.degree} • {selectedPlan.semestersCount} فصول رسمية
          </span>
        </div>

        <div className="card-hover-effect p-5 rounded-2xl bg-white border border-[#D7EAF7] shadow-xs space-y-1">
          <span className="text-xs font-semibold text-[#66788A] block">الخطة الدراسية المعتمدة</span>
          <div className="text-base sm:text-lg font-black text-[#16324A] truncate">
            {selectedPlan.major}
          </div>
          <span className="text-[11px] text-[#66788A] block">
            {selectedPlan.totalCredits} ساعة معتمدة
          </span>
        </div>
      </section>

      <div className="p-3.5 rounded-2xl bg-[#F0F7FD] border border-[#D7EAF7] text-xs text-[#0057C8] font-semibold flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#0057C8]" />
          <span>نظام الحساب:</span>
          <span className="font-mono" dir="ltr">
            المعدل = مجموع (علامة المساق × ساعاته) ÷ مجموع الساعات
          </span>
        </div>
        <span className="text-[#66788A] text-[11px] hidden sm:inline">
          الدرجات من 100 نقطة
        </span>
      </div>
    </>
  );
}

