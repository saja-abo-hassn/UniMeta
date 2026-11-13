"use client";

import React, { useState } from "react";
import { upcomingTasks as initialTasks, StudentTask } from "@/src/data/student-mock-data";

export function TasksWidget() {
  const [tasks, setTasks] = useState<StudentTask[]>(initialTasks);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: StudentTask = {
      id: `tsk-${Date.now()}`,
      title: newTaskTitle.trim(),
      course: "مهمة عامة",
      dueDateText: "هذا الأسبوع",
      priority: "متوسط",
      completed: false,
    };

    setTasks((prev) => [newTask, ...prev]);
    setNewTaskTitle("");
    setIsAdding(false);
  };

  return (
    <div
      className="card-entrance card-hover-effect bg-white border border-brand-border-soft rounded-3xl p-6 shadow-xs flex flex-col justify-between"
      style={{ animationDelay: "350ms" }}
    >
      {/* Header (Figma node 1:1351) */}
      <div className="flex items-center justify-between pb-4 border-b border-brand-border-soft/80">
        <div>
          <span className="text-[10px] font-bold text-brand-primary uppercase tracking-wider block mb-1">
            الأولوية
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-brand-ink">
            المهام القادمة
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="text-xs font-semibold text-white bg-brand-primary hover:bg-brand-hover-medium px-3 py-1.5 rounded-full transition-colors inline-flex items-center gap-1 shadow-xs"
        >
          <span>{isAdding ? "إلغاء" : "+ إضافة مهمة"}</span>
        </button>
      </div>

      {/* Add Task Input Form if open */}
      {isAdding && (
        <form onSubmit={handleAddTask} className="pt-4 flex gap-2 animate-fade-in">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="اكتب عنوان المهمة الجديدة..."
            className="flex-1 h-10 px-3.5 rounded-xl border border-brand-border-soft focus:border-brand-secondary text-xs text-brand-ink focus:outline-none focus:ring-2 focus:ring-brand-secondary/30"
            autoFocus
          />
          <button
            type="submit"
            className="px-4 h-10 bg-brand-primary hover:bg-brand-hover-medium text-white text-xs font-bold rounded-xl transition-colors"
          >
            إضافة
          </button>
        </form>
      )}

      {/* Task List (Figma lines 691x68) */}
      <div className="py-4 space-y-2.5">
        {tasks.map((task) => (
          <label
            key={task.id}
            className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
              task.completed
                ? "bg-brand-surface-muted border-brand-border-soft opacity-60"
                : "bg-brand-surface-muted border-brand-border-soft/80 hover:border-brand-secondary"
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                className="w-4 h-4 rounded border-brand-border-soft text-brand-primary focus:ring-brand-secondary/30 shrink-0 cursor-pointer"
              />
              <div className="min-w-0">
                <span
                  className={`block text-xs sm:text-sm font-bold truncate ${
                    task.completed
                      ? "line-through text-brand-muted"
                      : "text-brand-ink"
                  }`}
                >
                  {task.title}
                </span>
                <span className="text-[10px] text-brand-muted truncate block">
                  {task.course} · {task.dueDateText}
                </span>
              </div>
            </div>

            <span
              className={`text-[9px] font-bold px-2 py-0.5 rounded-md shrink-0 ${
                task.priority === "عاجل"
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "bg-brand-surface-blue text-brand-primary border border-brand-border-soft"
              }`}
            >
              {task.priority}
            </span>
          </label>
        ))}
      </div>

      {/* Footer Info */}
      <div className="pt-2 text-[11px] text-brand-muted flex items-center justify-between">
        <span>متبقي {tasks.filter((t) => !t.completed).length} مهام معلقة</span>
        <span className="text-[10px] text-brand-hover-medium">متزامنة مع التقويم الدراسي</span>
      </div>
    </div>
  );
}

