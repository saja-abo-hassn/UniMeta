interface PermissionsHeaderProps {
  onOpenAddModal: () => void;
}

export function PermissionsHeader({ onOpenAddModal }: PermissionsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0057C8]" />
          <span className="text-xs font-bold text-[#0057C8] uppercase tracking-wider">
            الأمان والرقابة الإدارية
          </span>
          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
            Super Admin فقط
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#16324A] tracking-tight">
          إدارة المشرفين ومصفوفة الصلاحيات
        </h1>
        <p className="text-xs sm:text-sm text-[#66788A] leading-relaxed max-w-2xl">
          التحكم في وصول المشرفين وأعضاء الفريق. يمكنك تفعيل أو تعطيل أي صلاحية مباشرة بنقرة واحدة عبر مصفوفة الصلاحيات (ON/OFF Matrix).
        </p>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <button
          type="button"
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0057C8] hover:bg-[#2D78B7] text-white text-xs sm:text-sm font-bold transition-all shadow-xs hover:shadow-md"
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

