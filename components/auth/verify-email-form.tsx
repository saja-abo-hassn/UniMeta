"use client";

import React, { useState, useEffect, useRef, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/src/contexts/auth-context";

export function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyEmailAndLogin, resendVerificationCode } = useAuth();

  // Email state (from query param or entered manually)
  const queryEmail = searchParams.get("email") || "";
  const [email, setEmail] = useState(queryEmail);
  const [isEditingEmail, setIsEditingEmail] = useState(!queryEmail);
  const [tempEmail, setTempEmail] = useState(queryEmail);

  // 6 separate digit boxes
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer & countdown state
  const [countdown, setCountdown] = useState<number>(60);
  const [isResending, setIsResending] = useState<boolean>(false);

  // Status & feedback banners
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(
    "تم إرسال رمز التحقق إلى بريدك. لأغراض التجربة، يمكنك العثور عليه في Console (F12)."
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [, startTransition] = useTransition();

  // Auto-focus first input on mount
  useEffect(() => {
    if (!isEditingEmail && inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, [isEditingEmail]);

  // Resend countdown timer interval
  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  // Handle single digit input
  const handleDigitChange = (index: number, value: string) => {
    // Only accept numeric characters
    const numericChar = value.replace(/\D/g, "").slice(-1);

    const nextDigits = [...digits];
    nextDigits[index] = numericChar;
    setDigits(nextDigits);
    setErrorMessage(null);

    // If a digit was entered, auto-advance to next input
    if (numericChar && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // If all 6 digits are filled, auto-submit
    if (numericChar && index === 5) {
      const fullCode = nextDigits.join("");
      if (fullCode.length === 6) {
        submitCode(fullCode);
      }
    }
  };

  // Handle backspace navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        // Move to previous box and clear it
        const nextDigits = [...digits];
        nextDigits[index - 1] = "";
        setDigits(nextDigits);
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle paste support (extracts up to 6 digits)
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const cleanNumbers = pastedText.replace(/\D/g, "").slice(0, 6);

    if (!cleanNumbers) return;

    const nextDigits = [...digits];
    for (let i = 0; i < 6; i++) {
      nextDigits[i] = cleanNumbers[i] || "";
    }
    setDigits(nextDigits);
    setErrorMessage(null);

    const targetFocusIndex = Math.min(cleanNumbers.length, 5);
    inputRefs.current[targetFocusIndex]?.focus();

    if (cleanNumbers.length === 6) {
      submitCode(cleanNumbers);
    }
  };

  // Submit verification code
  const submitCode = async (codeToSubmit?: string) => {
    const fullCode = codeToSubmit || digits.join("");
    if (fullCode.length !== 6) {
      setErrorMessage("يرجى إدخال رمز التحقق كاملاً المكوّن من 6 أرقام.");
      return;
    }

    if (!email.trim()) {
      setErrorMessage("يرجى إدخال البريد الإلكتروني المراد التحقق منه.");
      setIsEditingEmail(true);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await verifyEmailAndLogin(email.trim(), fullCode);
      setIsSubmitting(false);

      if (!response.errors && response.status === 200 && !response.data?.token) {
        setSuccessMessage(response.message);
        router.push(`/login?email=${encodeURIComponent(email.trim())}`);
        return;
      }

      if (!response.errors && response.data?.token) {
        setSuccessMessage("تم تأكيد البريد الإلكتروني بنجاح! جاري توجيهك إلى لوحة التحكم...");
        setTimeout(() => {
          startTransition(() => {
            router.push("/student");
          });
        }, 500);
      } else {
        setErrorMessage(response.message || "رمز التحقق غير صحيح أو منتهي الصلاحية.");
      }
    } catch {
      setIsSubmitting(false);
      setErrorMessage("حدث خطأ أثناء التحقق من الرمز، يرجى المحاولة لاحقاً.");
    }
  };

  // Resend verification code
  const handleResend = async () => {
    if (countdown > 0 || isResending) return;

    if (!email.trim()) {
      setErrorMessage("يرجى تحديد البريد الإلكتروني لإعادة إرسال الرمز إليه.");
      setIsEditingEmail(true);
      return;
    }

    setIsResending(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await resendVerificationCode(email.trim());
      setIsResending(false);

      if (!response.errors && response.data) {
        setCountdown(60);
        setDigits(["", "", "", "", "", ""]);
        setInfoMessage("تم توليد وإرسال رمز تحقق جديد بنجاح! تفقّد الـ Console (F12).");
        inputRefs.current[0]?.focus();
      } else {
        setErrorMessage(response.message || "تعذر إعادة إرسال الرمز في الوقت الحالي.");
      }
    } catch {
      setIsResending(false);
      setErrorMessage("تعذر الاتصال بالخادم لإعادة إرسال الرمز.");
    }
  };

  // Save edited email
  const handleSaveEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tempEmail.trim())) {
      setErrorMessage("يرجى إدخال بريد إلكتروني صحيح.");
      return;
    }
    setEmail(tempEmail.trim());
    setIsEditingEmail(false);
    setErrorMessage(null);
    // Request code for newly entered email
    resendVerificationCode(tempEmail.trim()).then(() => {
      setCountdown(60);
      setInfoMessage("تم إرسال رمز التحقق إلى البريد المعدّل (تفقّد الـ Console).");
    });
  };

  return (
    <div className="w-full space-y-5 animate-fade-in" dir="rtl">
      {/* Header with Mascot */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <span className="text-xs font-bold text-[#0057C8] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#0057C8] animate-pulse" />
            التحقق من الحساب
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16324A] mt-0.5">
            تأكيد البريد الإلكتروني
          </h2>
          <p className="text-xs sm:text-sm text-[#66788A] pt-0.5">
            خطوة أخيرة لتأمين حسابك وتفعيل الوصول إلى منصة UniMeta.
          </p>
        </div>

        {/* Mascot badge */}
        <div className="shrink-0 p-2 rounded-2xl bg-gradient-to-br from-[#F4FAFF] to-[#E0F2FE] border border-[#BAE6FD]/60 shadow-xs">
          <div className="relative w-12 h-12">
            <Image
              src="/mascot/head.png"
              alt="UniMeta Mascot"
              fill
              className="object-contain drop-shadow-sm select-none"
              priority
            />
          </div>
        </div>
      </div>

      {/* Target Email Banner / Edit Switch */}
      <div className="p-3.5 rounded-2xl bg-[#F0F7FD] border border-[#D7EAF7] flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-[#48627A]">
            <svg className="w-4 h-4 text-[#0057C8] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span>أرسلنا رمز التحقق المكوّن من 6 أرقام إلى:</span>
          </div>

          {!isEditingEmail && email && (
            <button
              type="button"
              onClick={() => {
                setTempEmail(email);
                setIsEditingEmail(true);
              }}
              className="text-[11px] font-semibold text-[#0057C8] hover:underline"
            >
              تعديل
            </button>
          )}
        </div>

        {isEditingEmail ? (
          <form onSubmit={handleSaveEmail} className="flex items-center gap-2 pt-1">
            <input
              type="email"
              value={tempEmail}
              onChange={(e) => setTempEmail(e.target.value)}
              placeholder="name@student.alazhar.edu.ps"
              dir="ltr"
              className="flex-1 h-9 px-3 text-xs bg-white rounded-lg border border-[#D7EAF7] focus:outline-none focus:border-[#0057C8] text-[#16324A]"
            />
            <button
              type="submit"
              className="h-9 px-3.5 text-xs font-semibold bg-[#0057C8] text-white rounded-lg hover:bg-[#0046A0] transition-colors shadow-xs"
            >
              حفظ وإرسال
            </button>
          </form>
        ) : (
          <div className="flex items-center justify-between text-xs font-bold text-[#16324A] bg-white px-3 py-1.5 rounded-xl border border-[#D7EAF7]/80">
            <span dir="ltr" className="font-mono text-[#0057C8]">
              {email || "لم يتم تحديد بريد"}
            </span>
            <span className="text-[11px] text-[#66788A] font-normal">صلاحية الرمز: 10 دقائق</span>
          </div>
        )}
      </div>

      {/* Info Notice (Console Preview Banner) */}
      {infoMessage && (
        <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200/70 text-blue-800 text-xs flex items-start gap-2.5 shadow-2xs">
          <svg className="w-4 h-4 text-[#0057C8] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="leading-relaxed">
            <span className="font-bold block text-blue-900 mb-0.5">وضع التطوير (Dev Mode):</span>
            {infoMessage}
          </div>
        </div>
      )}

      {/* Error Message Banner */}
      {errorMessage && (
        <div
          role="alert"
          className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs leading-relaxed flex items-start gap-2.5 shadow-sm animate-fade-in"
        >
          <div className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
            ✕
          </div>
          <div>
            <span className="font-bold block text-red-800 mb-0.5">خطأ في التحقق:</span>
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
          <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
            ✓
          </div>
          <div>
            <span className="font-bold block text-emerald-900 mb-0.5">تم التأكيد:</span>
            {successMessage}
          </div>
        </div>
      )}

      {/* 6 Digit Input Boxes */}
      <div className="space-y-4 pt-1">
        <div className="space-y-2">
          <label className="block text-center text-xs font-bold text-[#16324A]">
            أدخل رمز التحقق (6 أرقام)
          </label>

          {/* LTR container so digits flow 1 to 6 from left to right */}
          <div className="flex items-center justify-center gap-2 sm:gap-3" dir="ltr">
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onPaste={handlePaste}
                disabled={isSubmitting || !!successMessage}
                aria-label={`الرقم ${idx + 1}`}
                className={`w-11 h-13 sm:w-13 sm:h-16 text-center text-xl sm:text-2xl font-extrabold font-mono rounded-xl sm:rounded-2xl border transition-all shadow-2xs focus:outline-none ${
                  errorMessage
                    ? "border-red-400 bg-red-50/30 text-red-700 focus:ring-2 focus:ring-red-400"
                    : digit
                    ? "border-[#0057C8] bg-blue-50/30 text-[#0057C8] focus:ring-2 focus:ring-[#0057C8]/30"
                    : "border-[#D7EAF7] bg-white text-[#16324A] focus:border-[#0057C8] focus:ring-2 focus:ring-[#0057C8]/20"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="button"
          onClick={() => submitCode()}
          disabled={isSubmitting || digits.join("").length !== 6 || !!successMessage}
          className="w-full h-11 sm:h-12 rounded-xl bg-[#0057C8] hover:bg-[#0046A0] disabled:bg-[#A3C7E8] text-white font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:shadow-none disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>جاري التحقق والدخول...</span>
            </>
          ) : (
            <span>تأكيد الرمز والدخول للمنصة</span>
          )}
        </button>

        {/* Resend Section & Countdown */}
        <div className="pt-2 border-t border-[#E5F0FA] flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
          <span className="text-[#66788A]">لم يصلك الرمز؟</span>

          {countdown > 0 ? (
            <div className="flex items-center gap-1.5 font-medium text-[#48627A] bg-[#F0F7FD] px-3 py-1.5 rounded-full border border-[#D7EAF7]">
              <svg className="w-3.5 h-3.5 text-[#0057C8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>إعادة الإرسال بعد:</span>
              <span className="font-mono font-bold text-[#0057C8]" dir="ltr">
                {`0:${countdown.toString().padStart(2, "0")}`}
              </span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="font-bold text-[#0057C8] hover:text-[#0046A0] hover:underline transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>إعادة إرسال رمز جديد</span>
            </button>
          )}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="pt-3 border-t border-[#E5F0FA] flex items-center justify-between text-xs text-[#66788A]">
        <Link href="/login" className="hover:text-[#0057C8] transition-colors flex items-center gap-1">
          <svg className="w-3.5 h-3.5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span>العودة لتسجيل الدخول</span>
        </Link>

        <Link href="/register" className="font-semibold text-[#0057C8] hover:underline">
          إنشاء حساب آخر
        </Link>
      </div>
    </div>
  );
}
