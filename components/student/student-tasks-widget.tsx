"use client";

import React from "react";
import { useStudentTasks } from "./tasks/hooks/use-student-tasks";
import { TaskFormInline } from "./tasks/components/task-form-inline";
import { TaskItemCard } from "./tasks/components/task-item-card";
import { TasksEmptyState } from "./tasks/components/tasks-empty-state";

export type { StudentTaskItem } from "./tasks/types";

export function StudentTasksWidget() {
  const {
    isLoaded,
    tasks,
    sortedTasks,
    isAdding,
    setIsAdding,
    editingTaskId,
    formTitle,
    setFormTitle,
    formDueDate,
    setFormDueDate,
    formCourseCode,
    setFormCourseCode,
    availableCourses,
    hasPlanSelected,
    selectedPlan,
    handleAddTask,
    handleSaveEdit,
    startEditing,
    toggleComplete,
    deleteTask,
    resetForm,
  } = useStudentTasks();

  if (!isLoaded) {
    return (
      <div className="card-entrance bg-white border border-[#D7EAF7] rounded-3xl p-6 shadow-xs min-h-[300px] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#0057C8] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="card-entrance card-hover-effect bg-white border border-[#D7EAF7] rounded-3xl p-6 shadow-xs flex flex-col justify-between"
      style={{ animationDelay: "300ms" }}
      dir="rtl"
    >
      <div className="flex items-center justify-between pb-4 border-b border-[#D7EAF7]/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#EAF4FD] text-[#0057C8] flex items-center justify-center shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#16324A]">
              مهامي
            </h2>
            <span className="text-[11px] text-[#66788A] block -mt-0.5">
              {sortedTasks.totalActive} مهام معلقة · {sortedTasks.totalCompleted} منجزة
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            if (isAdding) {
              resetForm();
            } else {
              setIsAdding(true);
            }
          }}
          className="text-xs font-semibold text-white bg-[#0057C8] hover:bg-[#2D78B7] px-3.5 py-1.5 rounded-xl transition-all shadow-xs inline-flex items-center gap-1.5 active:scale-95"
        >
          <span>{isAdding ? "إلغاء" : "+ مهمة جديدة"}</span>
        </button>
      </div>

      {(isAdding || editingTaskId) && (
        <TaskFormInline
          editingTaskId={editingTaskId}
          formTitle={formTitle}
          onTitleChange={setFormTitle}
          formDueDate={formDueDate}
          onDueDateChange={setFormDueDate}
          formCourseCode={formCourseCode}
          onCourseCodeChange={setFormCourseCode}
          availableCourses={availableCourses}
          onCancel={resetForm}
          onSubmit={editingTaskId ? handleSaveEdit : handleAddTask}
        />
      )}

      <div className="py-3 space-y-4 max-h-[380px] overflow-y-auto pe-1">
        {tasks.length === 0 ? (
          <TasksEmptyState onStartAdding={() => setIsAdding(true)} />
        ) : (
          <div className="space-y-4">
            {sortedTasks.overdue.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-red-600">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span>متأخرة ({sortedTasks.overdue.length})</span>
                </div>
                {sortedTasks.overdue.map((task) => (
                  <TaskItemCard
                    key={task.id}
                    task={task}
                    statusBadge="متأخرة"
                    badgeClass="bg-red-50 text-red-700 border-red-200"
                    onToggle={() => toggleComplete(task.id)}
                    onEdit={() => startEditing(task)}
                    onDelete={() => deleteTask(task.id)}
                  />
                ))}
              </div>
            )}

            {sortedTasks.todayList.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#0057C8]">
                  <span className="w-2 h-2 rounded-full bg-[#0057C8]" />
                  <span>اليوم ({sortedTasks.todayList.length})</span>
                </div>
                {sortedTasks.todayList.map((task) => (
                  <TaskItemCard
                    key={task.id}
                    task={task}
                    statusBadge="اليوم"
                    badgeClass="bg-[#EAF4FD] text-[#0057C8] border-[#D7EAF7]"
                    onToggle={() => toggleComplete(task.id)}
                    onEdit={() => startEditing(task)}
                    onDelete={() => deleteTask(task.id)}
                  />
                ))}
              </div>
            )}

            {sortedTasks.upcoming.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#66788A]">
                  <span className="w-2 h-2 rounded-full bg-slate-300" />
                  <span>القادمة ({sortedTasks.upcoming.length})</span>
                </div>
                {sortedTasks.upcoming.map((task) => (
                  <TaskItemCard
                    key={task.id}
                    task={task}
                    onToggle={() => toggleComplete(task.id)}
                    onEdit={() => startEditing(task)}
                    onDelete={() => deleteTask(task.id)}
                  />
                ))}
              </div>
            )}

            {sortedTasks.completedList.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-[#D7EAF7]/60">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                  <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>المنجزة ({sortedTasks.completedList.length})</span>
                </div>
                {sortedTasks.completedList.map((task) => (
                  <TaskItemCard
                    key={task.id}
                    task={task}
                    isCompleted
                    onToggle={() => toggleComplete(task.id)}
                    onEdit={() => startEditing(task)}
                    onDelete={() => deleteTask(task.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-[#D7EAF7]/80 text-[11px] text-[#66788A] flex items-center justify-between">
        <span>تُحفظ مهامك محلياً بشكل مستقل لكل حساب</span>
        {hasPlanSelected && (
          <span className="text-[10px] text-[#0057C8]">
            متزامنة مع مواد {selectedPlan.major}
          </span>
        )}
      </div>
    </div>
  );
}
