"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/auth-layout";
import { invitationsService, InvitationDetails } from "@/src/services/invitations";

interface InvitePageProps {
  params: Promise<{ token: string }>;
}

export default function InvitePage({ params }: InvitePageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const token = resolvedParams.token;

  const [loading, setLoading] = useState(true);
  const [invitation, setInvitation] = useState<InvitationDetails | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isActivated, setIsActivated] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadInvite() {
      try {
        const res = await invitationsService.get(token);
        if (!isMounted) return;
        if (res.errors || !res.data) {
          setFetchError(res.message || "رابط الدعوة غير صالح أو منتهي الصلاحية.");
        } else {
          setInvitation(res.data);
        }
      } catch {
        if (isMounted) {
          setFetchError("تعذر التحقق من رابط الدعوة، يرجى المحاولة لاحقاً.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadInvite();
    return () => {
      isMounted = false;
    };
  }, [token]);

  const calculateStrength = (pwd: string): { label: string; color: string; score: number } => {
    if (!pwd) return { label: "", color: "bg-slate-200", score: 0 };
    let s = 0;
    if (pwd.length >= 8) s += 1;
    if (/[a-zA-Z\u0600-\u06FF]/.test(pwd)) s += 1;
    if (/[0-9]/.test(pwd)) s += 1;
    if (/[^a-zA-Z0-9\u0600-\u06FF]/.test(pwd)) s += 1;

    if (s <= 2) return { label: "ضعيفة", color: "bg-red-500", score: 1 };
    if (s === 3) return { label: "متوسطة", color: "bg-amber-500", score: 2 };
    return { label: "قوية جداً", color: "bg-emerald-500", score: 3 };
  };

  const strength = calculateStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (password.length < 8) {
      setSubmitError("كلمة المرور يجب أن تكون 8 خانات على الأقل.");
      return;
    }
    if (!/[a-zA-Z\u0600-\u06FF]/.test(password) || !/[0-9]/.test(password)) {
      setSubmitError("كلمة المرور يجب أن تحتوي على حروف وأرقام معاً.");
      return;
    }
    if (password !== confirmPassword) {
      setSubmitError("كلمتا المرور غير متطابقتين.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await invitationsService.accept(token, password);
      if (res.errors || !res.data) {
        setSubmitError(res.message || "تعذر تفعيل الحساب.");
        setIsSubmitting(false);
        return;
      }

      setIsActivated(true);
      setTimeout(() => {
        const targetEmail = invitation?.email || "";
        router.push(`/login?email=${encodeURIComponent(targetEmail)}&activated=1`);
      }, 1200);
    } catch {
      setSubmitError("حدث خطأ غير متوقع أثناء تفعيل الحساب.");
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      visualTitle="تفعيل حساب المشرف"
      visualSubtitle="انضم إلى فريق إدارة وتنسيق منصة UniMeta الجامعية وتسلّم صلاحياتك الأكاديمية."
    >
      <div className="w-full space-y-6 animate-fade-in" dir="rtl">
        <div>
          <span className="text-xs font-bold text-[#0057C8] uppercase tracking-wider">
            دعوة مسؤول جديد
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16324A] mt-1">
            تفعيل حساب الإشراف
          </h2>
          <p className="text-xs sm:text-sm text-[#66788A] pt-1">
            أهلاً بك! لقد تمت دعوتك للانضمام إلى فريق إدارة منصة UniMeta.
          </p>
        </div>

        {loading ? (
          <div className="p-8 rounded-2xl bg-white border border-[#D7EAF7] text-center space-y-3">
            <div className="w-8 h-8 mx-auto border-3 border-[#0057C8] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-bold text-[#66788A]">جاري التحقق من صحة رابط الدعوة...</p>
          </div>
        ) : fetchError ? (
          <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-red-800 space-y-4 shadow-xs">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h4 className="font-bold text-sm">تعذر فتح رابط الدعوة</h4>
                <p className="text-xs mt-1 leading-relaxed text-red-700">{fetchError}</p>
              </div>
            </div>
            <div className="pt-2 flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl bg-white border border-red-200 text-xs font-bold text-red-700 hover:bg-red-50 transition-colors"
              >
                الذهاب لتسجيل الدخول
              </Link>
            </div>
          </div>
        ) : isActivated ? (
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-3 text-center animate-fade-in">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl font-bold">
              ✓
            </div>
            <h3 className="font-extrabold text-base">تم تفعيل حسابك بنجاح!</h3>
            <p className="text-xs text-emerald-700">
              أهلاً بك زميلنا في إدارة UniMeta. جاري تحويلك الآن إلى صفحة تسجيل الدخول...
            </p>
          </div>
        ) : invitation ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {submitError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
                {submitError}
              </div>
            )}

            <div className="p-4 rounded-2xl bg-[#F8FBFE] border border-[#D7EAF7] space-y-2.5">
              <span className="text-[11px] font-bold text-[#0057C8] block">بيانات الحساب المدعو:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[#66788A] text-[10px] block">الاسم:</span>
                  <span className="font-bold text-[#16324A]">{invitation.name}</span>
                </div>
                <div>
                  <span className="text-[#66788A] text-[10px] block">البريد الإلكتروني:</span>
                  <span className="font-bold text-[#16324A] font-mono text-[11px]" dir="ltr">{invitation.email}</span>
                </div>
                <div>
                  <span className="text-[#66788A] text-[10px] block">المسمى الوظيفي:</span>
                  <span className="font-bold text-[#16324A]">{invitation.title}</span>
                </div>
                <div>
                  <span className="text-[#66788A] text-[10px] block">القسم:</span>
                  <span className="font-bold text-[#16324A]">{invitation.assignedDepartment}</span>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#16324A] block">
                كلمة المرور الجديدة <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="8 أحرف على الأقل (حروف وأرقام)"
                  className="w-full ps-3.5 pe-10 py-2.5 rounded-xl border border-[#D7EAF7] bg-white text-xs font-semibold text-[#16324A] focus:outline-none focus:border-[#0057C8]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 end-0 px-3 text-xs text-[#66788A] hover:text-[#16324A]"
                >
                  {showPassword ? "إخفاء" : "عرض"}
                </button>
              </div>
              {password && (
                <div className="space-y-1 pt-1">
                  <div className="flex gap-1 h-1.5">
                    <div className={`flex-1 rounded-full ${strength.score >= 1 ? strength.color : "bg-slate-200"}`} />
                    <div className={`flex-1 rounded-full ${strength.score >= 2 ? strength.color : "bg-slate-200"}`} />
                    <div className={`flex-1 rounded-full ${strength.score >= 3 ? strength.color : "bg-slate-200"}`} />
                  </div>
                  <span className="text-[10px] text-[#66788A]">قوة كلمة المرور: <strong>{strength.label}</strong></span>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#16324A] block">
                تأكيد كلمة المرور <span className="text-red-500">*</span>
              </label>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="أعد إدخال كلمة المرور"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D7EAF7] bg-white text-xs font-semibold text-[#16324A] focus:outline-none focus:border-[#0057C8]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-[#0057C8] hover:bg-[#2D78B7] disabled:opacity-50 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting ? "جاري تفعيل الحساب..." : "تفعيل الحساب والدخول إلى لوحة الإدارة 🚀"}
            </button>
          </form>
        ) : null}
      </div>
    </AuthLayout>
  );
}
