"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Brand, Navbar } from "./navbar";

type NavItem = { href: string; label: string };
const studentItems: NavItem[] = [
  { href: "/student", label: "نظرة عامة" },
  { href: "/student/academic", label: "الشؤون الأكاديمية" },
  { href: "/student/library", label: "المكتبة" },
  { href: "/student/productivity", label: "الإنتاجية" },
  { href: "/student/interests", label: "الاهتمامات" },
  { href: "/student/teams", label: "الفرق" },
  { href: "/student/exchange/books", label: "تبادل الكتب" },
  { href: "/student/exchange/devices", label: "تبادل الأجهزة" },
  { href: "/student/agreements", label: "الاتفاقيات" },
  { href: "/student/settings", label: "الإعدادات" },
];
const adminItems: NavItem[] = [
  { href: "/admin", label: "نظرة عامة" },
  { href: "/admin/students", label: "الطلاب" },
  { href: "/admin/library", label: "المكتبة" },
  { href: "/admin/agreements", label: "الاتفاقيات" },
  { href: "/admin/reports", label: "التقارير" },
];

function NavLinks({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  return <nav className="sidebar-links" aria-label="قائمة الصفحات">{items.map((item) => <Link key={item.href} className="sidebar-link" href={item.href} aria-current={pathname === item.href ? "page" : undefined}>{item.label}</Link>)}</nav>;
}

export function Sidebar({ area }: { area: "student" | "admin" }) {
  const items = area === "student" ? studentItems : adminItems;
  return <>
    <aside className="app-sidebar"><Brand /><p className="sidebar-caption">{area === "student" ? "مساحة الطالب" : "مساحة الإدارة"}</p><NavLinks items={items} /></aside>
    <div className="mobile-area-header"><Navbar area={area} /><details className="mobile-nav"><summary className="btn btn-outline" aria-label="فتح القائمة">القائمة</summary><div className="mobile-nav-panel"><NavLinks items={items} /></div></details></div>
  </>;
}

export function DashboardShell({ area, children }: { area: "student" | "admin"; children: ReactNode }) {
  return <div className="app-frame"><Sidebar area={area} /><div className="shell-column">{children}</div></div>;
}
