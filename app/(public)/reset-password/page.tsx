import React, { Suspense } from "react";
import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/auth-layout";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "تعيين كلمة مرور جديدة",
  alternates: { canonical: "/reset-password" },
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return (
    <AuthLayout visualTitle="حسابك، بإعدادات دخول آمنة" visualSubtitle="اختر كلمة مرور جديدة للمتابعة إلى UniMeta.">
      <Suspense fallback={<div className="p-4 text-center text-sm text-brand-muted">جارٍ تحميل النموذج...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  );
}
