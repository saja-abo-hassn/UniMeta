import Image from "next/image";
import {
  QuizResultCalculation,
  TRAITS_CONFIG,
  TraitKey,
} from "@/src/data/major-orientation-config";

interface QuizResultViewProps {
  result: QuizResultCalculation;
  isApplyingPlan: boolean;
  onChoosePlan: (planId: string, majorTitle: string) => void;
  onRestart: () => void;
}

export function QuizResultView({
  result,
  isApplyingPlan,
  onChoosePlan,
  onRestart,
}: QuizResultViewProps) {
  return (
    <div className="p-6 sm:p-9 rounded-3xl bg-white border border-[#D7EAF7] shadow-sm space-y-7 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#EAF4FD] via-[#F4FAFF] to-[#EAF4FD] border border-[#BEE3F8]">
        <div className="flex items-center gap-4 text-center sm:text-start">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 mascot-stationary-float select-none">
            <Image
              src="/mascot/think.png"
              alt="UniMeta Mascot Result"
              fill
              className="object-contain drop-shadow-md"
            />
          </div>
          <div>
            <span className="text-xs font-bold text-[#0057C8] uppercase tracking-wider block">
              نتيجة مقياس الميول الأكاديمية
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#16324A] mt-0.5">
              تهانينا! اكتشفنا تخصصك الأنسب 🎓
            </h2>
            <p className="text-xs text-[#66788A] mt-1">
              تم مطابقة إجاباتك مع الخطط الدراسية الفعلية لجامعة الأزهر.
            </p>
          </div>
        </div>

        <div className="px-4 py-2.5 rounded-2xl bg-white border border-[#0057C8]/20 shadow-xs text-center shrink-0">
          <span className="text-[11px] font-bold text-[#66788A] block">نسبة التوافق</span>
          <span className="text-2xl sm:text-3xl font-black text-[#0057C8]">
            {result.topMajor.matchPercentage}%
          </span>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-[#F0F7FD] border-2 border-[#0057C8]/30 shadow-xs space-y-3 relative overflow-hidden">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-[#0057C8] uppercase bg-white px-2.5 py-0.5 rounded-md border border-[#BEE3F8]">
              التخصص الأنسب لك
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#16324A]">
              {result.topMajor.majorName}
            </h3>
            <p className="text-xs font-medium text-[#48627A]">
              {result.topMajor.collegeName} &bull; درجة {result.topMajor.degree}
            </p>
          </div>

          <span className="text-3xl select-none">🎯</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-[#D7EAF7] text-xs sm:text-sm text-[#16324A] leading-relaxed font-medium whitespace-pre-line">
          {result.summaryExplanation}
        </div>

        <div className="text-xs text-[#48627A] pt-1">
          <strong className="text-[#16324A]">المسارات والفرص المهنية: </strong>
          {result.topMajor.careerPath}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-[#16324A]">بدائل أكاديمية قريبة تناسب اهتماماتك</h4>
          <span className="text-xs text-[#8297A8]">من خطط الجامعة المعتمدة</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {result.alternatives.map((alt, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[#F8FBFE] border border-[#D7EAF7] hover:border-[#4DB7F2] transition-colors flex flex-col justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#16324A]">{alt.majorName}</span>
                  <span className="text-xs font-extrabold text-[#0057C8] bg-white px-2 py-0.5 rounded-md border border-[#D7EAF7]">
                    {alt.matchPercentage}% تطابق
                  </span>
                </div>
                <p className="text-[11px] text-[#66788A] line-clamp-2 leading-relaxed">
                  {alt.recommendationReason}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onChoosePlan(alt.planId, alt.majorName)}
                className="text-xs font-bold text-[#0057C8] hover:underline self-start flex items-center gap-1"
              >
                <span>اعتماد خطة {alt.majorName}</span>
                <span>&larr;</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <h4 className="text-sm font-bold text-[#16324A] flex items-center gap-2">
          <span>تحليل السمات الشخصية الخمس (Holland Profile)</span>
          <span className="text-xs text-[#8297A8] font-normal">| توزيع ميولك</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
          {(["T", "S", "H", "B", "C"] as TraitKey[]).map((tKey) => {
            const trait = TRAITS_CONFIG[tKey];
            const percent = result.percentages[tKey] || 0;
            const isTop = result.topTraits.includes(tKey);

            return (
              <div
                key={tKey}
                className={`p-3 rounded-2xl border text-center space-y-1.5 transition-all ${
                  isTop
                    ? "bg-[#EAF4FD] border-[#0057C8] shadow-2xs"
                    : "bg-[#F8FBFE] border-[#D7EAF7]"
                }`}
              >
                <div className="text-xl select-none">{trait.icon}</div>
                <div className="text-xs font-bold text-[#16324A]">{trait.name}</div>
                <div className="font-mono text-xs font-black text-[#0057C8]">{percent}%</div>
                <div className="w-full h-1.5 rounded-full bg-white border border-[#D7EAF7] overflow-hidden">
                  <div
                    className="h-full bg-[#0057C8] rounded-full"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-2.5 leading-relaxed">
        <span className="text-base shrink-0 mt-0.5">💡</span>
        <div>
          <strong className="block font-bold mb-0.5">تنبيه استرشادي:</strong>
          الاختبار للإرشاد فقط وقرارك النهائي لك. ننصحك دائماً بمراجعة تفاصيل الخطة الدراسية والاستئناس برأي المرشد الأكاديمي قبل التسجيل النهائي.
        </div>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onChoosePlan(result.topMajor.planId, result.topMajor.majorName)}
          disabled={isApplyingPlan}
          className="w-full sm:w-auto px-7 py-3 rounded-xl bg-[#0057C8] hover:bg-[#0045A5] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {isApplyingPlan ? (
            <span>جاري اعتماد الخطة...</span>
          ) : (
            <>
              <span>اختر هذه الخطة وافتح مساري الأكاديمي</span>
              <span>&larr;</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onRestart}
          className="w-full sm:w-auto px-5 py-3 rounded-xl border border-[#D7EAF7] text-[#48627A] hover:bg-[#F0F6FA] hover:text-[#16324A] font-semibold text-xs transition-colors"
        >
          أعد الاختبار من البداية
        </button>
      </div>
    </div>
  );
}

