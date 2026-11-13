import { StudentTaskItem, formatDateDisplay } from "../types";

interface TaskItemCardProps {
  task: StudentTaskItem;
  isCompleted?: boolean;
  statusBadge?: string;
  badgeClass?: string;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function TaskItemCard({
  task,
  isCompleted = false,
  statusBadge,
  badgeClass = "bg-brand-surface-soft text-brand-muted border-brand-border-soft",
  onToggle,
  onEdit,
  onDelete,
}: TaskItemCardProps) {
  return (
    <div
      className={`group p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
        isCompleted
          ? "bg-brand-surface-muted border-brand-border-soft opacity-60"
          : "bg-brand-surface-muted border-brand-border-soft/80 hover:border-brand-secondary hover:bg-white"
      }`}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={onToggle}
          className="w-4 h-4 rounded text-brand-primary border-brand-border-soft focus:ring-brand-primary shrink-0 cursor-pointer"
          aria-label={task.title}
        />

        <div className="min-w-0 flex-1">
          <span
            className={`block text-xs sm:text-sm font-bold truncate ${
              isCompleted ? "line-through text-brand-subtle" : "text-brand-ink"
            }`}
          >
            {task.title}
          </span>

          <div className="flex items-center gap-2 mt-0.5 text-[10px] text-brand-muted truncate">
            {task.courseName && (
              <span className="font-semibold text-brand-primary truncate">
                {task.courseName}
              </span>
            )}
            {task.courseCode && !task.courseName && (
              <span className="font-mono text-brand-primary">{task.courseCode}</span>
            )}
            {task.dueDate && (
              <span>
                {task.courseCode || task.courseName ? "· " : ""}
                الاستحقاق: {formatDateDisplay(task.dueDate)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {statusBadge && !isCompleted && (
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${badgeClass}`}>
            {statusBadge}
          </span>
        )}

        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={onEdit}
            title="تعديل المهمة"
            className="p-1 rounded-lg text-brand-muted hover:text-brand-primary hover:bg-brand-surface-blue transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={onDelete}
            title="حذف المهمة"
            className="p-1 rounded-lg text-brand-muted hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

