"use client";

export type EmailNoticeKind = "activation" | "password-reset" | "agreement" | "invitation";

const messages: Record<EmailNoticeKind, string> = {
  activation: "قد تصلك رسالة كود التفعيل في الرسائل غير المرغوب فيها (Spam) على Gmail، يُرجى التحقق منها في حال عدم ظهور الرسالة في صندوق الوارد.",
  "password-reset": "قد تصلك رسالة استعادة كلمة المرور أو رابط إعادة التعيين في الرسائل غير المرغوب فيها (Spam) على Gmail، يُرجى التحقق منها في حال عدم ظهورها في صندوق الوارد.",
  agreement: "قد تصلك رسالة رمز التحقق للاتفاقية في الرسائل غير المرغوب فيها (Spam) على Gmail، يُرجى التحقق منها في حال عدم ظهور الرسالة في صندوق الوارد.",
  invitation: "قد تصلك رسالة دعوة المشرف ورابط تفعيل الحساب في الرسائل غير المرغوب فيها (Spam) على Gmail، يُرجى التحقق منها في حال عدم ظهور الرسالة في صندوق الوارد.",
};

export function EmailNoticeCard({ kind, onDismiss }: { kind: EmailNoticeKind; onDismiss: () => void }) {
  return (
    <aside role="status" dir="rtl" className="email-notice-enter relative flex items-start gap-3 rounded-2xl border border-brand-border-soft bg-white p-3.5 text-brand-ink shadow-sm sm:p-4">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#EAF4FD] text-brand-primary" aria-hidden="true">
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="3" y="5" width="18" height="14" rx="2" strokeWidth="1.8" />
          <path d="m4 7 8 6 8-6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <div className="min-w-0 flex-1 pr-1">
        <h3 className="text-xs font-extrabold text-brand-primary">تنبيه مهم 📩</h3>
        <p className="mt-1 text-xs leading-relaxed text-brand-copy-muted">{messages[kind]}</p>
      </div>
      <button type="button" onClick={onDismiss} aria-label="إغلاق التنبيه" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-brand-muted transition-colors hover:bg-brand-surface-muted hover:text-brand-ink">
        <span aria-hidden="true">×</span>
      </button>
    </aside>
  );
}
