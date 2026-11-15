"use client";

import React, { useState } from "react";
import Link from "next/link";
import { authService } from "@/src/services/auth-service";
import { EmailNoticeCard } from "@/components/shared/email-notice-card";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccess(false);
    const cleanEmail = email.trim();
    if (!EMAIL_PATTERN.test(cleanEmail)) {
      setFieldError("أدخل بريدًا إلكترونيًا صحيحًا.");
      return;
    }
    setFieldError(null);
    setIsSubmitting(true);
    try {
      const response = await authService.requestPasswordReset(cleanEmail);
      if (!response.errors && response.status !== undefined && response.status >= 200 && response.status < 300) setSuccess(true);
      else setErrorMessage(response.message || "تعذر إرسال طلب الاستعادة الآن. حاول مجددًا لاحقًا.");
    } catch {
      setErrorMessage("تعذر الاتصال بالخادم الآن. حاول مجددًا لاحقًا.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-4 animate-fade-in" dir="rtl">
      <header className="space-y-1">
        <span className="text-xs font-bold text-brand-primary">استعادة الحساب</span>
        <h2 className="text-2xl font-extrabold text-brand-ink">نسيت كلمة المرور؟</h2>
        <p className="text-sm text-brand-muted">أدخل بريدك الإلكتروني وسنرسل تعليمات الاستعادة إذا كان مرتبطًا بحساب.</p>
      </header>

      {errorMessage && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{errorMessage}</p>}
      {success && <>
        <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm leading-relaxed text-emerald-800">إذا كان البريد مرتبطًا بحساب، فستصلك رسالة تتضمن رابطًا صالحًا لفترة محدودة.</p>
        <EmailNoticeCard kind="password-reset" onDismiss={() => setSuccess(false)} />
      </>}

      <form onSubmit={submit} noValidate className="space-y-3">
        <div className="space-y-1.5">
          <label htmlFor="reset-email" className="block text-xs font-semibold text-brand-ink">البريد الإلكتروني</label>
          <input
            id="reset-email"
            type="email"
            autoComplete="email"
            dir="ltr"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setFieldError(null);
              setErrorMessage(null);
            }}
            aria-invalid={!!fieldError}
            aria-describedby={fieldError ? "reset-email-error" : undefined}
            className={`h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-brand-ink focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 ${fieldError ? "border-red-400" : "border-brand-border-soft focus:border-brand-secondary"}`}
          />
          {fieldError && <p id="reset-email-error" role="alert" className="text-xs text-red-600">{fieldError}</p>}
        </div>
        <button type="submit" disabled={isSubmitting} aria-busy={isSubmitting} className="h-11 w-full rounded-xl bg-brand-primary text-sm font-semibold text-white transition-colors hover:bg-brand-primary-hover disabled:cursor-not-allowed disabled:opacity-70">
          {isSubmitting ? "جارٍ إرسال الطلب..." : "إرسال رابط الاستعادة"}
        </button>
      </form>

      <div className="border-t border-brand-border-soft/80 pt-3 text-center text-xs text-brand-muted">
        تذكرت كلمة المرور؟ <Link href="/login" className="font-bold text-brand-primary hover:underline">العودة لتسجيل الدخول</Link>
      </div>
    </div>
  );
}
