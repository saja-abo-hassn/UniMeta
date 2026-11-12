export function ModerationHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0057C8]" />
          <span className="text-xs font-bold text-[#0057C8] uppercase tracking-wider">
            السلامة والمجتمع
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#16324A] tracking-tight">
          الإشراف الأكاديمي والبلاغات
        </h1>
        <p className="text-xs sm:text-sm text-[#66788A] leading-relaxed max-w-2xl">
          متابعة وفحص البلاغات المقدمة من الطلاب وأعضاء الهيئة التدريسية. التحقق من سلامة المحتوى والتعليقات والاتفاقيات، واتخاذ الإجراءات الإدارية المنصفة.
        </p>
      </div>
    </div>
  );
}

