"use client";
import { useEffect, useState } from "react";
import { apiClient } from "@/src/services/api-client";
import { requireData } from "@/src/services/api-result";
import { InterestsHeader } from "@/app/student/interests/components/interests-header";
interface Question {id:number;text:string;options:{id:number;text:string}[];}
interface Attempt {id:number;title:string;status:string;questions:Question[];answers:{question_id:number;option_id:number}[];}
interface Result {categories:{code:string;name:string;description:string|null;percentage:string;rank:number}[];}
export function LiveInterests() {
  const [attempt,setAttempt]=useState<Attempt|null>(null);
  const [activeTest,setActiveTest]=useState<{title:string;question_count:number}|null>(null);
  const [answers,setAnswers]=useState<Record<number,number>>({});
  const [result,setResult]=useState<Result|null>(null);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const [history,setHistory]=useState<{id:number;status:string}[]>([]);
  useEffect(()=>{
    let active=true;
    const load=async()=>{
      const history=requireData(await apiClient.all<{id:number;status:string}>("/students/me/interest-attempts"));
      if(active)setHistory(history);
      const unfinished=history.find(a=>a.status==="IN_PROGRESS");
      if(unfinished){const a=requireData(await apiClient.get<Attempt>(`/interest-attempts/${unfinished.id}`));if(active){setAttempt(a);setAnswers(Object.fromEntries(a.answers.map(x=>[x.question_id,x.option_id])));}}
      else {const test=requireData(await apiClient.get<{title:string;question_count:number}>("/interest-tests/active"));if(active)setActiveTest(test);}
    };
    void load().catch(e=>{if(active)setError(e.message);});return()=>{active=false;};
  },[]);
  const start=async()=>{setBusy(true);setError("");try{const a=requireData(await apiClient.post<Attempt>("/interest-attempts",{}));setAttempt(a);setAnswers({});setResult(null);}catch(e){setError((e as Error).message);}finally{setBusy(false);}};
  const answer=async(question_id:number,option_id:number)=>{
    if(!attempt||busy)return;setBusy(true);setError("");
    try{requireData(await apiClient.put(`/interest-attempts/${attempt.id}/answers`,{answers:[{question_id,option_id}]}));setAnswers(prev=>({...prev,[question_id]:option_id}));}
    catch(e){setError((e as Error).message);}finally{setBusy(false);}
  };
  const submit=async()=>{if(!attempt)return;setBusy(true);setError("");try{setResult(requireData(await apiClient.post<Result>(`/interest-attempts/${attempt.id}/submit`)));}catch(e){setError((e as Error).message);}finally{setBusy(false);}};
  const previousResult=async(id:number)=>{setBusy(true);setError("");try{setResult(requireData(await apiClient.get<Result>(`/interest-attempts/${id}/result`)));}catch(e){setError((e as Error).message);}finally{setBusy(false);}};
  return <div className="space-y-6" dir="rtl"><InterestsHeader/>{error&&<p role="alert" className="p-4 bg-red-50 text-red-800 rounded-xl">{error}</p>}
    {history.some(a=>a.status==="SUBMITTED")&&<section className="bg-white rounded-2xl border p-5 space-y-3"><h2 className="font-bold">نتائجي السابقة</h2><div className="flex flex-wrap gap-3">{history.filter(a=>a.status==="SUBMITTED").map(a=><button key={a.id} disabled={busy} className="text-[#0057C8]" onClick={()=>void previousResult(a.id)}>المحاولة #{a.id}</button>)}</div></section>}
    {!attempt&&<section className="bg-white border rounded-3xl p-8 space-y-4"><h2 className="text-xl font-bold">{activeTest?.title??"اختبار الميول"}</h2>{activeTest&&<p>{activeTest.question_count} سؤالًا</p>}<button disabled={busy} className="bg-[#0057C8] text-white rounded-xl p-3 disabled:opacity-50" onClick={()=>void start()}>بدء محاولة جديدة</button></section>}
    {attempt&&!result&&<><p>تم حفظ {Object.keys(answers).length} من {attempt.questions.length} إجابة</p>{attempt.questions.map((q,i)=><section key={q.id} className="bg-white border border-[#D7EAF7] rounded-2xl p-6 space-y-4"><h2 className="font-bold">{i+1}. {q.text}</h2>{q.options.map(o=><label key={o.id} className="flex gap-3 p-3 border rounded-xl cursor-pointer"><input type="radio" name={`question-${q.id}`} checked={answers[q.id]===o.id} disabled={busy} onChange={()=>void answer(q.id,o.id)}/>{o.text}</label>)}</section>)}<button disabled={busy||Object.keys(answers).length!==attempt.questions.length} onClick={()=>void submit()} className="p-3 rounded-xl bg-[#0057C8] text-white disabled:opacity-50">إنهاء الاختبار وعرض النتيجة</button></>}
    {result&&<section className="bg-white border rounded-3xl p-8 space-y-5"><h2 className="text-xl font-bold">نتائج الميول</h2><p>مؤشرات إرشادية تساعدك على فهم ميولك الدراسية.</p>{result.categories.map(c=><article key={c.code}><div className="flex justify-between"><h3>{c.name}</h3><span>{c.percentage}%</span></div><progress className="w-full" value={Number(c.percentage)} max={100}/><p className="text-sm text-slate-500">{c.description}</p></article>)}<button disabled={busy} onClick={()=>void start()} className="text-[#0057C8]">إعادة الاختبار</button></section>}
  </div>;
}
