import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { LazyUniMetaChat } from "@/components/chat/lazy-unimeta-chat";

const notoSansArabic = localFont({
  src: "../public/fonts/NotoSansArabic-Variable.woff2",
  variable: "--font-arabic",
  display: "swap",
  fallback: ["system-ui", "Segoe UI", "Tahoma", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://unimeta.edu.ps"),
  title: {
    default: "يوني ميتا | UniMeta لأدوات الطالب الجامعي",
    template: "%s | UniMeta",
  },
  description:
    "يوني ميتا منصة مستقلة للطلاب في فلسطين لتنظيم الدراسة والمسار الجامعي بأدوات أكاديمية عملية.",
  applicationName: "UniMeta",
  openGraph: {
    siteName: "UniMeta",
    locale: "ar_PS",
    type: "website",
    title: "يوني ميتا | UniMeta لأدوات الطالب الجامعي",
    description:
      "منصة مستقلة للطلاب في فلسطين لتنظيم الدراسة والمسار الجامعي بأدوات أكاديمية عملية.",
  },
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
      { url: "/images/unimeta-logo.png", type: "image/png" },
    ],
    apple: "/images/unimeta-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${notoSansArabic.variable} h-full`}>
      <body className="min-h-full font-sans bg-brand-light text-brand-dark antialiased flex flex-col">
        {children}
        <LazyUniMetaChat />
      </body>
    </html>
  );
}
