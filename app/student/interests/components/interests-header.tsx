import Link from "next/link";

export function InterestsHeader() {
  return (
    <section className="card-entrance p-6 sm:p-7 rounded-3xl bg-white border border-brand-border-soft shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div className="flex flex-col mb-1">
          <span className="text-xs font-bold text-brand-primary uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
            Academic & Career Orientation Assessment
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-ink mt-0.5">
            مقياس الميول واختيار التخصص الجامعي
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-brand-muted leading-relaxed max-w-xl">
          اختبار توجيهي من 15 سؤالاً يعتمد على نموذج Holland RIASEC المهني لتحديد التخصص الأنسب لك من خطط جامعة الأزهر المعتمدة.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-brand-surface-blue text-brand-primary border border-[#BEE3F8] shadow-2xs">
          15 سؤالاً استرشادياً
        </span>
        <Link
          href="/student/academic"
          className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white text-brand-copy-muted hover:text-brand-primary border border-brand-border-soft transition-colors"
        >
          عرض كافة الخطط
        </Link>
      </div>
    </section>
  );
}

