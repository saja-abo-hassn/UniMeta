import Link from "next/link";

interface AdminQuickModulesProps {
  reviewMaterialsCount: number;
}

export function AdminQuickModules({ reviewMaterialsCount }: AdminQuickModulesProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <Link
        href="/admin/content"
        className="card-hover-effect p-6 rounded-3xl bg-white border border-brand-border-soft shadow-xs space-y-3 group block"
      >
        <div className="w-12 h-12 rounded-2xl bg-brand-surface-blue text-brand-primary flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform shadow-2xs">
          📚
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-extrabold text-base text-brand-ink group-hover:text-brand-primary transition-colors">
              إدارة المحتوى والمواد
            </h3>
            {reviewMaterialsCount > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-surface-blue text-amber-800 border border-brand-border-soft">
                {reviewMaterialsCount} قيد المراجعة
              </span>
            )}
          </div>
          <p className="text-xs text-brand-muted leading-relaxed">
            إضافة وتعديل وحذف الملخصات والمراجع والامتحانات السابقة المرتبطة بالمساقات المعتمدة فورياً.
          </p>
        </div>
        <div className="pt-2 border-t border-brand-border-soft/60 flex items-center justify-between text-xs font-bold text-brand-primary">
          <span>فتح شجرة المواد</span>
          <span>←</span>
        </div>
      </Link>

      <Link
        href="/admin/moderators"
        className="card-hover-effect p-6 rounded-3xl bg-white border border-brand-border-soft shadow-xs space-y-3 group block"
      >
        <div className="w-12 h-12 rounded-2xl bg-brand-surface-blue text-brand-primary flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform shadow-2xs">
          🛡️
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-extrabold text-base text-brand-ink group-hover:text-brand-primary transition-colors">
              الصلاحيات والمشرفين
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F4FAFF] text-brand-primary border border-brand-border-soft">
              Super Admin فقط
            </span>
          </div>
          <p className="text-xs text-brand-muted leading-relaxed">
            إدارة رتب المشرفين وتحديد صلاحيات كل مشرف على حدة من خلال مصفوفة الصلاحيات المتقدمة.
          </p>
        </div>
        <div className="pt-2 border-t border-brand-border-soft/60 flex items-center justify-between text-xs font-bold text-brand-primary">
          <span>مصفوفة الصلاحيات</span>
          <span>←</span>
        </div>
      </Link>

      <Link
        href="/admin/exams"
        className="card-hover-effect p-6 rounded-3xl bg-white border border-brand-border-soft shadow-xs space-y-3 group block"
      >
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform shadow-2xs">
          📅
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-extrabold text-base text-brand-ink group-hover:text-brand-primary transition-colors">
              مواعيد الامتحانات والتقويم
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              الفصل الثاني 2026
            </span>
          </div>
          <p className="text-xs text-brand-muted leading-relaxed">
            جدولة مواعيد الاختبارات النصفية والنهائية وتعيين القاعات وتزامنها مع روزنامة الطالب.
          </p>
        </div>
        <div className="pt-2 border-t border-brand-border-soft/60 flex items-center justify-between text-xs font-bold text-brand-primary">
          <span>جدول الامتحانات</span>
          <span>←</span>
        </div>
      </Link>
    </section>
  );
}

