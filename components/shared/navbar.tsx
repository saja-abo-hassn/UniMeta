import Link from "next/link";

export function Brand() {
  return <Link href="/" className="brand" aria-label="UniMate، الصفحة الرئيسية"><span className="brand-mark" aria-hidden="true">م</span><span><span className="brand-name">UniMate</span><span className="brand-caption">رفيق الحياة الجامعية</span></span></Link>;
}

export function Navbar({ area }: { area?: "student" | "admin" }) {
  if (area) return <header className="shell-topbar"><Brand /><span className="topbar-area">{area === "student" ? "مساحة الطالب" : "إدارة الجامعة"}</span><Link className="nav-link" href="/">الرئيسية</Link></header>;
  return <header className="site-header"><Brand /><nav className="header-links" aria-label="التنقل الرئيسي"><Link className="nav-link" href="/login">تسجيل الدخول</Link><Link className="btn btn-primary" href="/register">ابدأ الآن</Link></nav></header>;
}
