import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "حساب الرسوم والساعات المعتمدة | UniMeta",
  description:
    "قدّر الرسوم الدراسية في UniMeta حسب عدد الساعات المعتمدة والتخصص المحدد. الحاسبة أداة تقديرية مستقلة للطلاب.",
  alternates: { canonical: "/fee-calculator" },
  openGraph: {
    title: "حاسبة الرسوم الجامعية | UniMeta",
    description:
      "تقدير الرسوم الدراسية بحسب الساعات المعتمدة والخطة المختارة باستخدام أداة UniMeta.",
    url: "/fee-calculator",
  },
};

export default function FeeCalculatorLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
