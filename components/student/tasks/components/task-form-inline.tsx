import { Course } from "@/src/data/study-plans-data";

interface TaskFormInlineProps {
  editingTaskId: string | null;
  formTitle: string;
  onTitleChange: (v: string) => void;
  formDueDate: string;
  onDueDateChange: (v: string) => void;
  formCourseCode: string;
  onCourseCodeChange: (v: string) => void;
  availableCourses: Course[];
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function TaskFormInline({
  editingTaskId,
  formTitle,
  onTitleChange,
  formDueDate,
  onDueDateChange,
  formCourseCode,
  onCourseCodeChange,
  availableCourses,
  onCancel,
  onSubmit,
}: TaskFormInlineProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="my-4 p-4 rounded-2xl bg-brand-surface-soft border border-brand-border-soft space-y-3 animate-fade-in"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-brand-primary">
          {editingTaskId ? "تعديل المهمة" : "إضافة مهمة جديدة"}
        </span>
        <button
          type="button"
          onClick={onCancel}
          className="text-xs text-brand-muted hover:text-brand-ink"
        >
          إلغاء
        </button>
      </div>

      <div>
        <input
          type="text"
          required
          value={formTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="عنوان المهمة (مثال: حل واجب البرمجة، مراجعة الفصل الثالث)..."
          className="w-full h-10 px-3.5 rounded-xl bg-white border border-brand-border-soft text-xs text-brand-ink focus:outline-none focus:ring-2 focus:ring-brand-primary/25"
          autoFocus
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div>
          <label className="block text-[10px] font-semibold text-brand-muted mb-1">
            تاريخ الاستحقاق (اختياري)
          </label>
          <input
            type="date"
            value={formDueDate}
            onChange={(e) => onDueDateChange(e.target.value)}
            className="w-full h-9 px-3 rounded-xl bg-white border border-brand-border-soft text-xs text-brand-ink focus:outline-none focus:ring-2 focus:ring-brand-primary/25"
          />
        </div>

        <div>
          <label className="block text-[10px] font-semibold text-brand-muted mb-1">
            المادة من الخطة (اختياري)
          </label>
          <select
            value={formCourseCode}
            onChange={(e) => onCourseCodeChange(e.target.value)}
            className="w-full h-9 px-2.5 rounded-xl bg-white border border-brand-border-soft text-xs text-brand-ink focus:outline-none focus:ring-2 focus:ring-brand-primary/25"
          >
            <option value="">بدون مادة (مهمة عامة)</option>
            {availableCourses.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} - {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="px-3.5 py-1.5 text-xs text-brand-muted hover:bg-white rounded-xl transition-colors"
        >
          إلغاء
        </button>
        <button
          type="submit"
          className="px-4 py-1.5 bg-brand-primary hover:bg-brand-hover-medium text-white text-xs font-bold rounded-xl transition-all shadow-xs"
        >
          {editingTaskId ? "حفظ التعديلات" : "إضافة المهمة"}
        </button>
      </div>
    </form>
  );
}
