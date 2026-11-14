/**
 * UniMeta AI Chat Service Interface
 * Prepared architectural layer for future LLM / backend API integration.
 * Currently returns local service status without sending fake network requests.
 */

export interface ChatSource { id:string; title:string; url:string; content?:string; }
export interface ChatMessage {
  id: string;
  sender: "user" | "assistant" | "system";
  text: string;
  timestamp: string;
  sources?: ChatSource[];
}

export interface AiChatService {
  sendMessage(message: string): Promise<ChatMessage>;
  getInitialWelcome(): ChatMessage;
  isReady(): boolean;
}

export class StubAiChatService implements AiChatService {
  isReady(): boolean {
    return false; // AI API is pending integration
  }

  getInitialWelcome(): ChatMessage {
    return {
      id: "welcome-0",
      sender: "assistant",
      text: "مرحبًا 👋 أنا UniMeta AI، مساعدك الذكي داخل UniMeta. المساعد الذكي قيد التجهيز وسيتم تفعيله قريبًا.",
      timestamp: "2026-11-08T00:00:00.000Z",
    };
  }

  async sendMessage(message: string): Promise<ChatMessage> {
    void message;
    // API is not yet connected — return polite readiness message
    return {
      id: "notice-future",
      sender: "assistant",
      text: "ميزة المحادثة التفاعلية الذكية قيد التجهيز الفني والربط الأكاديمي حاليًا، وسيتم إطلاقها قريبًا.",
      timestamp: "2026-11-08T00:00:00.000Z",
    };
  }
}

export const aiChatService = new StubAiChatService();
