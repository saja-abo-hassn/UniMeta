import type { Metadata } from "next";
import { AppProviders } from "@/components/providers/app-providers";

export const metadata: Metadata = {
  title: "حساب المعدل التراكمي جامعة الأزهر غزة | Al-Azhar GPA Calculator",
  description:
    "استخدم حاسبة UniMeta لمتابعة حساب المعدل الفصلي والتراكمي لطلاب جامعة الأزهر غزة وفق الساعات والعلامات المدخلة.",
  alternates: { canonical: "/gpa-calculator" },
  openGraph: {
    title: "حاسبة المعدل التراكمي | UniMeta",
    description:
      "أداة مستقلة لحساب ومتابعة المعدل الجامعي باستخدام الساعات المعتمدة والعلامات التي تدخلها.",
    url: "/gpa-calculator",
  },
};

export default function GpaCalculatorLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <AppProviders>{children}</AppProviders>;
}
