"use client";
import { useState } from "react";
import { apiClient } from "@/src/services/api-client";
import { requireData } from "@/src/services/api-result";
import { useStudyPlan } from "@/src/contexts/study-plan-context";
interface Row {name:string;grade:string;credit_hours:string;}
const input="border border-[#D7EAF7] rounded-xl p-3 w-full";
export function LiveGpa() {
  const {selectedPlan,courseGrades}=useStudyPlan();
  const [rows,setRows]=useState<Row[]>([{name:"",grade:"",credit_hours:"3"}]);
  const [mode,setMode]=useState("semester");
  const [previousAverage,setPreviousAverage]=useState("");
  const [previousHours,setPreviousHours]=useState("");
  const [result,setResult]=useState<{average:number;hours:number}|null>(null);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const calculate=async(e:React.FormEvent)=>{
    e.preventDefault();setBusy(true);setError("");setResult(null);
    const courses=rows.map(r=>({name:r.name,grade:Number(r.grade),credit_hours:Number(r.credit_hours)}));
    try {
      if(mode==="predict"){
        const r=requireData(await apiClient.post<{predicted_average:number;predicted_total_hours:number}>("/calculators/predict-average",{current_average:Number(previousAverage),current_hours:Number(previousHours),courses}));
        setResult({average:r.predicted_average,hours:r.predicted_total_hours});
      }else{
        const semester=requireData(await apiClient.post<{semester_average:number;semester_total_hours:number}>("/calculators/semester-average",{courses}));
        if(mode==="semester")setResult({average:semester.semester_average,hours:semester.semester_total_hours});
        else {const r=requireData(await apiClient.post<{cumulative_average:number;total_hours:number}>("/calculators/cumulative-average",{previous_average:Number(previousAverage),previous_hours:Number(previousHours),current_average:semester.semester_average,current_hours:semester.semester_total_hours}));setResult({average:r.cumulative_average,hours:r.total_hours});}
      }
    }catch(e){setError((e as Error).message);}finally{setBusy(false);}
  };
  const update=(index:number,key:keyof Row,value:string)=>{setRows(prev=>prev.map((r,i)=>i===index?{...r,[key]:value}:r));setResult(null);};
  return <div dir="rtl" className="space-y-6"><header className="p-8 rounded-3xl bg-gradient-to-l from-[#0057C8] to-[#16324A] text-white"><h1 className="text-2xl font-bold">حاسبة المعدل</h1><p className="mt-2">حساب المعدل الفصلي والتراكمي وتوقع المعدل من 100</p></header><form onSubmit={calculate} className="bg-white border rounded-3xl p-6 space-y-5">{error&&<p role="alert" className="text-red-800 bg-red-50 p-3 rounded-xl">{error}</p>}<label className="block">نوع الحساب<select className={input+" mt-2"} value={mode} onChange={e=>{setMode(e.target.value);setResult(null);}}><option value="semester">المعدل الفصلي</option><option value="cumulative">المعدل التراكمي</option><option value="predict">توقع المعدل</option></select></label>
    {mode!=="semester"&&<div className="grid sm:grid-cols-2 gap-4"><label>المعدل السابق<input aria-label="المعدل السابق" required type="number" min={0} max={100} step="0.0001" value={previousAverage} onChange={e=>{setPreviousAverage(e.target.value);setResult(null);}} className={input}/></label><label>الساعات السابقة<input aria-label="الساعات السابقة" required type="number" min={0} max={100000} step="0.0001" value={previousHours} onChange={e=>{setPreviousHours(e.target.value);setResult(null);}} className={input}/></label></div>}
    <div className="flex justify-between items-center gap-3"><h2 className="font-bold">{mode==="predict"?"مواد متوقعة":"مواد الفصل"}</h2><button type="button" className="text-[#0057C8]" onClick={()=>{const saved=selectedPlan.courses.filter(c=>courseGrades[c.code]!==undefined).map(c=>({name:c.name,grade:String(courseGrades[c.code]),credit_hours:String(c.credits)}));if(saved.length)setRows(saved);setResult(null);}}>استيراد المواد ذات العلامات من خطتي</button></div>
    {rows.map((r,i)=><div key={i} className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_auto] gap-3"><input className={input} aria-label={`اسم المادة ${i+1}`} placeholder="اسم المادة" maxLength={255} value={r.name} onChange={e=>update(i,"name",e.target.value)}/><input className={input} aria-label={`علامة المادة ${i+1}`} placeholder="العلامة" required type="number" min={0} max={100} step="0.0001" value={r.grade} onChange={e=>update(i,"grade",e.target.value)}/><input className={input} aria-label={`ساعات المادة ${i+1}`} placeholder="الساعات" required type="number" min={0} max={1000} step="0.0001" value={r.credit_hours} onChange={e=>update(i,"credit_hours",e.target.value)}/><button type="button" disabled={rows.length===1} className="text-red-700 disabled:opacity-30" onClick={()=>{setRows(prev=>prev.filter((_,j)=>i!==j));setResult(null);}}>حذف</button></div>)}
    <div className="flex justify-between"><button type="button" disabled={rows.length>=100} onClick={()=>setRows(prev=>[...prev,{name:"",grade:"",credit_hours:"3"}])} className="text-[#0057C8]">+ إضافة مادة</button><button disabled={busy} className="bg-[#0057C8] text-white rounded-xl px-5 py-3 disabled:opacity-50">{busy?"جارٍ الحساب…":"احسب المعدل"}</button></div></form>{result&&<section role="status" className="p-8 bg-white border rounded-3xl"><h2 className="font-bold">{mode==="predict"?"المعدل المتوقع":"المعدل المحسوب"}</h2><p className="text-4xl text-[#0057C8] font-bold mt-3">{result.average.toFixed(2)}%</p><p className="mt-3">إجمالي الساعات: {result.hours}</p><p className="text-sm text-slate-500 mt-3">تقدير من الأرقام المدخلة؛ لا يعدّل علاماتك المحفوظة.</p></section>}</div>;
}
