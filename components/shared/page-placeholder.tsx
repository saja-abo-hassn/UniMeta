import Link from "next/link";
import { Navbar } from "./navbar";

type PagePlaceholderProps = { section: "public" | "auth" | "student" | "admin"; title: string; description: string };

export function PagePlaceholder({ section, title, description }: PagePlaceholderProps) {
  if (section === "public") {
    return <div className="landing"><title>UniMate | رفيق الحياة الجامعية</title><Navbar /><main className="landing-hero"><div className="hero-copy"><p className="eyebrow">رفيق يومك الجامعي</p><h1 className="hero-title">طريقك في الجامعة، <span>أوضح.</span></h1><p className="hero-description">{description} UniMate يجمع رحلتك الجامعية في مساحة عربية واحدة، بتجربة تساعدك على البدء بثقة.</p><div className="hero-actions"><Link className="btn btn-primary" href="/register">ابدأ رحلتك الجامعية</Link><Link className="btn btn-outline" href="/login">لديك حساب؟ سجّل الدخول</Link></div><p className="page-lede">منصة جامعية قيد التأسيس</p></div><div className="hero-art" aria-hidden="true"><div className="orbit"><span className="orbit-point" /></div><div className="hero-seal"><div><strong>م</strong><span>مسارك الجامعي</span></div></div></div></main><footer className="landing-footer">UniMate · مساحة واحدة لرحلتك الجامعية</footer></div>;
  }
  if (section === "auth") return <><title>{title} | UniMate</title><Navbar /><main className="auth-wrap"><section className="auth-card"><p className="eyebrow">UniMate · مساحة الطالب</p><h1 className="page-heading">{title}</h1><p className="page-lede">{description}</p><div className="auth-placeholder"><div className="placeholder-rule" /><p>ستتوفر هذه الصفحة في مرحلة لاحقة.</p><Link className="nav-link" href={title === "تسجيل الدخول" ? "/register" : "/login"}>{title === "تسجيل الدخول" ? "إنشاء حساب جديد" : "العودة إلى تسجيل الدخول"}</Link></div></section></main></>;
  return <main className="shell-main"><title>{title} | UniMate</title><p className="eyebrow">{section === "student" ? "مساحة الطالب" : "مساحة الإدارة"}</p><h1 className="page-heading">{title}</h1><p className="page-lede">{description}</p><section className="placeholder-panel"><div className="placeholder-rule" /><h2>هذه المساحة قيد التجهيز</h2><p className="page-lede">ستظهر هنا أدوات وخدمات UniMate عند اكتمال هذه المرحلة.</p></section></main>;
}
