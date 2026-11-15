import React from "react";

interface StepKycFormProps {
  fullName: string;
  setFullName: (name: string) => void;
  studentId: string;
  setStudentId: (id: string) => void;
  nationalId: string;
  setNationalId: (id: string) => void;
  phone: string;
  setPhone: (phone: string) => void;
  email: string;
  isEmailVerified: boolean;
  otpCode: string;
  setOtpCode: (code: string) => void;
  isSendingOtp: boolean;
  isVerifyingOtp: boolean;
  otpSent: boolean;
  otpCountdown: number;
  otpNotice: string | null;
  emailNotice: React.ReactNode;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  onSendOtp: () => void;
  onVerifyOtp: () => void;
}

export function StepKycForm({
  fullName,
  setFullName,
  studentId,
  setStudentId,
  nationalId,
  setNationalId,
  phone,
  setPhone,
  email,
  isEmailVerified,
  otpCode,
  setOtpCode,
  isSendingOtp,
  isVerifyingOtp,
  otpSent,
  otpCountdown,
  otpNotice,
  emailNotice,
  errors,
  setErrors,
  onSendOtp,
  onVerifyOtp,
}: StepKycFormProps) {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="p-3.5 rounded-2xl bg-brand-surface-soft border border-brand-border-soft text-xs text-brand-copy-muted flex items-start gap-2.5">
        <span className="text-base shrink-0 mt-0.5">🔒</span>
        <div className="leading-relaxed">
          <strong className="block text-brand-ink font-bold mb-0.5">حماية البيانات والخصوصية:</strong>
          تُحفظ بياناتك بأمان وتُشفّر في سجلات المنصة لاستكمال إجراءات العهدة الجامعية والتحكيم الأكاديمي، وتُعبأ تلقائياً في طلباتك القادمة.
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="space-y-1">
          <label className="block text-xs font-bold text-brand-ink">اسم الطالب كاملاً</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="الاسم الرباعي المعتمد"
            className="w-full h-11 px-3.5 text-xs rounded-xl bg-white border border-brand-border-soft focus:outline-none focus:border-brand-primary text-brand-ink"
          />
          {errors.fullName && <p className="text-[11px] text-red-600">{errors.fullName}</p>}
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-bold text-brand-ink">الرقم الجامعي</label>
          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="مثال: 20221084"
            dir="ltr"
            className="w-full h-11 px-3.5 text-xs rounded-xl bg-white border border-brand-border-soft focus:outline-none focus:border-brand-primary text-brand-ink font-mono"
          />
          {errors.studentId && <p className="text-[11px] text-red-600">{errors.studentId}</p>}
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <label className="font-bold text-brand-ink">رقم الهوية الوطنية (9 أرقام)</label>
          <span className="text-[11px] text-brand-subtle">تُحفظ مشفرة ولا تظهر إلا للمشرف</span>
        </div>
        <input
          type="text"
          maxLength={9}
          inputMode="numeric"
          value={nationalId}
          onChange={(e) => {
            const clean = e.target.value.replace(/\D/g, "");
            setNationalId(clean);
            if (errors.nationalId) setErrors((prev) => ({ ...prev, nationalId: "" }));
          }}
          placeholder="مثال: 405128914"
          dir="ltr"
          className={`w-full h-11 px-3.5 text-xs rounded-xl bg-white border font-mono tracking-widest ${
            errors.nationalId ? "border-red-400 focus:border-red-500" : "border-brand-border-soft focus:border-brand-primary"
          } focus:outline-none text-brand-ink`}
        />
        {errors.nationalId && <p className="text-[11px] text-red-600">{errors.nationalId}</p>}
      </div>

      <div className="space-y-2 p-4 rounded-2xl bg-brand-surface-muted border border-brand-border-soft">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-brand-ink">البريد الإلكتروني وتأكيد الحساب</label>
          {isEmailVerified && (
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <span>✓</span>
              <span>تم التحقق من البريد الإلكتروني</span>
            </span>
          )}
        </div>
        {!isEmailVerified && <p className="text-[11px] text-brand-copy-muted">لم يتم التحقق من البريد الإلكتروني بعد.</p>}

        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            readOnly
            aria-label="البريد الإلكتروني المسجل"
            dir="ltr"
            className="flex-1 min-w-0 h-11 px-3.5 text-xs rounded-xl bg-white border border-brand-border-soft text-brand-ink font-mono"
          />
          {!isEmailVerified && (
            <button
              type="button"
              onClick={onSendOtp}
              disabled={isSendingOtp || otpCountdown > 0 || !email}
              className="px-4 h-11 text-xs font-bold bg-brand-primary hover:bg-[#0046A0] disabled:bg-[#A3C7E8] text-white rounded-xl transition-colors shrink-0 shadow-2xs"
            >
              {isSendingOtp
                ? "جاري الإرسال..."
                : otpCountdown > 0
                ? `إعادة بعد (${otpCountdown}s)`
                : otpSent
                ? "إعادة إرسال الرمز"
                : "إرسال رمز التحقق"}
            </button>
          )}
        </div>

        {!isEmailVerified && otpSent && (
          <div className="pt-2 space-y-2 border-t border-[#EAF2F8] animate-fade-in">
            <span className="text-[11px] text-brand-copy-muted block">أدخل رمز التحقق المكوّن من 6 أرقام المرسل إلى بريدك الإلكتروني:</span>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex gap-1" dir="ltr">
                {Array.from({ length: 6 }, (_, index) => (
                  <input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    autoComplete={index === 0 ? "one-time-code" : "off"}
                    maxLength={1}
                    aria-label={`رقم ${index + 1} من رمز التحقق`}
                    value={otpCode[index]?.trim() || ""}
                    onChange={(event) => {
                      const digit = event.target.value.replace(/\D/g, "").slice(-1);
                      const next = otpCode.padEnd(6, " ").slice(0, 6).split("");
                      next[index] = digit || " ";
                      setOtpCode(next.join(""));
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Backspace" && !otpCode[index]?.trim() && index > 0) {
                        (event.currentTarget.previousElementSibling as HTMLInputElement | null)?.focus();
                      }
                    }}
                    onPaste={(event) => {
                      const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
                      if (pasted) {
                        event.preventDefault();
                        setOtpCode(pasted.padEnd(6, " "));
                      }
                    }}
                    className="w-8 h-10 text-center text-sm font-bold font-mono rounded-lg bg-white border border-brand-border-soft focus:outline-none focus:border-brand-primary"
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={onVerifyOtp}
                disabled={isVerifyingOtp || otpCode.replace(/\D/g, "").length !== 6}
                className="px-4 h-10 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl transition-colors shadow-2xs"
              >
                {isVerifyingOtp ? "جاري الفحص..." : "تأكيد الرمز ✓"}
              </button>
            </div>
            {errors.otp && <p className="text-[11px] text-red-600">{errors.otp}</p>}
          </div>
        )}

        {!isEmailVerified && !otpSent && errors.otp && <p className="text-[11px] text-red-600">{errors.otp}</p>}

        {emailNotice}
        {otpNotice && (
          <div className="p-2.5 rounded-xl bg-brand-surface-blue border border-brand-border-soft text-brand-dark text-[11px] flex items-center gap-1.5 animate-fade-in">
            <span>ℹ️</span>
            <span>{otpNotice}</span>
          </div>
        )}

        <div className="space-y-1 pt-1 border-t border-[#EAF2F8]">
          <label className="block text-xs font-bold text-brand-ink">رقم الجوال للتواصل</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
            }}
            placeholder="مثال: 0599182744"
            dir="ltr"
            className="flex-1 h-11 px-3.5 text-xs rounded-xl bg-white border border-brand-border-soft focus:outline-none focus:border-brand-primary text-brand-ink font-mono"
          />
        </div>
        {errors.phone && <p className="text-[11px] text-red-600">{errors.phone}</p>}
      </div>
    </div>
  );
}

