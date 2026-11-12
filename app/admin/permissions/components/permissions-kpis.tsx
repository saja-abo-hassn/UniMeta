interface PermissionsKPIsProps {
  counts: {
    total: number;
    superAdmins: number;
    moderators: number;
    active: number;
  };
}

export function PermissionsKPIs({ counts }: PermissionsKPIsProps) {
  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <div className="p-5 rounded-2xl bg-white border border-[#D7EAF7] shadow-xs space-y-1">
        <span className="text-xs font-semibold text-[#66788A] block">إجمالي فريق الإشراف</span>
        <div className="text-2xl sm:text-3xl font-black text-[#16324A]">
          {counts.total}
        </div>
        <span className="text-[11px] text-[#66788A] block">مشرفين ومسؤولين</span>
      </div>

      <div className="p-5 rounded-2xl bg-purple-50/70 border border-purple-200 shadow-xs space-y-1">
        <span className="text-xs font-bold text-purple-800 block">المسؤولين العامين (Super Admin)</span>
        <div className="text-2xl sm:text-3xl font-black text-purple-800">
          {counts.superAdmins}
        </div>
        <span className="text-[11px] text-purple-700 block">كامل صلاحيات النظام</span>
      </div>

      <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 shadow-xs space-y-1">
        <span className="text-xs font-bold text-blue-800 block">المشرفين الميدانيين (Moderators)</span>
        <div className="text-2xl sm:text-3xl font-black text-blue-800">
          {counts.moderators}
        </div>
        <span className="text-[11px] text-blue-700 block">صلاحيات مخصصة حسب القسم</span>
      </div>

      <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 shadow-xs space-y-1">
        <span className="text-xs font-bold text-emerald-800 block">الحسابات الإشرافية النشطة</span>
        <div className="text-2xl sm:text-3xl font-black text-emerald-800">
          {counts.active}
        </div>
        <span className="text-[11px] text-emerald-700 block">يمكنهم تسجيل الدخول الآن</span>
      </div>
    </section>
  );
}

