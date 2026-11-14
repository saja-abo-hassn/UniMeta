import React, { Suspense } from "react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { VerifyEmailForm } from "@/components/auth/verify-email-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تأكيد البريد الإلكتروني",
  description: "أدخل رمز التحقق لتأكيد بريدك الإلكتروني والوصول إلى خدمات UniMeta الأكاديمية.",
  alternates: { canonical: "/verify-email" },
};

export default function VerifyEmailPage() {
  return (
    <AuthLayout
      visualTitle="أمان حسابك، أولويتنا."
      visualSubtitle="رمز تحقق فوري للتأكد من هويتك الأكاديمية وحماية بياناتك ومشاريعك على UniMeta."
    >
      <Suspense
        fallback={
          <div className="p-8 text-center text-sm text-brand-muted animate-pulse">
            جاري تحميل نموذج التحقق...
          </div>
        }
      >
        <VerifyEmailForm />
      </Suspense>
    </AuthLayout>
  );
}

