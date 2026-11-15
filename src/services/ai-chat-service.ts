import { apiClient } from "./api-client";

export interface ChatSource {
  id: string;
  title: string;
  url: string;
  content?: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant" | "system";
  text: string;
  timestamp: string;
  sources?: ChatSource[];
}

export interface AiChatService {
  sendMessage(message: string, history?: ChatMessage[]): Promise<ChatMessage>;
  getInitialWelcome(): ChatMessage;
  isReady(): boolean;
}

class BackendAiChatService implements AiChatService {
  isReady(): boolean {
    return !apiClient.isUsingMock();
  }

  getInitialWelcome(): ChatMessage {
    return {
      id: "welcome-0",
      sender: "assistant",
      text: "مرحبًا 👋 اكتب سؤالك وسأحاول مساعدتك.",
      timestamp: "2026-11-08T00:00:00.000Z",
    };
  }

  async sendMessage(message: string, history: ChatMessage[] = []): Promise<ChatMessage> {
    if (!this.isReady()) {
      throw new Error("المساعد غير متاح في وضع العرض التجريبي.");
    }

    const response = await apiClient.post<{
      answer?: string;
      sources?: ChatSource[];
    }>("/ai/assistant", {
      message,
      history: history
        .filter((item) => item.sender !== "system")
        .slice(-8)
        .map((item) => ({ role: item.sender, content: item.text.slice(0, 2000) })),
    });

    const answer = response.data?.answer?.trim();
    if (response.errors || response.status === undefined || response.status >= 400) {
      throw new Error(response.message || "تعذر الاتصال بمساعد UniMeta. حاول مجددًا.");
    }
    if (!answer) {
      throw new Error("وصل رد فارغ من خدمة المساعد. حاول مجددًا لاحقًا.");
    }

    return {
      id: `ai-${Date.now()}`,
      sender: "assistant",
      text: answer,
      timestamp: new Date().toISOString(),
      sources: response.data?.sources,
    };
  }
}

export const aiChatService = new BackendAiChatService();
