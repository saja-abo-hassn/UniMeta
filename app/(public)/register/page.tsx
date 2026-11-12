import React from "react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { RegisterForm } from "@/components/auth/register-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "إنشاء حساب جديد",
  description: "إنشاء حساب طالب على UniMeta، منصة مستقلة لأدوات الدراسة والمسار الجامعي لطلاب جامعة الأزهر غزة.",
  alternates: { canonical: "/register" },
};

export default function RegisterPage() {
  return (
    <AuthLayout
      visualTitle="انضم إلى مجتمع UniMeta"
      visualSubtitle="سجّل بياناتك الجامعية لتستفيد من المساعد الذكي UniMeta، وتنسيق المشاريع، والخدمات الأكاديمية الموحدة."
    >
      <RegisterForm />
    </AuthLayout>
  );
}
