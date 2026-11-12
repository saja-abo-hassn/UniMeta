import React from "react";
import Link from "next/link";
import { Logo } from "@/components/shared/logo";

export function LandingFooter() {
  return (
    <footer
      className="w-full footer-unimeta bg-gradient-to-b from-[#2F8FD8]/85 to-[#1A62A5]/90 backdrop-blur-xl border-t border-white/30 text-white shadow-[0_-10px_30px_-5px_rgba(0,87,200,0.15)] pt-12 pb-8"
      style={{
        background: "linear-gradient(180deg, rgba(47, 143, 216, 0.85) 0%, rgba(26, 98, 165, 0.92) 100%)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/15 text-start">
          <div className="md:col-span-2 space-y-3">
            <Logo size="md" variant="dark" href="/" subtitle="University Meta" />
            <p className="text-xs footer-secondary-text leading-relaxed max-w-md pt-2">
              منصة طلابية تجمع التخطيط الأكاديمي وتنظيم الوقت والموارد والتعاون في تجربة واحدة متكاملة.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              أقسام المنصة
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="#hero" className="footer-link font-medium">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link href="#why-unimeta" className="footer-link font-medium">
                  لماذا UniMeta؟
                </Link>
              </li>
              <li>
                <Link href="#features" className="footer-link font-medium">
                  مميزاتنا
                </Link>
              </li>
              <li>
                <Link href="#about" className="footer-link font-medium">
                  من نحن
                </Link>
              </li>
              <li>
                <Link href="#team" className="footer-link font-medium">
                  فريق العمل
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              الوصول السريع
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/login" className="footer-link font-medium">
                  تسجيل الدخول
                </Link>
              </li>
              <li>
                <Link href="/register" className="footer-link font-medium">
                  إنشاء حساب جديد
                </Link>
              </li>
              <li>
                <Link href="/student" className="footer-link font-medium">
                  بوابة الطالب
                </Link>
              </li>
              <li>
                <Link href="/admin" className="footer-link font-medium">
                  بوابة الإدارة
                </Link>
              </li>
              <li className="pt-2 text-[11px] footer-secondary-text">
                <span>سياسة الخصوصية | شروط الاستخدام</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-start text-xs footer-secondary-text">
          <p>
            &copy; 2026 UniMeta. جميع الحقوق محفوظة.
          </p>
          <p className="text-[11px] footer-secondary-text opacity-90">
            نسخة عرض جامعية — لا يوجد تكامل رسمي مع الجامعة.
          </p>
        </div>
      </div>
    </footer>
  );
}

