import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/shared/card";
import { Button } from "@/components/shared/button";

export interface PagePlaceholderProps {
  title: string;
  description: string;
  area?: "public" | "student" | "admin";
  serviceNotReadyNotice?: string;
  showSampleDisclosure?: boolean;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

export function PagePlaceholder({
  title,
  description,
  area = "student",
  serviceNotReadyNotice = "هذه الخدمة قيد التطوير والتجهيز للمراحل البرمجية القادمة. لا يتم حفظ أو تنفيذ أي إجراءات فعلية في هذه البيئة التجريبية.",
  showSampleDisclosure = false,
  actions,
  children,
}: PagePlaceholderProps) {
  const areaBadges = {
    public: { label: "البوابة العامة", color: "bg-brand-primary/10 text-brand-primary border-brand-primary/20" },
    student: { label: "خدمات الطالب", color: "bg-brand-primary/10 text-brand-primary border-brand-primary/20" },
    admin: { label: "الإدارة والمتابعة", color: "bg-amber-500/10 text-amber-800 border-amber-500/20" },
  };

  return (
    <div className="flex flex-col gap-6 text-start max-w-4xl mx-auto w-full animate-in fade-in duration-200">
      {/* Top Banner Card */}
      <Card className="border-t-4 border-t-brand-primary">
        <CardHeader>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${areaBadges[area].color}`}
            >
              {areaBadges[area].label}
            </span>
            <span className="text-xs text-brand-secondary font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              هيكل أولي معتمد
            </span>
          </div>
          <CardTitle as="h1" className="text-2xl sm:text-3xl mt-2 text-brand-dark">
            {title}
          </CardTitle>
          <CardDescription className="text-base text-brand-secondary mt-1">
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Service Not Ready Notice */}
          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs sm:text-sm flex items-start gap-3">
            <svg
              className="w-5 h-5 text-amber-600 shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-amber-950">إشعار بيئة العرض التوضيحي:</span>
              <p className="leading-relaxed text-amber-900/90">{serviceNotReadyNotice}</p>
            </div>
          </div>

          {/* Sample Disclosure if requested */}
          {showSampleDisclosure && (
            <div className="mt-3 p-3 rounded-xl bg-brand-light border border-brand-secondary/20 text-xs text-brand-secondary flex items-center gap-2">
              <span className="font-semibold text-brand-primary">مصدر البيانات:</span>
              <span>بيانات توضيحية مصطنعة (Synthetic Mock Data) معزولة بالكامل عن أي اتصال بالخادم.</span>
            </div>
          )}

          {/* Custom preview or content */}
          {children && <div className="mt-6">{children}</div>}
        </CardContent>

        <CardFooter className="flex-wrap">
          <div className="flex items-center gap-2">
            <Link href={area === "admin" ? "/admin" : area === "student" ? "/student" : "/"}>
              <Button variant="outline" size="sm">
                العودة للرئيسية
              </Button>
            </Link>
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </CardFooter>
      </Card>
    </div>
  );
}

