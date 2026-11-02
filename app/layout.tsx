import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "UniMate | رفيق الحياة الجامعية", template: "%s | UniMate" },
  description: "مساحة عربية تساعدك على متابعة رحلتك الجامعية.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
