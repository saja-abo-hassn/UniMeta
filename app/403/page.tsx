import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F4FAFF] px-6 text-center" dir="rtl">
      <div className="max-w-md rounded-2xl border border-[#D0E8F9] bg-white p-8 shadow-xs">
        <p className="text-sm font-bold text-[#0057C8]">403</p>
        <h1 className="mt-2 text-2xl font-extrabold text-[#0B192C]">ليس لديك صلاحية الوصول</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">هذا القسم مخصص لدور مستخدم آخر.</p>
        <Link className="mt-6 inline-flex rounded-lg bg-[#0057C8] px-5 py-2.5 text-sm font-bold text-white" href="/">
          العودة إلى الرئيسية
        </Link>
      </div>
    </main>
  );
}
