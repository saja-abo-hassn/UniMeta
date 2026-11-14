import { apiClient } from "./api-client";
import { requireData } from "./api-result";
import type { ChatMessage } from "./ai-chat-service";
export interface ChatSession { id:number; title:string|null; }
interface Message {id:number;role:"user"|"assistant"|"system";content:string;created_at:string;}
const view=(m:Message):ChatMessage=>({id:String(m.id),sender:m.role,text:m.content,timestamp:m.created_at});
export const liveChatService={
  async sessions(){return requireData(await apiClient.all<ChatSession>("/ai/sessions"));},
  async create(title:string){return requireData(await apiClient.post<ChatSession>("/ai/sessions",{title:title.slice(0,128)}));},
  async messages(id:number){return requireData(await apiClient.all<Message>(`/ai/sessions/${id}/messages`)).map(view);},
  async send(id:number,message:string){const r=await apiClient.post<Message[]>(`/ai/sessions/${id}/messages`,{message});if(r.status===503)throw new Error("خدمة المساعد غير مفعّلة أو غير متاحة حاليًا. حاول لاحقًا.");return requireData(r).map(view);},
  async remove(id:number){const r=await apiClient.delete(`/ai/sessions/${id}`);if(r.errors)throw new Error(r.message);},
};
