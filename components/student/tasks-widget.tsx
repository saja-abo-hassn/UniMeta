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
      className="card-entrance card-hover-effect bg-white border border-[#D7EAF7] rounded-3xl p-6 shadow-xs flex flex-col justify-between"
      style={{ animationDelay: "350ms" }}
    >
      {/* Header (Figma node 1:1351) */}
      <div className="flex items-center justify-between pb-4 border-b border-[#D7EAF7]/80">
        <div>
          <span className="text-[10px] font-bold text-[#0057C8] uppercase tracking-wider block mb-1">
            الأولوية
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-[#16324A]">
            المهام القادمة
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="text-xs font-semibold text-white bg-[#0057C8] hover:bg-[#2D78B7] px-3 py-1.5 rounded-full transition-colors inline-flex items-center gap-1 shadow-xs"
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
            className="flex-1 h-10 px-3.5 rounded-xl border border-[#D7EAF7] focus:border-[#4DB7F2] text-xs text-[#16324A] focus:outline-none focus:ring-2 focus:ring-[#4DB7F2]/30"
            autoFocus
          />
          <button
            type="submit"
            className="px-4 h-10 bg-[#0057C8] hover:bg-[#2D78B7] text-white text-xs font-bold rounded-xl transition-colors"
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
                ? "bg-slate-50 border-slate-200 opacity-60"
                : "bg-[#F8FBFE] border-[#D7EAF7]/80 hover:border-[#4DB7F2]"
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                className="w-4 h-4 rounded border-[#D7EAF7] text-[#0057C8] focus:ring-[#4DB7F2]/30 shrink-0 cursor-pointer"
              />
              <div className="min-w-0">
                <span
                  className={`block text-xs sm:text-sm font-bold truncate ${
                    task.completed
                      ? "line-through text-slate-500"
                      : "text-[#16324A]"
                  }`}
                >
                  {task.title}
                </span>
                <span className="text-[10px] text-[#66788A] truncate block">
                  {task.course} · {task.dueDateText}
                </span>
              </div>
            </div>

            <span
              className={`text-[9px] font-bold px-2 py-0.5 rounded-md shrink-0 ${
                task.priority === "عاجل"
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "bg-[#EAF4FD] text-[#0057C8] border border-[#D7EAF7]"
              }`}
            >
              {task.priority}
            </span>
          </label>
        ))}
      </div>

      {/* Footer Info */}
      <div className="pt-2 text-[11px] text-[#66788A] flex items-center justify-between">
        <span>متبقي {tasks.filter((t) => !t.completed).length} مهام معلقة</span>
        <span className="text-[10px] text-[#2D78B7]">متزامنة مع التقويم الدراسي</span>
      </div>
    </div>
  );
}

