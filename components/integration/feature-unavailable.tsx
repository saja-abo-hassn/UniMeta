import Link from "next/link";
export function FeatureUnavailable({title}:{title:string}) {
  return <section dir="rtl" className="bg-white border border-[#D7EAF7] rounded-3xl p-8 space-y-4"><h1 className="text-2xl font-bold text-[#16324A]">{title}</h1><p className="text-slate-600">هذه الخدمة غير متاحة حاليًا. يمكنك متابعة استخدام الخدمات المتاحة من القائمة.</p><Link href="/student" className="inline-block text-[#0057C8] font-bold">العودة للرئيسية ←</Link></section>;
}
