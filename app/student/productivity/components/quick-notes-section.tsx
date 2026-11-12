import React from "react";

interface QuickNotesSectionProps {
  notes: string;
  setNotes: (notes: string) => void;
  savedNotice: boolean;
  setSavedNotice: (saved: boolean) => void;
}

export function QuickNotesSection({
  notes,
  setNotes,
  savedNotice,
  setSavedNotice,
}: QuickNotesSectionProps) {
  return (
    <section className="card-hover-effect p-6 rounded-3xl bg-white border border-[#D7EAF7] shadow-xs space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-[#D7EAF7]">
        <h2 className="text-base font-bold text-[#16324A]">ملاحظات دراسية سريعة</h2>
        {savedNotice && (
          <span className="text-xs font-semibold text-emerald-700 animate-fade-in">
            ✓ تم حفظ الملاحظات محلياً
          </span>
        )}
      </div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={3}
        className="w-full p-3 rounded-2xl border border-[#D7EAF7] text-xs sm:text-sm text-[#16324A] focus:outline-none focus:border-[#4DB7F2] focus:ring-2 focus:ring-[#4DB7F2]/20 resize-none bg-[#F8FBFE]"
        placeholder="دوّن ملاحظاتك ومواعيد الامتحانات السريعة هنا..."
      />
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            setSavedNotice(true);
            setTimeout(() => setSavedNotice(false), 2500);
          }}
          className="px-4 py-2 rounded-xl bg-[#0057C8] hover:bg-[#2D78B7] text-white text-xs font-bold transition-colors"
        >
          حفظ الملاحظة
        </button>
      </div>
    </section>
  );
}

