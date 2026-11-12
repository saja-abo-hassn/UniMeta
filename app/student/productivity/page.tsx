"use client";

import React from "react";
import dynamic from "next/dynamic";
import { usePomodoro } from "./hooks/use-pomodoro";
import { ProductivityHeader } from "./components/productivity-header";
import { ProductivityKPIs } from "./components/productivity-kpis";
import { PomodoroTimerCard } from "./components/pomodoro-timer-card";
import { WeeklyFocusChart } from "./components/weekly-focus-chart";
import { StudyTasksCard } from "./components/study-tasks-card";
import { QuickNotesSection } from "./components/quick-notes-section";

export type { StudyTask, PomodoroSettings, PomodoroStats } from "./types";

const DynamicPomodoroSettingsModal = dynamic(
  () =>
    import("./components/pomodoro-settings-modal").then(
      (m) => m.PomodoroSettingsModal
    ),
  { ssr: false }
);

export default function StudentProductivityPage() {
  const {
    settings,
    setSettings,
    stats,
    sessionType,
    timerRunning,
    showSettingsModal,
    setShowSettingsModal,
    customStudyInput,
    setCustomStudyInput,
    customShortBreakInput,
    setCustomShortBreakInput,
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
  } = usePomodoro();

  return (
    <div className="space-y-6 animate-fade-in" dir="rtl">
      <ProductivityHeader onOpenSettings={() => setShowSettingsModal(true)} />

      <ProductivityKPIs
        stats={stats}
        totalHours={totalHours}
        remainingMinutes={remainingMinutes}
        focusRate={focusRate}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <PomodoroTimerCard
          sessionType={sessionType}
          settings={settings}
          setSettings={setSettings}
          timerStr={timerStr}
          timerRunning={timerRunning}
          onSwitchSessionType={handleSwitchSessionType}
          onToggleTimer={handleToggleTimer}
          onResetTimer={handleResetTimer}
        />

        <section className="lg:col-span-7 space-y-6">
          <WeeklyFocusChart
            stats={stats}
            maxWeeklyMinutes={maxWeeklyMinutes}
          />

          <StudyTasksCard
            tasks={tasks}
            newTitle={newTitle}
            setNewTitle={setNewTitle}
            onAddTask={handleAddTask}
            onToggleTask={toggleTask}
          />
        </section>
      </div>

      <QuickNotesSection
        notes={notes}
        setNotes={setNotes}
        savedNotice={savedNotice}
        setSavedNotice={setSavedNotice}
      />

      <DynamicPomodoroSettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        settings={settings}
        setSettings={setSettings}
        customStudyInput={customStudyInput}
        setCustomStudyInput={setCustomStudyInput}
        customShortBreakInput={customShortBreakInput}
        setCustomShortBreakInput={setCustomShortBreakInput}
      />
    </div>
  );
}
