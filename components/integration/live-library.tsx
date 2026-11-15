"use client";
import { useCallback, useEffect, useState } from "react";
import { apiClient, API_CONFIG } from "@/src/services/api-client";
import { requireData } from "@/src/services/api-result";

import { LibraryResourceActions, LibrarySubjectActions } from "./live-library-actions";
import { LiveContributions } from "./live-contributions";

interface Subject { id:number; subject_name:string; subject_code:string; major_id?:number; description:string|null; file_count?:number; }
interface Resource { id:number; subject_id:number; title:string; description:string|null; resource_type:string; mime_type:string; file_size:number; visibility_status?:string; }
const types: Record<string,string> = {SUMMARY:"ملخص",LECTURE:"محاضرة",STUDY_NOTE:"ملاحظات دراسية",EXAM_MODEL:"نموذج امتحان",APPROVED_REFERENCE:"مرجع",AUTHORIZED_DIGITAL_BOOK:"كتاب رقمي"};
const input="w-full p-3 rounded-xl border border-[#D7EAF7] bg-white";
const button="px-4 py-2 rounded-xl bg-[#0057C8] text-white disabled:opacity-50";
export function LiveLibrary({admin=false}:{admin?:boolean}) {
  const [subjects,setSubjects]=useState<Subject[]>([]);
  const [majors,setMajors]=useState<{id:number;name:string}[]>([]);
  const [resources,setResources]=useState<Resource[]>([]);
  const [selected,setSelected]=useState("");
  const [query,setQuery]=useState("");
  const [error,setError]=useState("");
  useEffect(()=>{if(admin)void apiClient.all<{id:number;name:string}>("/admin/majors").then(requireData).then(setMajors).catch(e=>setError(e.message));},[admin]);
  const [busy,setBusy]=useState(false);
  const [loading,setLoading]=useState(true);
  const prefix=admin?"/admin/library":"/library";
  const loadSubjects=useCallback(async()=>{setSubjects(requireData(await apiClient.all<Subject>(`${prefix}/subjects`)));},[prefix]);
  const loadResources=useCallback(async()=>{
    if (!admin&&!selected){setResources([]);return;}
    setResources(requireData(await apiClient.all<Resource>(admin?`${prefix}/resources${selected?`?subject_id=${selected}`:""}`:`${prefix}/subjects/${selected}/resources`)));
  },[admin,prefix,selected]);
  useEffect(()=>{
    let active=true;
    void apiClient.all<Subject>(`${prefix}/subjects`).then(requireData).then(data=>{if(active)setSubjects(data);}).catch(e=>{if(active)setError(e.message);}).finally(()=>{if(active)setLoading(false);});
    return()=>{active=false;};
  },[prefix]);
  useEffect(()=>{
    if(!admin&&!selected)return;
    let active=true;
    const path=admin?`${prefix}/resources${selected?`?subject_id=${selected}`:""}`:`${prefix}/subjects/${selected}/resources`;
    void apiClient.all<Resource>(path).then(requireData).then(data=>{if(active)setResources(data);}).catch(e=>{if(active)setError(e.message);});
    return()=>{active=false;};
  },[admin,prefix,selected]);
  const act=async(action:()=>Promise<void>)=>{if(busy)return;setBusy(true);setError("");try{await action();}catch(e){setError(e instanceof Error?e.message:"تعذر إتمام الطلب");}finally{setBusy(false);}};
  const upload=(e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();const form=e.currentTarget;const body=new FormData(form);
    void act(async()=>{requireData(await apiClient.upload(`${prefix}/resources`,body));form.reset();await loadResources();await loadSubjects();});
  };
  const addSubject=(e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();const form=e.currentTarget;const data=Object.fromEntries(new FormData(form));
    void act(async()=>{requireData(await apiClient.post(`${prefix}/subjects`,{...data,major_id:Number(data.major_id)}));form.reset();await loadSubjects();});
  };
  return <div className="space-y-6" dir="rtl">
    <header className="rounded-3xl bg-gradient-to-l from-[#0057C8] to-[#16324A] text-white p-8"><h1 className="text-2xl font-bold">{admin?"إدارة المكتبة الرقمية":"المكتبة الرقمية"}</h1><p className="mt-2">المراجع والملخصات والمواد الدراسية</p></header>
    {error&&<div role="alert" className="p-4 bg-red-50 text-red-800 rounded-xl">{error}<button className="ms-4 underline" onClick={()=>void act(async()=>{await loadSubjects();await loadResources();})}>إعادة المحاولة</button></div>}
    {loading?<p role="status">جارٍ تحميل المكتبة…</p>:<div className="flex gap-3 flex-wrap"><input aria-label="بحث" placeholder="ابحث باسم المادة أو رمزها" className={input+" max-w-sm"} value={query} onChange={e=>setQuery(e.target.value)}/><select aria-label="المادة" className={input+" max-w-sm"} value={selected} onChange={e=>{setSelected(e.target.value);setResources([]);}}><option value="">{admin?"جميع المواد":"اختر مادة"}</option>{subjects.filter(s=>`${s.subject_name} ${s.subject_code}`.includes(query)).map(s=><option key={s.id} value={s.id}>{s.subject_code} — {s.subject_name}</option>)}</select></div>}
    {!loading&&subjects.length===0&&<p>لا توجد مواد منشورة بعد.</p>}
    <div className="grid md:grid-cols-2 gap-4">{resources.map(r=><article key={r.id} className="p-5 bg-white rounded-2xl border border-[#D7EAF7] space-y-3"><h2 className="font-bold">{r.title}</h2><p>{r.description}</p><p className="text-sm text-slate-500">{types[r.resource_type]??r.resource_type} · {(r.file_size/1024/1024).toFixed(2)} MB {r.visibility_status&&`· ${r.visibility_status==="VISIBLE"?"منشور":"مخفي"}`}</p>{!admin?<div className="flex gap-3"><a className={button+" inline-block"} href={`/api/backend/library/resources/${r.id}/download`}>تنزيل الملف</a>{r.mime_type==="application/pdf"&&<a href={`/api/backend/library/resources/${r.id}/preview`} target="_blank" rel="noopener noreferrer" className="text-blue-700 p-2">معاينة PDF</a>}</div>:<div className="flex gap-2"><button disabled={busy} className={button} onClick={()=>void act(async()=>{requireData(await apiClient.patch(`${prefix}/resources/${r.id}`,{visibility_status:r.visibility_status==="VISIBLE"?"HIDDEN":"VISIBLE"}));await loadResources();})}>{r.visibility_status==="VISIBLE"?"إخفاء":"نشر"}</button><button disabled={busy} className="text-red-700" onClick={()=>void act(async()=>{const result=await apiClient.delete(`${prefix}/resources/${r.id}`);if(result.errors)throw new Error(result.message);await loadResources();await loadSubjects();})}>حذف</button></div>}{admin&&<LibraryResourceActions resource={r} onSaved={loadResources}/>}</article>)}</div>
    {selected&&resources.length===0&&<p>لا توجد ملفات لهذه المادة.</p>}
    {admin&&subjects.find(s=>String(s.id)===selected)&&<LibrarySubjectActions subject={subjects.find(s=>String(s.id)===selected)!} majors={majors} onSaved={loadSubjects}/>}
    {admin&&<div className="grid lg:grid-cols-2 gap-6"><form onSubmit={upload} className="p-6 bg-white rounded-2xl border space-y-3"><h2 className="font-bold">رفع ملف</h2><p className="text-sm">الحد المتاح للملف: {API_CONFIG.maxUploadMb} MB</p><select name="subject_id" required aria-label="مادة الملف" className={input}><option value="">اختر مادة</option>{subjects.map(s=><option key={s.id} value={s.id}>{s.subject_name}</option>)}</select><input required name="title" maxLength={255} placeholder="عنوان الملف" aria-label="عنوان الملف" className={input}/><textarea name="description" placeholder="الوصف" aria-label="الوصف" className={input}/><select name="resource_type" aria-label="نوع الملف" className={input}>{Object.entries(types).map(([key,label])=><option key={key} value={key}>{label}</option>)}</select><select name="visibility_status" aria-label="النشر" className={input}><option value="HIDDEN">مخفي</option><option value="VISIBLE">منشور للطلاب</option></select><input name="file" type="file" accept=".pdf,.docx,.pptx" required aria-label="الملف"/><button disabled={busy} className={button}>رفع الملف</button></form>
    <form onSubmit={addSubject} className="p-6 bg-white rounded-2xl border space-y-3"><h2 className="font-bold">إضافة مادة للمكتبة</h2><input name="subject_name" required placeholder="اسم المادة" aria-label="اسم المادة" className={input}/><input name="subject_code" required placeholder="رمز المادة" aria-label="رمز المادة" className={input}/><select name="major_id" required aria-label="التخصص" className={input}><option value="">اختر التخصص</option>{majors.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}</select><textarea name="description" aria-label="وصف المادة" placeholder="الوصف" className={input}/><button disabled={busy} className={button}>إضافة المادة</button></form></div>}
    <LiveContributions admin={admin} subjects={subjects}/>
  </div>;
}
