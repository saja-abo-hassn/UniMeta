import React from "react";
import Image from "next/image";
import { ChatMessage } from "@/src/services/ai-chat-service";

interface ChatMessagesListProps {
  messages: ChatMessage[];
  isTyping: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  isAuthenticated: boolean;
  suggestionsDisabled: boolean;
  onSuggestion: (question: string) => void;
}

export function ChatMessagesList({
  messages,
  isTyping,
  messagesEndRef,
  isAuthenticated,
  suggestionsDisabled,
  onSuggestion,
}: ChatMessagesListProps) {
  const suggestions = [
    { label: "🎓 شو بتقدم المنصة؟", question: "ما الخدمات التي تقدمها منصة UniMeta وكيف أبدأ باستخدامها؟" },
    ...(isAuthenticated
      ? [
          { label: "📋 خطتي الدراسية", question: "ما المعلومات المتاحة عن خطتي الدراسية داخل المنصة؟ اذكر مصادر المعلومات، وإذا لم أختر خطة بعد وضح كيف أختارها." },
          { label: "💰 رسوم تخصصي", question: "ما سعر الساعة المتاح لتخصص خطتي في المنصة وكيف أحسب الرسوم؟ إذا لم تتوفر خطة أو أسعار وضح ذلك." },
        ]
      : [
          { label: "👤 كيف أسجل حساب؟", question: "كيف أنشئ حسابًا في المنصة وأفعل بريدي الإلكتروني؟" },
          { label: "🔑 نسيت كلمة المرور", question: "كيف أستعيد كلمة المرور لحسابي في المنصة؟" },
        ]),
    { label: "📚 كيف أستخدم المكتبة؟", question: "كيف أبحث عن المراجع وأستخدم المكتبة داخل المنصة؟" },
    { label: "📊 كيف أحسب معدلي؟", question: "كيف أستخدم حاسبة المعدل والساعات في المنصة؟" },
    { label: "⏰ ساعدني أنظم دراستي", question: "ساعدني بخطوات بسيطة لتنظيم وقت الدراسة والبدء بجلسة مذاكرة." },
  ];
  return (
    <div className="flex-1 min-h-0 p-4 overflow-y-auto space-y-3.5 text-xs text-start" aria-busy={isTyping}>
      {messages.length === 0 && (
        <p className="rounded-2xl bg-brand-surface-blue border border-brand-border-soft p-3.5 leading-relaxed text-brand-ink">
          أهلاً فيك 👋 اختار سؤال من الأزرار وبجاوبك، بدون ما تحتاج تكتب. وبتقدر تكتب سؤالك إذا بتحب.
        </p>
      )}
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex gap-2.5 items-start ${
            msg.sender === "user" ? "flex-row-reverse" : ""
          }`}
        >
          {msg.sender === "assistant" && (
            <div className="relative w-7 h-7 rounded-full bg-brand-surface-blue p-0.5 flex items-center justify-center shrink-0 mt-0.5 border border-brand-border-soft">
              <Image
                src="/mascot/head.png"
                alt="UniMeta Avatar"
                fill
                className="object-contain"
              />
            </div>
          )}

          <div
            className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed shadow-2xs ${
              msg.sender === "user"
                ? "bg-brand-primary text-white rounded-tl-xs"
                : "bg-[#F4FAFF] text-brand-ink rounded-tr-xs border border-brand-border-soft"
            }`}
          >
            <p className="whitespace-pre-wrap">{msg.text}</p>
            {!!msg.sources?.length&&<details className="mt-2"><summary className="cursor-pointer font-semibold">المراجع المتاحة للإجابة</summary><ul className="mt-2 space-y-1">{msg.sources.map(source=><li key={source.id}><a href={source.url} className="underline" title={source.content}>[{source.id}] {source.title}</a></li>)}</ul></details>}
            <span
              className={`block text-[9px] mt-1.5 text-end ${
                msg.sender === "user" ? "text-white/70" : "text-brand-muted"
              }`}
            >
              {new Date(msg.timestamp).toLocaleTimeString("ar-PS", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      ))}

      {isTyping && (
        <div className="flex gap-2.5 items-start animate-fade-in">
          <div className="relative w-7 h-7 rounded-full bg-brand-surface-blue p-0.5 flex items-center justify-center shrink-0 mt-0.5 border border-brand-border-soft">
            <Image
              src="/mascot/head.png"
              alt="UniMeta Avatar"
              fill
              className="object-contain"
            />
          </div>
          <div className="bg-[#F4FAFF] rounded-2xl rounded-tr-xs p-3 border border-brand-border-soft flex items-center gap-1.5 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-bounce" style={{ animationDelay: "300ms" }} />
            <span className="text-[10px] text-brand-primary font-medium ms-1.5">جاري التحضير...</span>
          </div>
        </div>
      )}

      <div role="group" aria-label="أسئلة جاهزة">
        <p className="text-brand-muted mb-2">اضغط على سؤال لإرساله مباشرة</p>
        <div className="grid grid-cols-2 gap-2">
          {suggestions.map(({ label, question }) => (
            <button
              key={label}
              type="button"
              disabled={suggestionsDisabled}
              onClick={() => onSuggestion(question)}
              className="min-h-11 rounded-xl border border-brand-border-soft bg-brand-surface-blue px-2.5 py-2 text-start font-semibold leading-relaxed text-brand-primary hover:bg-brand-primary hover:text-white transition-colors focus-ring cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div ref={messagesEndRef} />
    </div>
  );
}

