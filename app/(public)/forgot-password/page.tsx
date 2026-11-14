import { Suspense } from "react";
import { PasswordResetForm } from "@/components/auth/password-reset-form";
export default function ForgotPasswordPage(){return <Suspense fallback={<p>جارٍ التحميل…</p>}><PasswordResetForm/></Suspense>;}
