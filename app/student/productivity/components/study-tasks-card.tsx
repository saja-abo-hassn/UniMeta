import React from "react";
import { StudyTask } from "../types";

interface StudyTasksCardProps {
  tasks: StudyTask[];
  newTitle: string;
  setNewTitle: (title: string) => void;
  onAddTask: (e: React.FormEvent) => void;
  onToggleTask: (id: string) => void;
  onEditTask:(id:string,title:string,description:string)=>void;
  onDeleteTask:(id:string)=>void;
}

export function StudyTasksCard({
  tasks,
  newTitle,
  setNewTitle,
  onAddTask,
  onToggleTask,
  onEditTask,onDeleteTask,
}: StudyTasksCardProps) {
  const completedCount = tasks.filter((t) => t.done).length;

  return (
    <div className="card-hover-effect p-6 rounded-3xl bg-white border border-[#D7EAF7] shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#D7EAF7]">
        <div>
          <h3 className="text-base font-black text-[#16324A]">
            مهام المذاكرة المجدولة
          </h3>
          <span className="text-xs text-[#66788A]">
            {completedCount} من {tasks.length} مهام مكتملة
          </span>
        </div>
      </div>

      <form onSubmit={onAddTask} className="flex gap-2">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="أضف مهمة دراسية لجلسة اليوم..."
          className="flex-1 h-10 px-3.5 rounded-xl border border-[#D7EAF7] text-xs text-[#16324A] placeholder:text-[#66788A]/60 focus:outline-none focus:border-[#4DB7F2] focus:ring-2 focus:ring-[#4DB7F2]/20"
        />
        <button
          type="submit"
          className="px-4 h-10 rounded-xl bg-[#0057C8] hover:bg-[#2D78B7] text-white text-xs font-bold transition-colors"
        >
          إضافة
        </button>
      </form>

      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
              task.done
                ? "bg-slate-50 border-slate-200 opacity-60"
                : "bg-[#F8FBFE] border-[#D7EAF7]/80 hover:border-[#4DB7F2]"
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <input
                type="checkbox"
                aria-label={`إنجاز ${task.title}`}
                checked={task.done}
                onChange={() => onToggleTask(task.id)}
                className="w-4 h-4 rounded border-[#D7EAF7] text-[#0057C8] focus:ring-[#4DB7F2]/30 cursor-pointer"
              />
              <span
                className={`text-xs sm:text-sm font-bold truncate ${
                  task.done ? "line-through text-slate-500" : "text-[#16324A]"
                }`}
              >
                {task.title}
              </span>
            </div>
            <span className="text-[10px] text-[#66788A] shrink-0 font-medium">
              {task.duration}
            </span>
            <details><summary className="text-xs">تعديل</summary><form onSubmit={e=>{e.preventDefault();const v=Object.fromEntries(new FormData(e.currentTarget));onEditTask(task.id,String(v.title),String(v.description));}} className="space-y-2"><input name="title" required aria-label="عنوان المهمة" defaultValue={task.title} maxLength={255} className="border p-2 rounded-lg"/><input name="description" aria-label="وصف المهمة" defaultValue={task.duration} className="border p-2 rounded-lg"/><button className="text-blue-700 text-xs">حفظ</button><button type="button" className="text-red-700 text-xs ms-3" onClick={()=>{if(window.confirm("حذف هذه المهمة؟"))onDeleteTask(task.id);}}>حذف</button></form></details>
          </div>
        ))}
      </div>
    </div>
  );
}

