"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/src/services/auth-service";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmationError, setConfirmationError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    if (!token || !email) {
      setErrorMessage("رابط الاستعادة غير مكتمل. اطلب رابطًا جديدًا.");
      return;
    }
    if (password.length < 8) {
      setPasswordError("يجب أن تتكون كلمة المرور من 8 خانات على الأقل.");
      return;
    }
    setPasswordError(null);
    if (password !== confirmation) {
      setConfirmationError("كلمتا المرور غير متطابقتين.");
      return;
    }
    setConfirmationError(null);
    setIsSubmitting(true);
    try {
      const response = await authService.resetPassword({ token, email, password });
      if (!response.errors) router.replace("/login?reset=1");
      else setErrorMessage(response.message || "انتهت صلاحية رابط الاستعادة أو لم يعد صالحًا. اطلب رابطًا جديدًا.");
    } catch {
      setErrorMessage("تعذر الاتصال بالخادم الآن. حاول مجددًا لاحقًا.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-5 animate-fade-in" dir="rtl">
      <header className="space-y-1">
        <span className="text-xs font-bold tracking-wider text-brand-primary">تحديث بيانات الدخول</span>
        <h2 className="mt-0.5 text-2xl font-extrabold text-brand-ink sm:text-3xl">إنشاء كلمة مرور جديدة</h2>
        <p className="pt-0.5 text-xs text-brand-muted sm:text-sm">اختر كلمة مرور جديدة لا تقل عن 8 خانات.</p>
      </header>

      {errorMessage && (
        <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs leading-relaxed text-red-700 shadow-sm">
          <span aria-hidden="true" className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 font-bold text-red-600">!</span>
          <div>
            <span className="mb-0.5 block font-bold text-red-800">تعذر تحديث كلمة المرور:</span>
            {errorMessage}
          </div>
        </div>
      )}

      <form onSubmit={submit} noValidate className="space-y-4 pt-1">
        {(!token || !email) && (
          <p role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-900">
            رابط الاستعادة غير مكتمل. اطلب رابطًا جديدًا للمتابعة.
          </p>
        )}

        <div className="space-y-1.5">
          <label htmlFor="new-password" className="block text-xs font-semibold text-brand-ink">كلمة المرور الجديدة</label>
          <input
            id="new-password"
            type="password"
            autoComplete="new-password"
            dir="ltr"
            value={password}
            onChange={(event) => { setPassword(event.target.value); setPasswordError(null); }}
            aria-invalid={!!passwordError}
            aria-describedby={passwordError ? "new-password-error" : undefined}
            className={`h-[45px] w-full rounded-xl border bg-white px-3.5 text-sm text-brand-ink transition-colors focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 ${passwordError ? "border-red-400 focus:border-red-500" : "border-brand-border-soft focus:border-brand-secondary"}`}
          />
          {passwordError && <p id="new-password-error" role="alert" className="pt-0.5 text-[11px] font-medium text-red-600">{passwordError}</p>}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="new-password-confirmation" className="block text-xs font-semibold text-brand-ink">تأكيد كلمة المرور الجديدة</label>
          <input
            id="new-password-confirmation"
            type="password"
            autoComplete="new-password"
            dir="ltr"
            value={confirmation}
            onChange={(event) => { setConfirmation(event.target.value); setConfirmationError(null); }}
            aria-invalid={!!confirmationError}
            aria-describedby={confirmationError ? "password-reset-error" : undefined}
            className={`h-[45px] w-full rounded-xl border bg-white px-3.5 text-sm text-brand-ink transition-colors focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 ${confirmationError ? "border-red-400 focus:border-red-500" : "border-brand-border-soft focus:border-brand-secondary"}`}
          />
          {confirmationError && <p id="password-reset-error" role="alert" className="pt-0.5 text-[11px] font-medium text-red-600">{confirmationError}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !token || !email}
          aria-busy={isSubmitting}
          className="flex h-[45px] w-full items-center justify-center gap-2 rounded-xl bg-brand-primary text-sm font-semibold text-white shadow-[0_2px_8px_rgba(0,87,200,0.25)] transition-all duration-150 hover:bg-brand-hover-medium active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" d="M4 12a8 8 0 018-8v8H4z" fill="currentColor" />
              </svg>
              <span>جارٍ تحديث كلمة المرور...</span>
            </>
          ) : (
            <span>حفظ كلمة المرور الجديدة</span>
          )}
        </button>
      </form>

      <div className="flex items-center justify-center gap-1.5 border-t border-brand-border-soft/80 pt-3 text-center text-xs text-brand-muted">
        <span>لديك كلمة المرور؟</span>
        <Link href="/login" className="font-bold text-brand-primary transition-colors hover:text-brand-hover-medium hover:underline">العودة لتسجيل الدخول</Link>
      </div>
    </div>
  );
}
