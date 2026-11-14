import Link from "next/link";
import { ModeratorUser } from "@/src/types/admin";

interface AdminOverviewHeaderProps {
  currentUser: ModeratorUser;
  pendingAgreementsCount: number;
}

export function AdminOverviewHeader({
  currentUser,
  pendingAgreementsCount,
}: AdminOverviewHeaderProps) {
  return (
    <section className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-white border border-brand-border-soft shadow-xs">
      <div className="absolute top-0 end-0 -mt-12 -me-12 w-80 h-80 bg-gradient-to-br from-brand-secondary/10 to-brand-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-1 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-primary" />
            <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
              مركز العمليات الأكاديمية
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-ink tracking-tight">
            صباح الخير، {currentUser.name}
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted leading-relaxed max-w-2xl">
            تابع الحسابات والمحتوى والمواد الدراسية والاتفاقيات والبلاغات من مساحة موحدة ومتزامنة لحظياً مع بوابة الطالب.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Link
            href="/admin/content"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-hover-medium text-white text-xs sm:text-sm font-bold transition-all shadow-xs group"
          >
            <svg className="w-4 h-4 text-[#BFE8FF] group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>إدارة المحتوى والمواد</span>
          </Link>

          <Link
            href="/admin/agreements"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-surface-soft hover:bg-brand-surface-blue text-brand-primary border border-brand-border-soft text-xs sm:text-sm font-bold transition-colors"
          >
            <span>مراجعة الاتفاقيات</span>
            {pendingAgreementsCount > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-brand-primary text-white">
                {pendingAgreementsCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </section>
  );
}
