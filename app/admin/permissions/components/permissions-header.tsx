interface PermissionsHeaderProps {
  onOpenAddModal: () => void;
}

export function PermissionsHeader({ onOpenAddModal }: PermissionsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-primary" />
          <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
            الأمان والرقابة الإدارية
          </span>
          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-brand-surface-blue text-brand-primary border border-brand-border-soft">
            Super Admin فقط
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-brand-ink tracking-tight">
          إدارة المشرفين ومصفوفة الصلاحيات
        </h1>
        <p className="text-xs sm:text-sm text-brand-muted leading-relaxed max-w-2xl">
          التحكم في وصول المشرفين وأعضاء الفريق. يمكنك تفعيل أو تعطيل أي صلاحية مباشرة بنقرة واحدة عبر مصفوفة الصلاحيات (ON/OFF Matrix).
        </p>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <button
          type="button"
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-hover-medium text-white text-xs sm:text-sm font-bold transition-all shadow-xs hover:shadow-md"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          <span>+ دعوة مشرف</span>
        </button>
      </div>
    </div>
  );
}

