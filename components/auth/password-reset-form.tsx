"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { apiClient } from "@/src/services/api-client";
export function PasswordResetForm({reset=false}:{reset?:boolean}) {
  const query=useSearchParams();
  const [email,setEmail]=useState(query.get("email")??"");
  const [password,setPassword]=useState("");
  const [confirm,setConfirm]=useState("");
  const [busy,setBusy]=useState(false);
  const [notice,setNotice]=useState("");
  const [error,setError]=useState("");
  const submit=async(e:React.FormEvent)=>{
    e.preventDefault();setError("");setNotice("");
    if(reset&&password!==confirm){setError("كلمتا المرور غير متطابقتين.");return;}
    if(reset&&!query.get("token")){setError("رابط الاستعادة غير مكتمل. اطلب رابطًا جديدًا.");return;}
    setBusy(true);
    try {
      const response=await apiClient.post(reset?"/auth/reset-password":"/auth/forgot-password",reset?{email,password,token:query.get("token")}:{email});
      if(response.errors||!response.status||response.status>=400)throw new Error(Object.values(response.errors??{}).flat().join(" ")||response.message);
      setNotice(reset?"تم تغيير كلمة المرور. يمكنك تسجيل الدخول الآن.":"إذا كان البريد مسجلًا فستصلك رسالة تحتوي على رابط استعادة كلمة المرور.");
      setPassword("");setConfirm("");
    }catch(e){setError((e as Error).message);}finally{setBusy(false);}
  };
  return <div dir="rtl" className="max-w-md mx-auto my-12 bg-white border border-[#D7EAF7] rounded-3xl p-8 space-y-5"><h1 className="text-2xl font-bold">{reset?"تعيين كلمة مرور جديدة":"استعادة كلمة المرور"}</h1>{error&&<p role="alert" className="text-red-800">{error}</p>}{notice&&<p role="status" className="text-emerald-700">{notice}</p>}<form onSubmit={submit} className="space-y-4"><label className="block">البريد الإلكتروني<input type="email" required value={email} onChange={e=>setEmail(e.target.value)} className="block w-full p-3 border rounded-xl mt-2"/></label>{reset&&<><label className="block">كلمة المرور الجديدة<input type="password" autoComplete="new-password" required minLength={8} value={password} onChange={e=>setPassword(e.target.value)} className="block w-full p-3 border rounded-xl mt-2"/></label><label className="block">تأكيد كلمة المرور<input type="password" autoComplete="new-password" required minLength={8} value={confirm} onChange={e=>setConfirm(e.target.value)} className="block w-full p-3 border rounded-xl mt-2"/></label></>}<button disabled={busy} className="p-3 rounded-xl bg-[#0057C8] text-white w-full disabled:opacity-50">{busy?"جارٍ الإرسال…":reset?"حفظ كلمة المرور":"إرسال رابط الاستعادة"}</button></form><Link href="/login" className="block text-[#0057C8]">العودة لتسجيل الدخول</Link></div>;
}
