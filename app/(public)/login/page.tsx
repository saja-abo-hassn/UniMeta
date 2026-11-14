import React, { Suspense } from "react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { LoginForm } from "@/components/auth/login-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تسجيل الدخول",
  description: "تسجيل الدخول إلى منصة UniMeta الجامعية للخدمات الأكاديمية الذكية",
  alternates: { canonical: "/login" },
};

export default function LoginPage() {
  return (
    <AuthLayout
      visualTitle="أكاديميتك، بصورة أوضح."
      visualSubtitle="من التخطيط الأكاديمي إلى فرق المشاريع والاتفاقيات، كل أدواتك في تجربة واحدة متماسكة."
    >
      <Suspense fallback={<div className="p-8 text-center text-xs text-brand-muted">جاري التحميل...</div>}>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}
