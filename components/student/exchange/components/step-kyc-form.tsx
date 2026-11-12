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
  isPhoneVerified: boolean;
  setIsPhoneVerified: (verified: boolean) => void;
  otpCode: string;
  setOtpCode: (code: string) => void;
  isSendingOtp: boolean;
  isVerifyingOtp: boolean;
  otpSent: boolean;
  otpCountdown: number;
  otpNotice: string | null;
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
  isPhoneVerified,
  setIsPhoneVerified,
  otpCode,
  setOtpCode,
  isSendingOtp,
  isVerifyingOtp,
  otpSent,
  otpCountdown,
  otpNotice,
  errors,
  setErrors,
  onSendOtp,
  onVerifyOtp,
}: StepKycFormProps) {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="p-3.5 rounded-2xl bg-[#F0F7FD] border border-[#D7EAF7] text-xs text-[#48627A] flex items-start gap-2.5">
        <span className="text-base shrink-0 mt-0.5">🔒</span>
        <div className="leading-relaxed">
          <strong className="block text-[#16324A] font-bold mb-0.5">حماية البيانات والخصوصية:</strong>
          تُحفظ بياناتك بأمان وتُشفّر في سجلات المنصة لاستكمال إجراءات العهدة الجامعية والتحكيم الأكاديمي، وتُعبأ تلقائياً في طلباتك القادمة.
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="space-y-1">
          <label className="block text-xs font-bold text-[#16324A]">اسم الطالب كاملاً</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="الاسم الرباعي المعتمد"
            className="w-full h-11 px-3.5 text-xs rounded-xl bg-white border border-[#D7EAF7] focus:outline-none focus:border-[#0057C8] text-[#16324A]"
          />
          {errors.fullName && <p className="text-[11px] text-red-600">{errors.fullName}</p>}
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-bold text-[#16324A]">الرقم الجامعي</label>
          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="مثال: 20221084"
            dir="ltr"
            className="w-full h-11 px-3.5 text-xs rounded-xl bg-white border border-[#D7EAF7] focus:outline-none focus:border-[#0057C8] text-[#16324A] font-mono"
          />
          {errors.studentId && <p className="text-[11px] text-red-600">{errors.studentId}</p>}
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <label className="font-bold text-[#16324A]">رقم الهوية الوطنية (9 أرقام)</label>
          <span className="text-[11px] text-[#8297A8]">تُحفظ مشفرة ولا تظهر إلا للمشرف</span>
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
            errors.nationalId ? "border-red-400 focus:border-red-500" : "border-[#D7EAF7] focus:border-[#0057C8]"
          } focus:outline-none text-[#16324A]`}
        />
        {errors.nationalId && <p className="text-[11px] text-red-600">{errors.nationalId}</p>}
      </div>

      <div className="space-y-2 p-4 rounded-2xl bg-[#F8FBFE] border border-[#D7EAF7]">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-[#16324A]">رقم الجوال للتواصل وتأكيد الحساب</label>
          {isPhoneVerified && (
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <span>✓</span>
              <span>تم التحقق من الجوال عبر OTP</span>
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <input
            type="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setIsPhoneVerified(false);
              if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
            }}
            placeholder="مثال: 0599182744"
            dir="ltr"
            disabled={isPhoneVerified}
            className="flex-1 h-11 px-3.5 text-xs rounded-xl bg-white border border-[#D7EAF7] focus:outline-none focus:border-[#0057C8] text-[#16324A] font-mono"
          />

          {!isPhoneVerified && (
            <button
              type="button"
              onClick={onSendOtp}
              disabled={isSendingOtp || otpCountdown > 0}
              className="px-4 h-11 text-xs font-bold bg-[#0057C8] hover:bg-[#0046A0] disabled:bg-[#A3C7E8] text-white rounded-xl transition-colors shrink-0 shadow-2xs"
            >
              {isSendingOtp
                ? "جاري الإرسال..."
                : otpCountdown > 0
                ? `إعادة بعد (${otpCountdown}s)`
                : otpSent
                ? "إعادة إرسال OTP"
                : "إرسال رمز OTP"}
            </button>
          )}
        </div>
        {errors.phone && <p className="text-[11px] text-red-600">{errors.phone}</p>}

        {!isPhoneVerified && otpSent && (
          <div className="pt-2 space-y-2 border-t border-[#EAF2F8] animate-fade-in">
            <span className="text-[11px] text-[#48627A] block">
              أدخل رمز التحقق (4 أرقام) المرسل إلى جوالك:
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={4}
                inputMode="numeric"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                placeholder="••••"
                dir="ltr"
                className="w-32 h-10 px-3 text-center text-sm font-bold font-mono tracking-widest rounded-xl bg-white border border-[#D7EAF7] focus:outline-none focus:border-[#0057C8]"
              />
              <button
                type="button"
                onClick={onVerifyOtp}
                disabled={isVerifyingOtp || !otpCode}
                className="px-4 h-10 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl transition-colors shadow-2xs"
              >
                {isVerifyingOtp ? "جاري الفحص..." : "تأكيد الرمز ✓"}
              </button>
            </div>
            {errors.otp && <p className="text-[11px] text-red-600">{errors.otp}</p>}
          </div>
        )}

        {otpNotice && (
          <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-[11px] flex items-center gap-1.5 animate-fade-in">
            <span>ℹ️</span>
            <span>{otpNotice}</span>
          </div>
        )}
      </div>
    </div>
  );
}

