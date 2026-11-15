"use client";
import { useEffect, useState } from "react";
export function ApiErrorNotice() {
  const [message, setMessage] = useState("");
  useEffect(() => {
    const listener = (event: Event) => setMessage((event as CustomEvent<string>).detail);
    window.addEventListener("unimeta_api_error", listener);
    return () => window.removeEventListener("unimeta_api_error", listener);
  }, []);
  return message ? <div role="alert" className="fixed bottom-5 inset-x-5 z-[100] rounded-xl bg-red-50 border border-red-300 text-red-900 p-4 shadow-lg flex justify-between gap-4"><span>{message}</span><button type="button" onClick={() => setMessage("")} aria-label="إغلاق">×</button></div> : null;
}
