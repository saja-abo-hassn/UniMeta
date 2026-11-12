import Link from "next/link";

interface AdminQuickModulesProps {
  reviewMaterialsCount: number;
}

export function AdminQuickModules({ reviewMaterialsCount }: AdminQuickModulesProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <Link
        href="/admin/content"
        className="card-hover-effect p-6 rounded-3xl bg-white border border-[#D7EAF7] shadow-xs space-y-3 group block"
      >
        <div className="w-12 h-12 rounded-2xl bg-[#EAF4FD] text-[#0057C8] flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform shadow-2xs">
          📚
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-extrabold text-base text-[#16324A] group-hover:text-[#0057C8] transition-colors">
              إدارة المحتوى والمواد
            </h3>
            {reviewMaterialsCount > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                {reviewMaterialsCount} قيد المراجعة
              </span>
            )}
          </div>
          <p className="text-xs text-[#66788A] leading-relaxed">
            إضافة وتعديل وحذف الملخصات والمراجع والامتحانات السابقة المرتبطة بالمساقات المعتمدة فورياً.
          </p>
        </div>
        <div className="pt-2 border-t border-[#D7EAF7]/60 flex items-center justify-between text-xs font-bold text-[#0057C8]">
          <span>فتح شجرة المواد</span>
          <span>←</span>
        </div>
      </Link>

      <Link
        href="/admin/moderators"
        className="card-hover-effect p-6 rounded-3xl bg-white border border-[#D7EAF7] shadow-xs space-y-3 group block"
      >
        <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform shadow-2xs">
          🛡️
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-extrabold text-base text-[#16324A] group-hover:text-[#0057C8] transition-colors">
              الصلاحيات والمشرفين
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F4FAFF] text-[#0057C8] border border-[#D7EAF7]">
              Super Admin فقط
            </span>
          </div>
          <p className="text-xs text-[#66788A] leading-relaxed">
            إدارة رتب المشرفين وتحديد صلاحيات كل مشرف على حدة من خلال مصفوفة الصلاحيات المتقدمة.
          </p>
        </div>
        <div className="pt-2 border-t border-[#D7EAF7]/60 flex items-center justify-between text-xs font-bold text-[#0057C8]">
          <span>مصفوفة الصلاحيات</span>
          <span>←</span>
        </div>
      </Link>

      <Link
        href="/admin/exams"
        className="card-hover-effect p-6 rounded-3xl bg-white border border-[#D7EAF7] shadow-xs space-y-3 group block"
      >
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform shadow-2xs">
          📅
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-extrabold text-base text-[#16324A] group-hover:text-[#0057C8] transition-colors">
              مواعيد الامتحانات والتقويم
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              الفصل الثاني 2026
            </span>
          </div>
          <p className="text-xs text-[#66788A] leading-relaxed">
            جدولة مواعيد الاختبارات النصفية والنهائية وتعيين القاعات وتزامنها مع روزنامة الطالب.
          </p>
        </div>
        <div className="pt-2 border-t border-[#D7EAF7]/60 flex items-center justify-between text-xs font-bold text-[#0057C8]">
          <span>جدول الامتحانات</span>
          <span>←</span>
        </div>
      </Link>
    </section>
  );
}

