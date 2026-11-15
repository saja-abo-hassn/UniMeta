"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { apiClient } from "@/src/services/api-client";
import { requireData, reportApiError } from "@/src/services/api-result";
import { DEFAULT_SETTINGS, DEFAULT_STATS, PomodoroSettings, PomodoroStats, StudyTask } from "../types";

interface Task { id: number; title: string; description: string | null; completed_at: string | null; }
interface Statistics { completed_sessions: number; planned_minutes: number; cancelled_sessions: number; }
const date = (d: Date) => d.toISOString().slice(0,10);
const taskView = (t: Task): StudyTask => ({ id: String(t.id), title: t.title, duration: t.description ?? "", done: Boolean(t.completed_at) });
export function useLivePomodoro() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [stats, setStats] = useState<PomodoroStats>({ ...DEFAULT_STATS, completedToday: 0, completedThisWeek: 0, startedSessions: 0, totalFocusMinutes: 0, streakDays: 0, weeklyHistory: DEFAULT_STATS.weeklyHistory.map(d=>({...d,sessions:0,minutes:0})) });
  const [sessionType, setSessionType] = useState<"focus"|"shortBreak"|"longBreak">("focus");
  const [secondsLeft, setSecondsLeft] = useState(25*60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [customStudyInput, setCustomStudyInput] = useState("");
  const [customShortBreakInput, setCustomShortBreakInput] = useState("");
  const [customLongBreakInput, setCustomLongBreakInput] = useState("");
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [savedNotice, setNotice] = useState(false);
  const session = useRef<number | null>(null);
  const journal = useRef<number | null>(null);
  const settingsWrites = useRef(Promise.resolve());
  const settingsDraft = useRef(DEFAULT_SETTINGS);
  const ready = useRef(false);
  const busy = useRef(false);
  const finishing = useRef(false);
  const refresh = useCallback(async () => {
    const today = new Date();
    const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(today); d.setUTCDate(today.getUTCDate()-((today.getUTCDay()+1)%7)+i); return d; });
    const daily = await Promise.all(days.map(d => apiClient.get<Statistics>(`/focus-statistics?from=${date(d)}&to=${date(d)}`).then(requireData)));
    const todayIndex = (today.getUTCDay()+1)%7;
    let streak=0;
    for(let i=todayIndex;i>=0&&daily[i].completed_sessions>0;i--)streak++;
    return {...DEFAULT_STATS, streakDays:streak, completedToday: daily[todayIndex].completed_sessions,
      completedThisWeek: daily.reduce((n,d)=>n+d.completed_sessions,0),
      startedSessions: daily.reduce((n,d)=>n+d.completed_sessions+d.cancelled_sessions,0),
      totalFocusMinutes: daily.reduce((n,d)=>n+d.planned_minutes,0),
      weeklyHistory: DEFAULT_STATS.weeklyHistory.map((d,i)=>({...d, sessions:daily[i].completed_sessions,minutes:daily[i].planned_minutes})) };
  }, []);
  useEffect(()=>{
    let active = true;
    void Promise.all([apiClient.all<Task>("/tasks"), apiClient.all<{id:number;content:string;journal_date:string}>("/journals"), apiClient.get<PomodoroSettings>("/students/me/pomodoro-settings"), apiClient.get<{id:number;duration_minutes:number;started_at:string}>("/focus-sessions/active")]).then(([t,j,s,a])=>{
      if (!active) return;
      setTasks(requireData(t).map(taskView));
      const latest = requireData(j).sort((a,b)=>b.id-a.id)[0];
      journal.current=latest?.id??null;setNotes(latest?.content??"");
      const saved=requireData(s);setSettings(saved);settingsDraft.current=saved;
      if(a.errors)throw new Error(a.message);
      if(a.data){session.current=a.data.id;setSecondsLeft(Math.max(0,Math.ceil(a.data.duration_minutes*60-(Date.now()-Date.parse(a.data.started_at))/1000)));setTimerRunning(false);}
      else setSecondsLeft(saved.studyMinutes*60);
      ready.current=true;
    }).catch(reportApiError);
    void refresh().then(data=>{if(active)setStats(data);}).catch(reportApiError);
    return ()=>{active=false;};
  },[refresh]);
  useEffect(()=>{
    if (!timerRunning || secondsLeft <= 0) return;
    const tick = window.setTimeout(()=>setSecondsLeft(s=>Math.max(0,s-1)),1000);
    return ()=>window.clearTimeout(tick);
  },[timerRunning,secondsLeft]);
  useEffect(()=>{
    if (!timerRunning || secondsLeft !== 0 || finishing.current) return;
    finishing.current = true;
    const id = session.current;
    const complete = async () => {
      if (id !== null) { requireData(await apiClient.patch(`/focus-sessions/${id}`,{status:"COMPLETED"})); session.current=null; }
      return refresh();
    };
    void complete().then(data=>{
      setStats(data);
      const longBreak=id!==null&&data.completedToday%settings.sessionsBeforeLongBreak===0;
      setSessionType(id===null?"focus":longBreak?"longBreak":"shortBreak");
      setSecondsLeft((id===null?settings.studyMinutes:longBreak?settings.longBreakMinutes:settings.shortBreakMinutes)*60);
      setTimerRunning(id!==null&&settings.autoStartBreak);
    }).catch(error=>{setTimerRunning(false);reportApiError(error);}).finally(()=>{finishing.current=false;});
  },[timerRunning,secondsLeft,refresh,settings]);
  const handleToggleTimer = async () => {
    if(!ready.current){reportApiError(new Error("انتظر تحميل الجلسة المحفوظة؛ أعد تحميل الصفحة إذا تعذر الاتصال."));return;}
    if (busy.current) return;
    if (timerRunning) { setTimerRunning(false); return; }
    busy.current=true;
    try {
      if (sessionType === "focus" && session.current===null) session.current=requireData(await apiClient.post<{id:number}>("/focus-sessions",{duration_minutes:settings.studyMinutes})).id;
      setTimerRunning(true);
    } catch(error) {reportApiError(error);} finally {busy.current=false;}
  };
  const handleSwitchSessionType = async (type: "focus"|"shortBreak"|"longBreak") => {
    if(!ready.current)return;
    if (busy.current) return;
    busy.current=true; setTimerRunning(false);
    try {
      if (session.current!==null) {requireData(await apiClient.patch(`/focus-sessions/${session.current}`,{status:"CANCELLED"}));session.current=null;setStats(await refresh());}
      setSessionType(type);setSecondsLeft((type==="focus"?settings.studyMinutes:type==="shortBreak"?settings.shortBreakMinutes:settings.longBreakMinutes)*60);
    } catch(error){reportApiError(error);}finally{busy.current=false;}
  };
  const toggleTask = async (id:string) => {
    try { const task=tasks.find(t=>t.id===id); if (!task) return;
      const saved=taskView(requireData(await apiClient.patch<Task>(`/tasks/${id}`,{completed:!task.done})));
      setTasks(prev=>prev.map(t=>t.id===id?saved:t));
    }catch(error){reportApiError(error);}
  };
  const handleAddTask = async (e:React.FormEvent) => {
    e.preventDefault();if (!newTitle.trim()) return;
    try {const task=taskView(requireData(await apiClient.post<Task>("/tasks",{title:newTitle.trim()})));setTasks(prev=>[...prev,task]);setNewTitle("");}catch(error){reportApiError(error);}
  };
  const setSavedNotice = (saved:boolean) => {
    if (!saved) {setNotice(false);return;}
    const body={content:notes};
    const request=journal.current===null?apiClient.post<{id:number}>("/journals",{...body,journal_date:date(new Date())}):apiClient.patch<{id:number}>(`/journals/${journal.current}`,body);
    void request.then(requireData).then(saved=>{journal.current=saved.id;setNotice(true);}).catch(reportApiError);
  };
  const applySettings=(next:React.SetStateAction<PomodoroSettings>)=>{
    if(!ready.current)return;
    const proposed=typeof next==="function"?next(settingsDraft.current):next;
    const valid=(n:number)=>Number.isFinite(n)?Math.max(1,Math.min(1440,Math.floor(n))):1;
    const updated={...proposed,studyMinutes:valid(proposed.studyMinutes),shortBreakMinutes:valid(proposed.shortBreakMinutes),longBreakMinutes:valid(proposed.longBreakMinutes),sessionsBeforeLongBreak:Math.min(20,valid(proposed.sessionsBeforeLongBreak))};
    settingsDraft.current=updated;
    settingsWrites.current=settingsWrites.current.catch(()=>undefined).then(async()=>{
      const saved=requireData(await apiClient.put<PomodoroSettings>("/students/me/pomodoro-settings",updated));setSettings(saved);
      if(!timerRunning&&session.current===null)setSecondsLeft((sessionType==="focus"?saved.studyMinutes:sessionType==="shortBreak"?saved.shortBreakMinutes:saved.longBreakMinutes)*60);
    }).catch(reportApiError);
  };
  const editTask=async(id:string,title:string,description:string)=>{try{const saved=taskView(requireData(await apiClient.patch<Task>(`/tasks/${id}`,{title,description:description||null})));setTasks(prev=>prev.map(t=>t.id===id?saved:t));}catch(e){reportApiError(e);}};
  const deleteTask=async(id:string)=>{try{const r=await apiClient.delete(`/tasks/${id}`);if(r.errors)throw new Error(r.message);setTasks(prev=>prev.filter(t=>t.id!==id));}catch(e){reportApiError(e);}};
  return {settings,setSettings:applySettings,stats,sessionType,secondsLeft,timerRunning,showSettingsModal,setShowSettingsModal,
    customStudyInput,setCustomStudyInput,customShortBreakInput,setCustomShortBreakInput,customLongBreakInput,setCustomLongBreakInput,
    tasks,newTitle,setNewTitle,notes,setNotes,savedNotice,setSavedNotice,editTask,deleteTask,
    focusRate:stats.startedSessions?Math.round(stats.completedThisWeek/stats.startedSessions*100):0,
    totalHours:Math.floor(stats.totalFocusMinutes/60),remainingMinutes:stats.totalFocusMinutes%60,
    timerStr:`${String(Math.floor(secondsLeft/60)).padStart(2,"0")}:${String(secondsLeft%60).padStart(2,"0")}`,
    maxWeeklyMinutes:Math.max(1,...stats.weeklyHistory.map(d=>d.minutes)),handleToggleTimer,
    handleResetTimer:()=>handleSwitchSessionType(sessionType),handleSwitchSessionType,toggleTask,handleAddTask};
}
