"use client";

import { useState, useEffect, useMemo } from "react";
import { useStudentUser } from "@/src/hooks/use-student-user";
import { useStudyPlan } from "@/src/contexts/study-plan-context";
import { StudentTaskItem } from "../types";
import { apiClient } from "@/src/services/api-client";
import { requireData, reportApiError } from "@/src/services/api-result";
interface BackendTask {id:number;title:string;due_date:string|null;completed_at:string|null;created_at:string;}
const toTask=(t:BackendTask):StudentTaskItem=>({id:String(t.id),title:t.title,dueDate:t.due_date??undefined,completed:Boolean(t.completed_at),createdAt:t.created_at});

export function useStudentTasks() {
  const { user } = useStudentUser();
  const { selectedPlan, hasPlanSelected } = useStudyPlan();

  const storageKey = useMemo(() => {
    const studentIdentifier = user?.studentId || user?.email || user?.id || "guest";
    return `unimeta_student_tasks_${studentIdentifier}`;
  }, [user]);

  const [tasks, setTasks] = useState<StudentTaskItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [isAdding, setIsAdding] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const [formTitle, setFormTitle] = useState("");
  const [formDueDate, setFormDueDate] = useState("");
  const [formCourseCode, setFormCourseCode] = useState("");

  useEffect(() => {
    if (!apiClient.isUsingMock()) {
      let active = true;
      setTasks([]);setIsLoaded(false);
      if (!user) {setIsLoaded(true);return;}
      void apiClient.all<BackendTask>("/tasks").then(requireData).then(items=>{if(active)setTasks(items.map(toTask));}).catch(reportApiError).finally(()=>{if(active)setIsLoaded(true);});
      return ()=>{active=false;};
    }
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setTasks(parsed);
        } else {
          setTasks([]);
        }
      } else {
        setTasks([]);
      }
    } catch {
      setTasks([]);
    } finally {
      setIsLoaded(true);
    }
  }, [storageKey]);

  const saveTasks = (newTasks: StudentTaskItem[]) => {
    setTasks(newTasks);
    try {
      localStorage.setItem(storageKey, JSON.stringify(newTasks));
    } catch {}
  };

  const availableCourses = useMemo(() => {
    if (!hasPlanSelected || !selectedPlan || !selectedPlan.courses) return [];
    return selectedPlan.courses;
  }, [hasPlanSelected, selectedPlan]);

  const resetForm = () => {
    setEditingTaskId(null);
    setIsAdding(false);
    setFormTitle("");
    setFormDueDate("");
    setFormCourseCode("");
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;
    if (!apiClient.isUsingMock()) {
      try {const task=toTask(requireData(await apiClient.post<BackendTask>("/tasks",{title:formTitle.trim(),due_date:formDueDate||null})));setTasks(prev=>[task,...prev]);resetForm();}catch(error){reportApiError(error);}
      return;
    }

    let matchedCourseName = "";
    if (formCourseCode) {
      const found = availableCourses.find((c) => c.code === formCourseCode);
      matchedCourseName = found ? found.name : formCourseCode;
    }

    const newTask: StudentTaskItem = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      title: formTitle.trim(),
      dueDate: formDueDate || undefined,
      courseCode: formCourseCode || undefined,
      courseName: matchedCourseName || undefined,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    saveTasks([newTask, ...tasks]);
    resetForm();
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTaskId || !formTitle.trim()) return;
    if (!apiClient.isUsingMock()) {
      try {const task=toTask(requireData(await apiClient.patch<BackendTask>(`/tasks/${editingTaskId}`,{title:formTitle.trim(),due_date:formDueDate||null})));setTasks(prev=>prev.map(t=>t.id===task.id?task:t));resetForm();}catch(error){reportApiError(error);}
      return;
    }

    let matchedCourseName = "";
    if (formCourseCode) {
      const found = availableCourses.find((c) => c.code === formCourseCode);
      matchedCourseName = found ? found.name : formCourseCode;
    }

    const updated = tasks.map((t) => {
      if (t.id === editingTaskId) {
        return {
          ...t,
          title: formTitle.trim(),
          dueDate: formDueDate || undefined,
          courseCode: formCourseCode || undefined,
          courseName: matchedCourseName || undefined,
        };
      }
      return t;
    });

    saveTasks(updated);
    resetForm();
  };

  const startEditing = (task: StudentTaskItem) => {
    setEditingTaskId(task.id);
    setFormTitle(task.title);
    setFormDueDate(task.dueDate || "");
    setFormCourseCode(task.courseCode || "");
    setIsAdding(false);
  };

  const toggleComplete = async (taskId: string) => {
    if (!apiClient.isUsingMock()) {
      try {const current=tasks.find(t=>t.id===taskId);if(!current)return;const task=toTask(requireData(await apiClient.patch<BackendTask>(`/tasks/${taskId}`,{completed:!current.completed})));setTasks(prev=>prev.map(t=>t.id===taskId?task:t));}catch(error){reportApiError(error);}
      return;
    }
    const updated = tasks.map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    saveTasks(updated);
  };

  const deleteTask = async (taskId: string) => {
    if (!apiClient.isUsingMock()) {
      try {const response=await apiClient.delete(`/tasks/${taskId}`);if(response.errors)throw new Error(response.message);setTasks(prev=>prev.filter(t=>t.id!==taskId));if(editingTaskId===taskId)resetForm();}catch(error){reportApiError(error);}
      return;
    }
    const updated = tasks.filter((t) => t.id !== taskId);
    saveTasks(updated);
    if (editingTaskId === taskId) {
      resetForm();
    }
  };

  const sortedTasks = useMemo(() => {
    const todayStr = new Date().toISOString().split("T")[0];

    const overdue: StudentTaskItem[] = [];
    const todayList: StudentTaskItem[] = [];
    const upcoming: StudentTaskItem[] = [];
    const completedList: StudentTaskItem[] = [];

    tasks.forEach((t) => {
      if (t.completed) {
        completedList.push(t);
      } else if (t.dueDate) {
        if (t.dueDate < todayStr) {
          overdue.push(t);
        } else if (t.dueDate === todayStr) {
          todayList.push(t);
        } else {
          upcoming.push(t);
        }
      } else {
        upcoming.push(t);
      }
    });

    const sortByDate = (a: StudentTaskItem, b: StudentTaskItem) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.localeCompare(b.dueDate);
    };

    overdue.sort(sortByDate);
    todayList.sort(sortByDate);
    upcoming.sort(sortByDate);

    return {
      overdue,
      todayList,
      upcoming,
      completedList,
      totalActive: overdue.length + todayList.length + upcoming.length,
      totalCompleted: completedList.length,
    };
  }, [tasks]);

  return {
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
  };
}

