interface TasksEmptyStateProps {
  onStartAdding: () => void;
}

export function TasksEmptyState({ onStartAdding }: TasksEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10 px-4 space-y-3">
      <div className="w-12 h-12 rounded-2xl bg-brand-surface-soft text-brand-primary flex items-center justify-center border border-brand-border-soft">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>
      <div>
        <p className="text-sm font-bold text-brand-ink">
          لا توجد مهام حالياً
        </p>
        <p className="text-xs text-brand-muted mt-0.5">
          لا مهام، أضف مهمتك الأولى لتنظيم دراستك وأولوياتك.
        </p>
      </div>
      <button
        type="button"
        onClick={onStartAdding}
        className="text-xs font-semibold text-brand-primary hover:text-brand-hover-medium bg-brand-surface-blue px-3.5 py-1.5 rounded-xl border border-brand-border-soft hover:border-brand-secondary transition-colors"
      >
        + إضافة مهمتك الأولى
      </button>
    </div>
  );
}

