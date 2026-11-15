"use client";
import { useState } from "react";
import { apiClient } from "@/src/services/api-client";
import { requireData } from "@/src/services/api-result";
import { BackendUser, toUser } from "@/src/services/user-adapter";
import { authService } from "@/src/services/auth-service";
import { useAuth } from "@/src/contexts/auth-context";
import {LiveProfileDetails} from "./live-profile-details";
import Link from "next/link";
export function LiveProfile() {
  const {user}=useAuth();
  const [name,setName]=useState(user?.name??"");
  const [studentId,setStudentId]=useState(user?.studentId??"");
  const [faculty,setFaculty]=useState(user?.faculty??"");
  const [notice,setNotice]=useState("");
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);
  const save=async(e:React.FormEvent)=>{e.preventDefault();setBusy(true);setError("");setNotice("");try{const saved=toUser(requireData(await apiClient.patch<BackendUser>("/users/me/profile",{full_name:name,student_id:studentId||null,faculty:faculty||null})));authService.cacheCurrentUser(saved);window.dispatchEvent(new Event("unimeta_auth_change"));setNotice("تم حفظ بيانات الحساب.");}catch(e){setError((e as Error).message);}finally{setBusy(false);}};
  return <div className="max-w-3xl mx-auto space-y-6" dir="rtl"><h1 className="text-2xl font-bold">إعدادات الحساب</h1><form onSubmit={save} className="bg-white border rounded-3xl p-8 space-y-5">{error&&<p role="alert" className="text-red-700">{error}</p>}{notice&&<p role="status" className="text-emerald-700">{notice}</p>}<label className="block">الاسم الكامل<input required maxLength={255} value={name} onChange={e=>setName(e.target.value)} className="border rounded-xl p-3 block w-full mt-2"/></label><label className="block">الرقم الجامعي<input value={studentId} onChange={e=>setStudentId(e.target.value)} pattern="[0-9]{6,12}" className="border rounded-xl p-3 block w-full mt-2"/></label><label className="block">الكلية<input value={faculty} onChange={e=>setFaculty(e.target.value)} className="border rounded-xl p-3 block w-full mt-2"/></label><p>البريد الإلكتروني: {user?.email} · {user?.emailVerified?"مؤكد":"بانتظار التأكيد"}</p>{!user?.emailVerified&&<div className="flex gap-4 flex-wrap"><button type="button" disabled={busy} className="text-[#0057C8]" onClick={()=>{setBusy(true);void authService.resendVerificationCode(user?.email??"").then(requireData).then(()=>setNotice("تم طلب إرسال رمز التحقق إلى بريدك.")).catch(e=>setError(e.message)).finally(()=>setBusy(false));}}>إرسال رمز تأكيد الإيميل</button><Link className="text-[#0057C8]" href={`/verify-email?email=${encodeURIComponent(user?.email??"")}`}>إدخال رمز التحقق</Link></div>}<button disabled={busy} className="p-3 bg-[#0057C8] text-white rounded-xl disabled:opacity-50">حفظ التغييرات</button></form><LiveProfileDetails/></div>;
}
