"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/shared/navbar";
import { Button } from "@/components/shared/button";
import { publicDestinations } from "@/src/lib/navigation/public";

export interface PublicShellProps {
  children: React.ReactNode;
}

export function PublicShell({ children }: PublicShellProps) {
  const pathname = usePathname();

  // On the landing page and auth pages, the page owns its full-bleed Figma split layout
  if (pathname === "/" || pathname === "/login" || pathname === "/register") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-brand-light text-brand-dark">
      {/* Public Navbar */}
      <Navbar
        title="UniMeta"
        badge="بوابة الجامعة"
        destinations={publicDestinations}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                تسجيل الدخول
              </Button>
            </Link>
            <Link href="/student">
              <Button variant="primary" size="sm">
                لوحة الطالب
              </Button>
            </Link>
          </div>
        }
      />

      {/* Main Public Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {children}
      </main>

      {/* Public Footer */}
      <footer className="w-full footer-light-blue py-8 px-4 sm:px-6 lg:px-8 text-center text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-sm text-brand-primary">
            <span>منصة UniMeta الجامعية</span>
            <span className="text-slate-600 font-normal text-xs">
              | النظام الموحد لخدمات الطلاب
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-700">
            <Link href="/student" className="hover:text-brand-primary transition-colors font-medium">
              بوابة الطالب
            </Link>
            <Link href="/admin" className="hover:text-brand-primary transition-colors font-medium">
              بوابة الإدارة
            </Link>
            <span>&copy; 2026 جميع الحقوق محفوظة</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

