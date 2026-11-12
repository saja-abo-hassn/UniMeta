export interface StudyTask {
  id: string;
  title: string;
  duration: string;
  done: boolean;
}

export interface PomodoroSettings {
  studyMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  sessionsBeforeLongBreak: number;
  autoStartBreak: boolean;
}

export interface DayFocusStat {
  dayName: string;
  dayShort: string;
  sessions: number;
  minutes: number;
}

export interface PomodoroStats {
  completedToday: number;
  completedThisWeek: number;
  startedSessions: number;
  totalFocusMinutes: number;
  streakDays: number;
  lastActiveDate: string;
  weeklyHistory: DayFocusStat[];
}

export const DEFAULT_SETTINGS: PomodoroSettings = {
  studyMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  sessionsBeforeLongBreak: 4,
  autoStartBreak: true,
};

export const DEFAULT_WEEKLY_DAYS: DayFocusStat[] = [
  { dayName: "السبت", dayShort: "سبت", sessions: 3, minutes: 75 },
  { dayName: "الأحد", dayShort: "أحد", sessions: 4, minutes: 100 },
  { dayName: "الإثنين", dayShort: "إثنين", sessions: 2, minutes: 50 },
  { dayName: "الثلاثاء", dayShort: "ثلاثاء", sessions: 5, minutes: 125 },
  { dayName: "الأربعاء", dayShort: "أربعاء", sessions: 3, minutes: 75 },
  { dayName: "الخميس", dayShort: "خميس", sessions: 4, minutes: 100 },
  { dayName: "الجمعة", dayShort: "جمعة", sessions: 1, minutes: 25 },
];

export const DEFAULT_STATS: PomodoroStats = {
  completedToday: 3,
  completedThisWeek: 22,
  startedSessions: 26,
  totalFocusMinutes: 550,
  streakDays: 4,
  lastActiveDate: new Date().toISOString().split("T")[0],
  weeklyHistory: DEFAULT_WEEKLY_DAYS,
};

