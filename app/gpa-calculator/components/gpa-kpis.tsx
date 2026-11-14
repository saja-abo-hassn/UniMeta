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
        <div className="card-hover-effect p-5 rounded-2xl bg-white border border-brand-border-soft shadow-xs space-y-1">
          <span className="text-xs font-semibold text-brand-muted block">المعدل التراكمي الكلي</span>
          <div className="text-2xl sm:text-3xl font-black text-brand-primary" dir="ltr">
            {overallGpa > 0 ? `${overallGpa.toFixed(2)}%` : "0.00%"}
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border inline-block ${overallRating.color}`}>
            {overallRating.label}
          </span>
        </div>

        <div className="card-hover-effect p-5 rounded-2xl bg-white border border-brand-border-soft shadow-xs space-y-1">
          <span className="text-xs font-semibold text-brand-muted block">الساعات المحسوبة في المعدل</span>
          <div className="text-2xl sm:text-3xl font-black text-brand-ink">
            {totalGradedCredits} <span className="text-xs font-normal text-brand-muted">/ {selectedPlan.totalCredits} س</span>
          </div>
          <span className="text-[11px] text-brand-hover-medium block font-medium">
            مجموع ساعات المساقات ذات العلامات
          </span>
        </div>

        <div className="card-hover-effect p-5 rounded-2xl bg-white border border-brand-border-soft shadow-xs space-y-1">
          <span className="text-xs font-semibold text-brand-muted block">عدد السنوات المقررة</span>
          <div className="text-2xl sm:text-3xl font-black text-brand-secondary">
            {totalYears} <span className="text-xs font-normal text-brand-muted">سنوات دراسية</span>
          </div>
          <span className="text-[11px] text-brand-muted block">
            {selectedPlan.degree} • {selectedPlan.semestersCount} فصول رسمية
          </span>
        </div>

        <div className="card-hover-effect p-5 rounded-2xl bg-white border border-brand-border-soft shadow-xs space-y-1">
          <span className="text-xs font-semibold text-brand-muted block">الخطة الدراسية المعتمدة</span>
          <div className="text-base sm:text-lg font-black text-brand-ink truncate">
            {selectedPlan.major}
          </div>
          <span className="text-[11px] text-brand-muted block">
            {selectedPlan.totalCredits} ساعة معتمدة
          </span>
        </div>
      </section>

      <div className="p-3.5 rounded-2xl bg-brand-surface-soft border border-brand-border-soft text-xs text-brand-primary font-semibold flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-primary" />
          <span>نظام الحساب:</span>
          <span className="font-mono" dir="ltr">
            المعدل = مجموع (علامة المساق × ساعاته) ÷ مجموع الساعات
          </span>
        </div>
        <span className="text-brand-muted text-[11px] hidden sm:inline">
          الدرجات من 100 نقطة
        </span>
      </div>
    </>
  );
}

