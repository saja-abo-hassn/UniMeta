"use client";
import { apiClient } from "@/src/services/api-client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/src/contexts/auth-context";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefillEmail = searchParams.get("email") || "";
  const isActivated = searchParams.get("activated") === "1";
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState(prefillEmail);
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(
    isActivated ? "تم تفعيل حسابك بنجاح! يرجى إدخال كلمة المرور لتسجيل الدخول." : null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forgotPasswordNote, setForgotPasswordNote] = useState(false);

  const validate = (): boolean => {
    const nextErrors: { identifier?: string; password?: string } = {};

    if (!identifier.trim()) {
      nextErrors.identifier = "يرجى إدخال البريد الإلكتروني أو الرقم الجامعي.";
    } else if (identifier.includes("@") && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier.trim())) {
      nextErrors.identifier = "صيغة البريد الإلكتروني غير صحيحة.";
    }

    if (!password) {
      nextErrors.password = "يرجى إدخال كلمة المرور.";
    } else if (password.length < 6) {
      nextErrors.password = "يجب ألا تقل كلمة المرور عن 6 خانات.";
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
      const response = await login({
        identifier: identifier.trim(),
        password,
        rememberMe,
      });

      setIsSubmitting(false);

      if (response.data?.requiresVerification || response.errors?.requiresVerification) {
        const userEmail = response.data?.user?.email || (identifier.includes("@") ? identifier.trim() : "");
        setErrorMessage("حسابك غير مؤكّد بعد. تم إرسال رمز تحقق، جاري توجيهك لصفحة التأكيد...");
        setTimeout(() => {
          router.push(`/verify-email?email=${encodeURIComponent(userEmail)}`);
        }, 700);
        return;
      }

      if (response.data?.token) {
        setSuccessMessage(response.message || "تم تسجيل الدخول بنجاح!");
        // Brief moment to show success message then navigate
        setTimeout(() => {
          const userRole = response.data?.user?.role;
          if (userRole === "admin" || userRole === "super_admin" || userRole === "moderator") {
            router.push("/admin");
          } else {
            router.push("/student");
          }
        }, 350);
      } else {
        setErrorMessage(response.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة.");
      }
    } catch {
      setIsSubmitting(false);
      setErrorMessage("حدث خطأ في الاتصال بالخادم، يرجى المحاولة لاحقاً.");
    }
  };

  return (
    <div className="w-full space-y-5 animate-fade-in" dir="rtl">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
            تسجيل الدخول
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-ink mt-0.5">
            مرحباً بعودتك
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-brand-muted pt-0.5">
          سجّل الدخول إلى حسابك الأكاديمي للاستمرار.
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
            <span className="font-bold block text-red-800 mb-0.5">خطأ في الدخول:</span>
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

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4 pt-1" noValidate>
        {/* Identifier Field */}
        <div className="space-y-1.5">
          <label
            htmlFor="identifier"
            className="block text-xs font-semibold text-brand-ink"
          >
            البريد الإلكتروني أو الرقم الجامعي
          </label>
          <div className="relative">
            <input
              id="identifier"
              type="text"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                if (errors.identifier) setErrors({ ...errors, identifier: undefined });
              }}
              placeholder="name@student.alazhar.edu.ps"
              className={`w-full h-[45px] px-3.5 rounded-xl bg-white border text-sm text-brand-ink placeholder:text-brand-muted/60 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 ${
                errors.identifier
                  ? "border-red-400 focus:border-red-500"
                  : "border-brand-border-soft focus:border-brand-secondary"
              }`}
              dir="ltr"
              autoComplete="username"
            />
          </div>
          {errors.identifier && (
            <p className="text-[11px] text-red-600 font-medium pt-0.5" role="alert">
              {errors.identifier}
            </p>
          )}
        </div>

        {/* Password Field with Text Toggle ("إظهار" / "إخفاء") */}
        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="block text-xs font-semibold text-brand-ink"
          >
            كلمة المرور
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: undefined });
              }}
              placeholder="••••••••"
              className={`w-full h-[45px] pl-20 pr-3.5 rounded-xl bg-white border text-sm text-brand-ink placeholder:text-brand-muted/60 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 ${
                errors.password
                  ? "border-red-400 focus:border-red-500"
                  : "border-brand-border-soft focus:border-brand-secondary"
              }`}
              dir="ltr"
              autoComplete="current-password"
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

        {/* Remember Me & Forgot Password Row */}
        <div className="flex items-center justify-between text-xs pt-0.5">
          <label className="flex items-center gap-2 cursor-pointer select-none text-brand-ink">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-brand-border-soft text-brand-primary focus:ring-brand-secondary/40"
            />
            <span>تذكرني</span>
          </label>

          <button
            type="button"
<<<<<<< HEAD
            onClick={() => apiClient.isUsingMock() ? setForgotPasswordNote(true) : router.push("/forgot-password")}
            className="text-[#0057C8] hover:text-[#2D78B7] hover:underline font-medium transition-colors"
=======
            onClick={() => setForgotPasswordNote(true)}
            className="text-brand-primary hover:text-brand-hover-medium hover:underline font-medium transition-colors"
>>>>>>> b079de5bb3c77012965f2ad45ddce455d601b6a9
          >
            نسيت كلمة المرور؟
          </button>
        </div>

        {forgotPasswordNote && (
          <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
            استعادة كلمة المرور ستكون مفعلة ومربوطة بنظام البريد الجامعي عند تشغيل خادم الـ Backend.
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-[45px] rounded-xl bg-brand-primary hover:bg-brand-hover-medium active:scale-[0.99] text-white font-semibold text-sm transition-all duration-150 shadow-[0_2px_8px_rgba(0,87,200,0.25)] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span>جارٍ التحقق...</span>
            </>
          ) : (
            <span>تسجيل الدخول</span>
          )}
        </button>
      </form>

      {/* Switch to Register link */}
      <div className="pt-3 text-center text-xs text-brand-muted flex items-center justify-center gap-1.5 border-t border-brand-border-soft/80">
        <span>ليس لديك حساب؟</span>
        <Link
          href="/register"
          className="font-bold text-brand-primary hover:text-brand-hover-medium hover:underline transition-colors"
        >
          إنشاء حساب جديد
        </Link>
      </div>
    </div>
  );
}
