import { StatCard } from "@/components/admin/stat-card";

interface AdminKPIsProps {
  totalStudents: number;
  activeNow: number;
  pendingAgreementsCount: number;
  activeAgreementsCount: number;
  publishedMaterialsCount: number;
  coveredCoursesCount: number;
  totalCoursesCount: number;
  openReportsCount: number;
}

export function AdminKPIs({
  totalStudents,
  activeNow,
  pendingAgreementsCount,
  activeAgreementsCount,
  publishedMaterialsCount,
  coveredCoursesCount,
  totalCoursesCount,
  openReportsCount,
}: AdminKPIsProps) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <StatCard
        title="إجمالي حسابات الطلاب"
        value={totalStudents}
        subtext={`${activeNow} حسابات نشطة حالياً`}
        variant="default"
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        }
      />

      <StatCard
        title="اتفاقيات تنتظر الموافقة"
        value={pendingAgreementsCount}
        subtext={pendingAgreementsCount > 0 ? "تحتاج قراراً فورياً" : "لا توجد طلبات معلقة"}
        variant={pendingAgreementsCount > 0 ? "warning" : "default"}
        badge={pendingAgreementsCount > 0 ? `${pendingAgreementsCount} معلقة` : "مستقر"}
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        }
      />

      <StatCard
        title="العهد النشطة"
        value={activeAgreementsCount}
        subtext="قيد المتابعة والتداول"
        variant="primary"
        badge="نشط"
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />

      <StatCard
        title="المواد والمحتويات"
        value={publishedMaterialsCount}
        subtext={`${coveredCoursesCount} من ${totalCoursesCount} مساق`}
        variant="default"
        badge={`${coveredCoursesCount} مساق`}
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        }
      />

      <StatCard
        title="البلاغات المفتوحة"
        value={openReportsCount}
        subtext={openReportsCount > 0 ? "تحتاج مراجعة المشرف" : "لا توجد بلاغات معلقة"}
        variant={openReportsCount > 0 ? "danger" : "default"}
        badge={`${openReportsCount} مفتوح`}
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        }
      />
    </section>
  );
}
