import { apiClient } from "./api-client";
import { requireData } from "./api-result";
import type { ChatMessage, ChatSource } from "./ai-chat-service";
const replyTimeoutMs = 70_000;
export interface ChatSession { id:number; title:string|null; }
interface Message {id:number;role:"user"|"assistant"|"system";content:string;created_at:string;sources?:ChatSource[]|null;}
const view=(m:Message):ChatMessage=>({id:String(m.id),sender:m.role,text:m.content,timestamp:m.created_at,sources:m.sources??undefined});
export const liveChatService={
  async publicSend(message:string,history:ChatMessage[],signal?:AbortSignal){
    const response=await apiClient.post<{answer:string;sources:ChatSource[]}>("/ai/assistant",{message,history:history.filter(m=>m.sender!=="system" && m.text.trim()).slice(-8).map(m=>({role:m.sender,content:Array.from(m.text).slice(0,2000).join("")}))},replyTimeoutMs,signal);
    if(response.status===503)throw new Error("خدمة المساعد غير متاحة حاليًا. حاول لاحقًا.");
    if(response.status!==undefined&&response.status>=500)throw new Error(`تعذر على خادم المساعد معالجة الرسالة (HTTP ${response.status}). حاول مرة أخرى بعد قليل.`);
    const saved=requireData(response), timestamp=new Date().toISOString(),id=String(Date.now());
    if(typeof saved.answer!=="string"||!saved.answer.trim())throw new Error("وصل رد من الخادم بصيغة لا تحتوي على نص إجابة. يلزم تأكيد عقد استجابة المساعد.");
    return [{id:`guest-user-${id}`,sender:"user" as const,text:message,timestamp},{id:`guest-assistant-${id}`,sender:"assistant" as const,text:saved.answer,timestamp,sources:saved.sources}];
  },
  async sessions(){return requireData(await apiClient.all<ChatSession>("/ai/sessions"));},
  async create(title:string,signal?:AbortSignal){return requireData(await apiClient.post<ChatSession>("/ai/sessions",{title:title.slice(0,128)},30_000,signal));},
  async messages(id:number){return requireData(await apiClient.all<Message>(`/ai/sessions/${id}/messages`)).map(view);},
  async send(id:number,message:string,signal?:AbortSignal){const r=await apiClient.post<Message[]>(`/ai/sessions/${id}/messages`,{message},replyTimeoutMs,signal);if(r.status===503)throw new Error("خدمة المساعد غير مفعّلة أو غير متاحة حاليًا. حاول لاحقًا.");if(r.status!==undefined&&r.status>=500)throw new Error(`تعذر على خادم المساعد معالجة الرسالة (HTTP ${r.status}). حاول مرة أخرى بعد قليل.`);return requireData(r).map(view);},
  async remove(id:number){const r=await apiClient.delete(`/ai/sessions/${id}`);if(r.errors)throw new Error(r.message);},
};
