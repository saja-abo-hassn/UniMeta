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
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
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
  errors,
  setErrors,
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

      <div className="space-y-1">
        <label className="block text-xs font-bold text-brand-ink">رقم الجوال للتواصل</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
              if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
            }}
            placeholder="مثال: 0599182744"
            dir="ltr"
            inputMode="numeric"
            maxLength={10}
            className={`w-full h-11 px-3.5 text-xs rounded-xl bg-white border focus:outline-none text-brand-ink font-mono ${errors.phone ? "border-red-400 focus:border-red-500" : "border-brand-border-soft focus:border-brand-primary"}`}
          />
        {errors.phone && <p className="text-[11px] text-red-600">{errors.phone}</p>}
      </div>
    </div>
  );
}

