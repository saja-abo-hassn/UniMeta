import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الخطة الدراسية والساعات المعتمدة | UniMeta",
  description:
    "تابع خطتك الدراسية والساعات المعتمدة والمواد المنجزة والمتبقية في UniMeta، بالاعتماد على بيانات الخطة المتاحة في المنصة.",
  alternates: { canonical: "/my-hours" },
  openGraph: {
    title: "متابعة الخطة الدراسية | UniMeta",
    description:
      "أداة UniMeta لمتابعة الساعات المعتمدة والمواد المنجزة والمتبقية في الخطة الدراسية.",
    url: "/my-hours",
  },
};

export default function MyHoursLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
