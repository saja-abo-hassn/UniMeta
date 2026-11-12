import React from "react";
import type { Metadata } from "next";
import { PublicShell } from "@/components/layout/public-shell";

export const metadata: Metadata = {
  title: "يوني ميتا لطلاب جامعة الأزهر غزة",
  description:
    "يوني ميتا منصة مستقلة لطلاب جامعة الأزهر غزة. احسب المعدل التراكمي، واستعرض الخطط الدراسية والساعات المعتمدة، ونظّم مسارك الجامعي.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "يوني ميتا لطلاب جامعة الأزهر غزة | UniMeta",
    description:
      "أدوات أكاديمية مستقلة لطلاب جامعة الأزهر في غزة: حساب المعدل التراكمي، الخطط الدراسية، والساعات المعتمدة.",
    url: "/",
  },
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PublicShell>{children}</PublicShell>;
}

