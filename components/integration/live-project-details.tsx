"use client";
import { useCallback, useEffect, useState } from "react";
import { apiClient } from "@/src/services/api-client";
import { requireData } from "@/src/services/api-result";
import { useAuth } from "@/src/contexts/auth-context";
import type { Application } from "@/src/services/projects-service";
interface Project {id:number;title:string;description:string;available_slots:number;project_stage:string;owner:{id:number;full_name:string};}
const stages:Record<string,string>={PROJECT_1:"مشروع 1",PROJECT_2:"مشروع 2",BOTH:"مشروع 1 و2"};
const statuses:Record<string,string>={PENDING:"قيد الانتظار",ACCEPTED:"مقبول",REJECTED:"مرفوض",WITHDRAWN:"مسحوب"};
export function LiveProjectDetails({id}:{id:string}) {
  const {user}=useAuth();
  const [project,setProject]=useState<Project|null>(null);
  const [applications,setApplications]=useState<Application[]>([]);
  const [message,setMessage]=useState("");
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);
  const load=useCallback(async()=>{
    const p=requireData(await apiClient.get<Project>(`/graduation-projects/${id}`));setProject(p);
    const owner=String(p.owner.id)===user?.id;
    const a=requireData(await apiClient.all<Application>(owner?`/graduation-projects/${id}/applications`:"/students/me/project-applications"));
    setApplications(owner?a:a.filter(x=>x.project_id===Number(id)));
  },[id,user?.id]);
  useEffect(()=>{
    if(!user)return;
    let active=true;
    void apiClient.get<Project>(`/graduation-projects/${id}`).then(requireData).then(async p=>{
      const owner=String(p.owner.id)===user.id;
      const a=requireData(await apiClient.all<Application>(owner?`/graduation-projects/${id}/applications`:"/students/me/project-applications"));
      if(active){setProject(p);setApplications(owner?a:a.filter(x=>x.project_id===Number(id)));}
    }).catch(e=>{if(active)setError(e.message);});
    return()=>{active=false;};
  },[id,user]);
  const act=async(action:()=>Promise<void>)=>{if(busy)return;setBusy(true);setError("");try{await action();await load();}catch(e){setError((e as Error).message);}finally{setBusy(false);}};
  const owner=project&&String(project.owner.id)===user?.id;
  return <div className="max-w-4xl mx-auto space-y-5" dir="rtl">{error&&<p role="alert" className="p-4 bg-red-50 text-red-800 rounded-xl">{error}</p>}{!project&&!error&&<p role="status">جارٍ تحميل المشروع…</p>}{project&&<><header className="bg-white border rounded-3xl p-8 space-y-3"><h1 className="text-2xl font-bold">{project.title}</h1><p>{project.description}</p><p>قائد الفريق: {project.owner.full_name}</p><p>{stages[project.project_stage]} · الأماكن المتاحة: {project.available_slots}</p></header>
    {owner&&<details className="bg-white border rounded-2xl p-6"><summary>تعديل إعلان المشروع</summary><form key={project.id} className="space-y-3 mt-3" onSubmit={e=>{e.preventDefault();const fields=Object.fromEntries(new FormData(e.currentTarget));void act(async()=>{requireData(await apiClient.patch(`/graduation-projects/${id}`,fields));});}}><input name="title" required aria-label="عنوان المشروع" defaultValue={project.title} maxLength={255} className="border rounded-xl p-3 w-full"/><textarea required name="description" aria-label="وصف المشروع" defaultValue={project.description} maxLength={5000} className="border rounded-xl p-3 w-full"/><select name="project_stage" aria-label="مرحلة المشروع" defaultValue={project.project_stage} className="border rounded-xl p-3 w-full">{Object.entries(stages).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select><button disabled={busy} className="text-blue-700">حفظ الإعلان</button></form></details>}
    {!owner&&project.available_slots>0&&!applications.some(a=>a.status==="PENDING"||a.status==="ACCEPTED")&&<form className="bg-white border rounded-2xl p-6 space-y-3" onSubmit={e=>{e.preventDefault();void act(async()=>{requireData(await apiClient.post(`/graduation-projects/${id}/applications`,{message}));setMessage("");});}}><label className="block">رسالة الانضمام<textarea value={message} onChange={e=>setMessage(e.target.value)} maxLength={2000} className="block w-full border rounded-xl p-3 mt-2"/></label><button disabled={busy} className="bg-[#0057C8] text-white rounded-xl p-3 disabled:opacity-50">إرسال الطلب</button></form>}
    <section className="bg-white border rounded-2xl p-6 space-y-4"><h2 className="font-bold">{owner?"طلبات الانضمام":"طلباتي لهذا المشروع"}</h2>{applications.map(a=><article key={a.id} className="border-b pb-4 space-y-2"><p>{a.applicant?.full_name} · {statuses[a.status]??a.status}</p><p>{a.message}</p>{a.status==="PENDING"&&<div className="flex gap-4">{owner?<><button disabled={busy} onClick={()=>void act(async()=>{requireData(await apiClient.post(`/project-applications/${a.id}/accept`));})} className="text-emerald-700">قبول</button><button disabled={busy} onClick={()=>void act(async()=>{requireData(await apiClient.post(`/project-applications/${a.id}/reject`));})} className="text-red-700">رفض</button></>:<button disabled={busy} onClick={()=>void act(async()=>{requireData(await apiClient.post(`/project-applications/${a.id}/withdraw`));})}>سحب الطلب</button>}</div>}</article>)}</section></>}</div>;
}
