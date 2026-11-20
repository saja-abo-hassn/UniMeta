import React from "react";
import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/auth-layout";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "استعادة كلمة المرور",
  alternates: { canonical: "/forgot-password" },
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayout showBrandHeader={false} visualTitle="استعد الوصول إلى حسابك" visualSubtitle="سنساعدك على إنشاء كلمة مرور جديدة بأمان.">
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
