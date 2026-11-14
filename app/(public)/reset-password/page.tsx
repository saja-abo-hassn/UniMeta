import { Suspense } from "react";
import { PasswordResetForm } from "@/components/auth/password-reset-form";
export default function ResetPasswordPage(){return <Suspense fallback={<p>جارٍ التحميل…</p>}><PasswordResetForm reset/></Suspense>;}
