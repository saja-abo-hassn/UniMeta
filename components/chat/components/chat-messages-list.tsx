import React from "react";
import Image from "next/image";
import { ChatMessage } from "@/src/services/ai-chat-service";

interface ChatMessagesListProps {
  messages: ChatMessage[];
  isTyping: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export function ChatMessagesList({
  messages,
  isTyping,
  messagesEndRef,
}: ChatMessagesListProps) {
  return (
    <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs text-start">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex gap-2.5 items-start ${
            msg.sender === "user" ? "flex-row-reverse" : ""
          }`}
        >
          {msg.sender === "assistant" && (
            <div className="relative w-7 h-7 rounded-full bg-[#EAF4FD] p-0.5 flex items-center justify-center shrink-0 mt-0.5 border border-[#D7EAF7]">
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
                ? "bg-[#0057C8] text-white rounded-tl-xs"
                : "bg-[#F4FAFF] text-[#16324A] rounded-tr-xs border border-[#D7EAF7]"
            }`}
          >
            <p className="whitespace-pre-wrap">{msg.text}</p>
            <span
              className={`block text-[9px] mt-1.5 text-end ${
                msg.sender === "user" ? "text-white/70" : "text-[#66788A]"
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
          <div className="relative w-7 h-7 rounded-full bg-[#EAF4FD] p-0.5 flex items-center justify-center shrink-0 mt-0.5 border border-[#D7EAF7]">
            <Image
              src="/mascot/head.png"
              alt="UniMeta Avatar"
              fill
              className="object-contain"
            />
          </div>
          <div className="bg-[#F4FAFF] rounded-2xl rounded-tr-xs p-3 border border-[#D7EAF7] flex items-center gap-1.5 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0057C8] animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-[#0057C8] animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-[#0057C8] animate-bounce" style={{ animationDelay: "300ms" }} />
            <span className="text-[10px] text-[#0057C8] font-medium ms-1.5">جاري التحضير...</span>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}

