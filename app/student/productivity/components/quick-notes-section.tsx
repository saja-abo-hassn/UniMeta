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
    <section className="card-hover-effect p-6 rounded-3xl bg-white border border-brand-border-soft shadow-xs space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-brand-border-soft">
        <h2 className="text-base font-bold text-brand-ink">ملاحظات دراسية سريعة</h2>
        {savedNotice && (
          <span className="text-xs font-semibold text-emerald-700 animate-fade-in">
            ✓ تم حفظ الملاحظة
          </span>
        )}
      </div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={3}
        className="w-full p-3 rounded-2xl border border-brand-border-soft text-xs sm:text-sm text-brand-ink focus:outline-none focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/20 resize-none bg-brand-surface-muted"
        placeholder="دوّن ملاحظاتك ومواعيد الامتحانات السريعة هنا..."
      />
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            setSavedNotice(true);
            setTimeout(() => setSavedNotice(false), 2500);
          }}
          className="px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-hover-medium text-white text-xs font-bold transition-colors"
        >
          حفظ الملاحظة
        </button>
      </div>
    </section>
  );
}

