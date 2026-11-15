"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { apiClient } from "@/src/services/api-client";
import { requireData } from "@/src/services/api-result";
interface Student {id:number;full_name:string;account_status:string;created_at:string;}
interface Audit {id:number;action:string;entity_id:number;reason:string|null;created_at:string;}
export function LiveAdminAccounts() {
  const [students,setStudents]=useState<Student[]>([]);
  const [logs,setLogs]=useState<Audit[]>([]);
  const [reason,setReason]=useState("");
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);
  const [loading,setLoading]=useState(true);
  const load=useCallback(async()=>{
    const [s,a]=await Promise.all([apiClient.all<Student>("/admin/users"),apiClient.all<Audit>("/admin/audit-logs")]);setStudents(requireData(s));setLogs(requireData(a));
  },[]);
  useEffect(()=>{
    let active=true;
    void Promise.all([apiClient.all<Student>("/admin/users"),apiClient.all<Audit>("/admin/audit-logs")]).then(([s,a])=>{if(active){setStudents(requireData(s));setLogs(requireData(a));}}).catch(e=>{if(active)setError(e.message);}).finally(()=>{if(active)setLoading(false);});
    return()=>{active=false;};
  },[]);
  const change=async(student:Student)=>{if(busy)return;setBusy(true);setError("");try{requireData(await apiClient.patch(`/admin/users/${student.id}/status`,{status:student.account_status==="ACTIVE"?"SUSPENDED":"ACTIVE",reason}));setReason("");await load();}catch(e){setError((e as Error).message);}finally{setBusy(false);}};
  return <div dir="rtl" className="space-y-6"><h1 className="text-2xl font-bold">إدارة حسابات الطلاب</h1>{error&&<p role="alert" className="bg-red-50 text-red-800 p-4 rounded-xl">{error}</p>}{loading&&<p role="status">جارٍ التحميل…</p>}<label className="block">سبب تغيير الحالة<input value={reason} onChange={e=>setReason(e.target.value)} maxLength={1000} className="block w-full border rounded-xl p-3 mt-2" placeholder="اكتب السبب قبل تعليق الحساب أو إعادة تفعيله"/></label><div className="bg-white rounded-2xl border overflow-x-auto"><table className="w-full text-right"><thead><tr><th className="p-4">الطالب</th><th>الحالة</th><th>تاريخ التسجيل</th><th>الإجراء</th></tr></thead><tbody>{students.map(s=><tr key={s.id} className="border-t"><td className="p-4">{s.full_name}</td><td>{s.account_status==="ACTIVE"?"نشط":"معلق"}</td><td>{new Date(s.created_at).toLocaleDateString("ar-PS")}</td><td><button disabled={busy||!reason.trim()} onClick={()=>void change(s)} className="text-[#0057C8] disabled:opacity-40">{s.account_status==="ACTIVE"?"تعليق":"تفعيل"}</button></td></tr>)}</tbody></table></div><section className="bg-white border rounded-2xl p-6 space-y-3"><h2 className="font-bold">سجل التدقيق</h2>{logs.map(l=><article key={l.id} className="border-b pb-3"><p>{l.action} · #{l.entity_id}</p><p>{l.reason}</p><time className="text-sm text-slate-500">{new Date(l.created_at).toLocaleString("ar-PS")}</time></article>)}</section></div>;
}
export function LiveAdminOverview() {
  const [counts,setCounts]=useState<Record<string,number>>({});
  const labels:Record<string,string>={total_students:"إجمالي الطلاب",total_agreements:"الاتفاقيات",pending_agreements:"بانتظار المراجعة",active_agreements:"الاتفاقيات النشطة",overdue_agreements:"الاتفاقيات المتأخرة",open_reports:"البلاغات المفتوحة",content_count:"ملفات المكتبة",covered_courses:"المواد المغطاة",total_courses:"إجمالي المواد"};
  const [error,setError]=useState("");
  useEffect(()=>{void apiClient.get<Record<string,number>>("/admin/dashboard/overview").then(requireData).then(setCounts).catch(e=>setError(e.message));},[]);
  return <div className="space-y-6" dir="rtl"><h1 className="text-2xl font-bold">لوحة الإدارة</h1>{error&&<p role="alert">{error}</p>}<div className="grid sm:grid-cols-3 gap-4">{Object.entries(counts).map(([key,value])=><article key={key} className="bg-white border rounded-3xl p-6"><h2>{labels[key]??key}</h2><p className="text-4xl font-bold text-[#0057C8] mt-3">{value}</p></article>)}</div><div className="grid sm:grid-cols-2 gap-4"><Link href="/admin/students" className="bg-white rounded-2xl border p-6 font-bold">إدارة الطلاب وسجل التدقيق ←</Link><Link href="/admin/library" className="bg-white rounded-2xl border p-6 font-bold">إدارة المكتبة الرقمية ←</Link></div></div>;
}
