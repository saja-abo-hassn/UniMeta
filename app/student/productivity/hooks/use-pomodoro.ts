"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useNotifications } from "@/src/contexts/notifications-context";
import {
  PomodoroSettings,
  PomodoroStats,
  StudyTask,
  DEFAULT_SETTINGS,
  DEFAULT_STATS,
} from "../types";

export function usePomodoro() {
  const { notify } = useNotifications();

  const [settings, setSettings] = useState<PomodoroSettings>(DEFAULT_SETTINGS);
  const [stats, setStats] = useState<PomodoroStats>(DEFAULT_STATS);
  const [isClientLoaded, setIsClientLoaded] = useState(false);

  const [sessionType, setSessionType] = useState<"focus" | "shortBreak" | "longBreak">("focus");
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [sessionStartedFlag, setSessionStartedFlag] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const [customStudyInput, setCustomStudyInput] = useState("");
  const [customShortBreakInput, setCustomShortBreakInput] = useState("");
  const [customLongBreakInput, setCustomLongBreakInput] = useState("");

  const [tasks, setTasks] = useState<StudyTask[]>([
    { id: "1", title: "مراجعة خوارزميات الترتيب السريع (QuickSort)", duration: "25 دقيقة", done: true },
    { id: "2", title: "حل مسألة تزامن العمليات في مختبر نظم التشغيل", duration: "45 دقيقة", done: false },
    { id: "3", title: "قراءة الفصل الثالث: نمذجة المتطلبات في هندسة البرمجيات", duration: "25 دقيقة", done: false },
  ]);
  const [newTitle, setNewTitle] = useState("");

  const [notes, setNotes] = useState<string>(
    "ملاحظة للاختبار القادم: التركيز على الاختلافات بين الفئات المجردة والواجهات في لغة جافا، ومراجعة مصفوفات التوزيع التراكمي."
  );
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem("unimeta_pomodoro_settings");
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      }
      const storedStats = localStorage.getItem("unimeta_pomodoro_stats");
      if (storedStats) {
        setStats(JSON.parse(storedStats));
      }
      const storedTasks = localStorage.getItem("unimeta_pomodoro_tasks");
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch {}
    setIsClientLoaded(true);
  }, []);

  useEffect(() => {
    if (isClientLoaded && !timerRunning && !sessionStartedFlag) {
      if (sessionType === "focus") setSecondsLeft(settings.studyMinutes * 60);
      else if (sessionType === "shortBreak") setSecondsLeft(settings.shortBreakMinutes * 60);
      else if (sessionType === "longBreak") setSecondsLeft(settings.longBreakMinutes * 60);
    }
  }, [isClientLoaded, settings, sessionType, timerRunning, sessionStartedFlag]);

  useEffect(() => {
    if (!isClientLoaded) return;
    try {
      localStorage.setItem("unimeta_pomodoro_settings", JSON.stringify(settings));
    } catch {}
  }, [settings, isClientLoaded]);

  useEffect(() => {
    if (!isClientLoaded) return;
    try {
      localStorage.setItem("unimeta_pomodoro_stats", JSON.stringify(stats));
    } catch {}
  }, [stats, isClientLoaded]);

  useEffect(() => {
    if (!isClientLoaded) return;
    try {
      localStorage.setItem("unimeta_pomodoro_tasks", JSON.stringify(tasks));
    } catch {}
  }, [tasks, isClientLoaded]);

  const settingsRef = useRef(settings);
  settingsRef.current = settings;
  const statsRef = useRef(stats);
  statsRef.current = stats;

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (timerRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            handleSessionCompleted();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, secondsLeft]);

  const handleSessionCompleted = () => {
    setTimerRunning(false);
    setSessionStartedFlag(false);

    if (sessionType === "focus") {
      const minutesFocused = settingsRef.current.studyMinutes;
      const todayStr = new Date().toISOString().split("T")[0];
      const prevStats = statsRef.current;
      const isNewDay = prevStats.lastActiveDate !== todayStr;

      const newCompletedToday = isNewDay ? 1 : prevStats.completedToday + 1;
      const newCompletedThisWeek = prevStats.completedThisWeek + 1;
      const newTotalMinutes = prevStats.totalFocusMinutes + minutesFocused;
      const newStreak = isNewDay ? prevStats.streakDays + 1 : prevStats.streakDays;

      const dayIndex = new Date().getDay();
      const mappedIdx = (dayIndex + 1) % 7;
      const updatedHistory = [...prevStats.weeklyHistory];
      if (updatedHistory[mappedIdx]) {
        updatedHistory[mappedIdx] = {
          ...updatedHistory[mappedIdx],
          sessions: updatedHistory[mappedIdx].sessions + 1,
          minutes: updatedHistory[mappedIdx].minutes + minutesFocused,
        };
      }

      setStats({
        ...prevStats,
        completedToday: newCompletedToday,
        completedThisWeek: newCompletedThisWeek,
        totalFocusMinutes: newTotalMinutes,
        streakDays: newStreak,
        lastActiveDate: todayStr,
        weeklyHistory: updatedHistory,
      });

      const isLongBreakTime =
        newCompletedToday > 0 &&
        newCompletedToday % settingsRef.current.sessionsBeforeLongBreak === 0;

      const nextType = isLongBreakTime ? "longBreak" : "shortBreak";
      const nextDuration = isLongBreakTime
        ? settingsRef.current.longBreakMinutes
        : settingsRef.current.shortBreakMinutes;

      notify({
        type: "pomodoro",
        title: "انتهت جلسة التركيز بنجاح! 🍅",
        message: isLongBreakTime
          ? `رائع جداً! أتممت ${settingsRef.current.sessionsBeforeLongBreak} جلسات. خذ استراحة طويلة لمدة ${nextDuration} دقيقة.`
          : `أحسنت! خذ استراحة قصيرة لمدة ${nextDuration} دقائق لتجديد نشاطك.`,
        playSound: true,
        browserNotify: true,
      });

      setSessionType(nextType);
      setSecondsLeft(nextDuration * 60);

      if (settingsRef.current.autoStartBreak) {
        setTimerRunning(true);
      }
    } else {
      notify({
        type: "pomodoro",
        title: "انتهت فترة الاستراحة! ⚡",
        message: "استراحة موفقة! لنبدأ جلسة تركيز جديدة لتحقيق أهدافك.",
        playSound: true,
        browserNotify: true,
      });

      setSessionType("focus");
      setSecondsLeft(settingsRef.current.studyMinutes * 60);
      setTimerRunning(false);
    }
  };

  const handleToggleTimer = () => {
    if (!timerRunning) {
      if (!sessionStartedFlag && sessionType === "focus") {
        setSessionStartedFlag(true);
        setStats((prev) => ({
          ...prev,
          startedSessions: prev.startedSessions + 1,
        }));
      }
      setTimerRunning(true);
    } else {
      setTimerRunning(false);
    }
  };

  const handleResetTimer = () => {
    setTimerRunning(false);
    setSessionStartedFlag(false);

    if (sessionType === "focus") {
      setSecondsLeft(settings.studyMinutes * 60);
    } else if (sessionType === "shortBreak") {
      setSecondsLeft(settings.shortBreakMinutes * 60);
    } else {
      setSecondsLeft(settings.longBreakMinutes * 60);
    }
  };

  const handleSwitchSessionType = (type: "focus" | "shortBreak" | "longBreak") => {
    setSessionType(type);
    setTimerRunning(false);
    setSessionStartedFlag(false);

    if (type === "focus") setSecondsLeft(settings.studyMinutes * 60);
    else if (type === "shortBreak") setSecondsLeft(settings.shortBreakMinutes * 60);
    else if (type === "longBreak") setSecondsLeft(settings.longBreakMinutes * 60);
  };

  const focusRate = useMemo(() => {
    if (stats.startedSessions === 0) return 100;
    const rate = (stats.completedThisWeek / stats.startedSessions) * 100;
    return Math.min(100, Math.max(0, Math.round(rate)));
  }, [stats.completedThisWeek, stats.startedSessions]);

  const totalHours = Math.floor(stats.totalFocusMinutes / 60);
  const remainingMinutes = stats.totalFocusMinutes % 60;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timerStr = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  const maxWeeklyMinutes = useMemo(() => {
    const maxVal = Math.max(...stats.weeklyHistory.map((d) => d.minutes));
    return maxVal > 0 ? maxVal : 120;
  }, [stats.weeklyHistory]);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setTasks((prev) => [
      ...prev,
      { id: Date.now().toString(), title: newTitle.trim(), duration: `${settings.studyMinutes} دقيقة`, done: false },
    ]);
    setNewTitle("");
  };

  return {
    settings,
    setSettings,
    stats,
    sessionType,
    secondsLeft,
    timerRunning,
    showSettingsModal,
    setShowSettingsModal,
    customStudyInput,
    setCustomStudyInput,
    customShortBreakInput,
    setCustomShortBreakInput,
    customLongBreakInput,
    setCustomLongBreakInput,
    tasks,
    newTitle,
    setNewTitle,
    notes,
    setNotes,
    savedNotice,
    setSavedNotice,
    focusRate,
    totalHours,
    remainingMinutes,
    timerStr,
    maxWeeklyMinutes,
    handleToggleTimer,
    handleResetTimer,
    handleSwitchSessionType,
    toggleTask,
    handleAddTask,
  };
}

