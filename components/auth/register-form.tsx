"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/contexts/auth-context";
import { RegisterData } from "@/src/services/auth-service";
import { apiClient } from "@/src/services/api-client";

export function RegisterForm() {
  const router = useRouter();
  const { register } = useAuth();

  const [formData, setFormData] = useState<RegisterData>({
    fullName: "",
    studentId: "",
    faculty: "كلية الهندسة وتكنولوجيا المعلومات",
    email: "",
    password: "",
    confirmPassword: "",
    agreedToTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Submit state & response banner
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const faculties = [
    "كلية الهندسة وتكنولوجيا المعلومات",
  ];

  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      nextErrors.fullName = "يرجى إدخال اسم الطالب كاملاً.";
    } else if (formData.fullName.trim().split(/\s+/).length < 2) {
      nextErrors.fullName = "يرجى إدخال الاسم الثنائي على الأقل.";
    }

    if (apiClient.isUsingMock() && !formData.studentId?.trim()) {
      nextErrors.studentId = "يرجى إدخال الرقم الجامعي.";
    } else if (apiClient.isUsingMock() && !/^\d{6,12}$/.test(formData.studentId?.trim() ?? "")) {
      nextErrors.studentId = "الرقم الجامعي يجب أن يتكون من أرقام فقط (6-12 رقماً).";
    }

    if (apiClient.isUsingMock() && !formData.faculty) {
      nextErrors.faculty = "يرجى اختيار الكلية.";
    }

    if (!formData.email.trim()) {
      nextErrors.email = "يرجى إدخال البريد الإلكتروني الجامعي.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      nextErrors.email = "صيغة البريد الإلكتروني غير صحيحة.";
    }

    if (!formData.password) {
      nextErrors.password = "يرجى إدخال كلمة المرور.";
    } else if (formData.password.length < 8) {
      nextErrors.password = "يجب ألا تقل كلمة المرور عن 8 خانات.";
    }

    if (!formData.confirmPassword) {
      nextErrors.confirmPassword = "يرجى تأكيد كلمة المرور.";
    } else if (formData.password !== formData.confirmPassword) {
      nextErrors.confirmPassword = "كلمتا المرور غير متطابقتين.";
    }

    if (!formData.agreedToTerms) {
      nextErrors.agreedToTerms = "يجب الموافقة على الشروط والأحكام للاستمرار.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await register(formData);
      setIsSubmitting(false);

      if (response.data?.requiresVerification) {
        setSuccessMessage(response.message || "تم إنشاء الحساب بنجاح! جاري تحويلك لتأكيد بريدك الإلكتروني...");
        setTimeout(() => {
          router.push(`/verify-email?email=${encodeURIComponent(formData.email.trim())}`);
        }, 500);
      } else if (response.data?.token) {
        setSuccessMessage(response.message || "تم إنشاء الحساب وتسجيل دخولك بنجاح!");
        setTimeout(() => {
          router.push("/student");
        }, 400);
      } else {
        setErrorMessage(response.message || "تعذر إنشاء الحساب، يرجى التحقق من البيانات.");
      }
    } catch {
      setIsSubmitting(false);
      setErrorMessage("حدث خطأ أثناء معالجة الطلب، يرجى المحاولة لاحقاً.");
    }
  };

  return (
    <div className="w-full space-y-5 animate-fade-in" dir="rtl">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
            إنشاء حساب جديد
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-ink mt-0.5">
            انضم إلى UniMeta
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-brand-muted pt-0.5">
          سجّل حسابك الأكاديمي للوصول لكافة الخدمات والأنظمة.
        </p>
      </div>

      {/* Error Message Banner */}
      {errorMessage && (
        <div
          role="alert"
          className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs leading-relaxed flex items-start gap-2.5 shadow-sm animate-fade-in"
        >
          <div className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 mt-0.5 font-bold">
            ✕
          </div>
          <div>
            <span className="font-bold block text-red-800 mb-0.5">خطأ في التسجيل:</span>
            {errorMessage}
          </div>
        </div>
      )}

      {/* Success Message Banner */}
      {successMessage && (
        <div
          role="status"
          className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs leading-relaxed flex items-start gap-2.5 shadow-sm animate-fade-in"
        >
          <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold">
            ✓
          </div>
          <div>
            <span className="font-bold block text-emerald-900 mb-0.5">نجاح:</span>
            {successMessage}
          </div>
        </div>
      )}

      {/* Register Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5 pt-1" noValidate>
        {/* Full Name Field */}
        <div className="space-y-1.5">
          <label htmlFor="fullName" className="block text-xs font-semibold text-brand-ink">
            الاسم الكامل <span className="text-xs text-brand-muted font-normal">(حسب السجل الجامعي)</span>
          </label>
          <input
            id="fullName"
            type="text"
            value={formData.fullName}
            onChange={(e) => {
              setFormData({ ...formData, fullName: e.target.value });
              if (errors.fullName) setErrors({ ...errors, fullName: "" });
            }}
            placeholder="مثال: أحمد محمد علي"
            className={`w-full h-[45px] px-3.5 rounded-xl bg-white border text-sm text-brand-ink placeholder:text-brand-muted/60 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 ${
              errors.fullName
                ? "border-red-400 focus:border-red-500"
                : "border-brand-border-soft focus:border-brand-secondary"
            }`}
            autoComplete="name"
          />
          {errors.fullName && (
            <p className="text-[11px] text-red-600 font-medium pt-0.5" role="alert">
              {errors.fullName}
            </p>
          )}
        </div>

        {/* Student ID & Faculty Grid */}
        {apiClient.isUsingMock() && <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label htmlFor="studentId" className="block text-xs font-semibold text-brand-ink">
              الرقم الجامعي
            </label>
            <input
              id="studentId"
              type="text"
              value={formData.studentId}
              onChange={(e) => {
                setFormData({ ...formData, studentId: e.target.value });
                if (errors.studentId) setErrors({ ...errors, studentId: "" });
              }}
              placeholder="مثال: 20241102"
              className={`w-full h-[45px] px-3.5 rounded-xl bg-white border text-sm text-brand-ink placeholder:text-brand-muted/60 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 ${
                errors.studentId
                  ? "border-red-400 focus:border-red-500"
                  : "border-brand-border-soft focus:border-brand-secondary"
              }`}
              dir="ltr"
            />
            {errors.studentId && (
              <p className="text-[11px] text-red-600 font-medium pt-0.5" role="alert">
                {errors.studentId}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="faculty" className="block text-xs font-semibold text-brand-ink">
              الكلية
            </label>
            <select
              id="faculty"
              value={formData.faculty}
              onChange={(e) => {
                setFormData({ ...formData, faculty: e.target.value });
                if (errors.faculty) setErrors({ ...errors, faculty: "" });
              }}
              className="w-full h-[45px] px-3 rounded-xl bg-white border border-brand-border-soft text-xs sm:text-sm text-brand-ink transition-colors focus:outline-none focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/30"
            >
              {faculties.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
        </div>

        }
        {/* University Email Field */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-xs font-semibold text-brand-ink">
            البريد الإلكتروني الجامعي
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              if (errors.email) setErrors({ ...errors, email: "" });
            }}
            placeholder="s20241102@student.alazhar.edu.ps"
            className={`w-full h-[45px] px-3.5 rounded-xl bg-white border text-sm text-brand-ink placeholder:text-brand-muted/60 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 ${
              errors.email
                ? "border-red-400 focus:border-red-500"
                : "border-brand-border-soft focus:border-brand-secondary"
            }`}
            dir="ltr"
            autoComplete="email"
          />
          {errors.email && (
            <p className="text-[11px] text-red-600 font-medium pt-0.5" role="alert">
              {errors.email}
            </p>
          )}
        </div>

        {/* Passwords Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-xs font-semibold text-brand-ink">
              كلمة المرور
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  if (errors.password) setErrors({ ...errors, password: "" });
                }}
                placeholder="••••••••"
                className={`w-full h-[45px] pl-20 pr-3.5 rounded-xl bg-white border text-sm text-brand-ink placeholder:text-brand-muted/60 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 ${
                  errors.password
                    ? "border-red-400 focus:border-red-500"
                    : "border-brand-border-soft focus:border-brand-secondary"
                }`}
                dir="ltr"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 z-10 px-2 py-1 text-xs font-semibold text-brand-primary hover:text-brand-hover-medium hover:bg-[#F4FAFF] rounded-md transition-colors"
                aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
              >
                {showPassword ? "إخفاء" : "إظهار"}
              </button>
            </div>
            {errors.password && (
              <p className="text-[11px] text-red-600 font-medium pt-0.5" role="alert">
                {errors.password}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="confirmPassword" className="block text-xs font-semibold text-brand-ink">
              تأكيد كلمة المرور
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => {
                  setFormData({ ...formData, confirmPassword: e.target.value });
                  if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: "" });
                }}
                placeholder="••••••••"
                className={`w-full h-[45px] pl-20 pr-3.5 rounded-xl bg-white border text-sm text-brand-ink placeholder:text-brand-muted/60 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 ${
                  errors.confirmPassword
                    ? "border-red-400 focus:border-red-500"
                    : "border-brand-border-soft focus:border-brand-secondary"
                }`}
                dir="ltr"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 z-10 px-2 py-1 text-xs font-semibold text-brand-primary hover:text-brand-hover-medium hover:bg-[#F4FAFF] rounded-md transition-colors"
                aria-label={showConfirmPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
              >
                {showConfirmPassword ? "إخفاء" : "إظهار"}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-[11px] text-red-600 font-medium pt-0.5" role="alert">
                {errors.confirmPassword}
              </p>
            )}
          </div>
        </div>

        {/* Terms and Conditions Checkbox */}
        <div className="space-y-1 pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer select-none text-xs text-brand-ink leading-relaxed">
            <input
              type="checkbox"
              checked={formData.agreedToTerms}
              onChange={(e) => {
                setFormData({ ...formData, agreedToTerms: e.target.checked });
                if (errors.agreedToTerms) setErrors({ ...errors, agreedToTerms: "" });
              }}
              className="w-4 h-4 rounded border-brand-border-soft text-brand-primary focus:ring-brand-secondary/40 mt-0.5"
            />
            <span>
              أوافق على الشروط والأحكام وسياسة الخصوصية الخاصة بمنظومة UniMeta الجامعية.
            </span>
          </label>
          {errors.agreedToTerms && (
            <p className="text-[11px] text-red-600 font-medium" role="alert">
              {errors.agreedToTerms}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-[45px] rounded-xl bg-brand-primary hover:bg-brand-hover-medium active:scale-[0.99] text-white font-semibold text-sm transition-all duration-150 shadow-[0_2px_8px_rgba(0,87,200,0.25)] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
        >
          {isSubmitting ? (
            <>
              <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span>جارٍ إنشاء الحساب...</span>
            </>
          ) : (
            <span>إنشاء حساب جديد</span>
          )}
        </button>
      </form>

      {/* Switch to Login Link */}
      <div className="pt-3 text-center text-xs text-brand-muted flex items-center justify-center gap-1.5 border-t border-brand-border-soft/80">
        <span>لديك حساب بالفعل؟</span>
        <Link
          href="/login"
          className="font-bold text-brand-primary hover:text-brand-hover-medium hover:underline transition-colors"
        >
          تسجيل الدخول
        </Link>
      </div>
    </div>
  );
}
