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
      <div className="p-5 rounded-2xl bg-white border border-brand-border-soft shadow-xs space-y-1">
        <span className="text-xs font-semibold text-brand-muted block">إجمالي فريق الإشراف</span>
        <div className="text-2xl sm:text-3xl font-black text-brand-ink">
          {counts.total}
        </div>
        <span className="text-[11px] text-brand-muted block">مشرفين ومسؤولين</span>
      </div>

      <div className="p-5 rounded-2xl bg-brand-surface-blue border border-brand-border-soft shadow-xs space-y-1">
        <span className="text-xs font-bold text-brand-ink block">المسؤولين العامين (Super Admin)</span>
        <div className="text-2xl sm:text-3xl font-black text-brand-ink">
          {counts.superAdmins}
        </div>
        <span className="text-[11px] text-brand-primary block">كامل صلاحيات النظام</span>
      </div>

      <div className="p-5 rounded-2xl bg-brand-surface-blue/70 border border-brand-border-soft shadow-xs space-y-1">
        <span className="text-xs font-bold text-brand-ink block">المشرفين الميدانيين (Moderators)</span>
        <div className="text-2xl sm:text-3xl font-black text-brand-ink">
          {counts.moderators}
        </div>
        <span className="text-[11px] text-brand-primary block">صلاحيات مخصصة حسب القسم</span>
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

