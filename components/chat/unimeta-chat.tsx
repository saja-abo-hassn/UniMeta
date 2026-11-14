"use client";

import React from "react";
import { apiClient } from "@/src/services/api-client";
import Image from "next/image";
import { useUniMetaChat } from "./hooks/use-unimeta-chat";
import { ChatFloatingButton } from "./components/chat-floating-button";
import { PeekingMascot } from "./components/peeking-mascot";
import { ChatMessagesList } from "./components/chat-messages-list";

export type { MascotState, MascotAction } from "./types";

export function UniMetaChat({ initiallyOpen = false }: { initiallyOpen?: boolean }) {
  const {
    sessions,sessionId,selectSession,deleteSession,error,historyBusy,
    isOpen,
    setIsOpen,
    isMobile,
    mascotMounted,
    mascotVisible,
    displayedState,
    isTransitioning,
    messages,
    inputVal,
    isTyping,
    windowRef,
    buttonRef,
    messagesEndRef,
    handleInputChange,
    handleSend,
  } = useUniMetaChat(initiallyOpen);

  return (
    <>
      <ChatFloatingButton
        buttonRef={buttonRef}
        isOpen={isOpen}
        onToggle={() => setIsOpen((prev) => !prev)}
      />

      {isOpen && (
        <div className="fixed bottom-24 end-6 z-50 pointer-events-none select-none">
          <section
            ref={windowRef}
            role="dialog"
            aria-modal="false"
            aria-labelledby="unimeta-chat-title"
            className="pointer-events-auto relative z-10 w-[calc(100vw-2rem)] sm:w-[370px] h-[480px] max-h-[calc(100dvh-7.5rem)] bg-white/98 backdrop-blur-xl rounded-3xl shadow-2xl border border-brand-border-soft flex flex-col overflow-visible animate-fade-in-scale focus-ring"
            dir="rtl"
          >
            <PeekingMascot
              mascotMounted={mascotMounted}
              mascotVisible={mascotVisible}
              isMobile={isMobile}
              displayedState={displayedState}
              isTransitioning={isTransitioning}
            />

            <header className="p-4 bg-gradient-to-r from-brand-primary to-brand-hover-medium text-white flex items-center justify-between shrink-0 shadow-xs cursor-default rounded-t-3xl">
              <div className="flex items-center gap-3">
                <div className="relative w-8 h-8 rounded-full bg-white/15 p-1 flex items-center justify-center shrink-0 border border-white/20">
                  <Image
                    src="/mascot/head.png"
                    alt="UniMeta AI"
                    fill
                    className="object-contain p-0.5"
                  />
                </div>
                <div className="flex flex-col text-start">
                  <h2
                    id="unimeta-chat-title"
                    className="font-extrabold text-base tracking-tight leading-none text-white flex items-center gap-1.5"
                  >
                    <span>UniMeta AI</span>
                    <span className="w-2 h-2 rounded-full bg-[#10B981] inline-block" />
                  </h2>
                  <span className="text-[11px] font-medium text-[#BFE8FF] mt-1 leading-none">
                    مساعدك الجامعي الذكي
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="إغلاق المحادثة"
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/15 transition-colors focus-ring cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </header>

            {!apiClient.isUsingMock()&&<div className="p-2 flex gap-2"><select aria-label="المحادثة" disabled={isTyping||historyBusy} value={sessionId??""} onChange={e=>void selectSession(e.target.value?Number(e.target.value):null)} className="border rounded-lg p-1 text-xs flex-1"><option value="">محادثة جديدة</option>{sessions.map(s=><option key={s.id} value={s.id}>{s.title??`محادثة ${s.id}`}</option>)}</select>{sessionId!==null&&<button disabled={isTyping||historyBusy} onClick={()=>void deleteSession()} className="text-xs text-red-700">حذف المحادثة</button>}</div>}
            {error&&<p role="alert" className="p-2 text-xs text-red-700">{error}</p>}
            <ChatMessagesList
              messages={messages}
              isTyping={isTyping}
              messagesEndRef={messagesEndRef}
            />

            <footer className="p-3.5 border-t border-brand-border-soft bg-[#F8FAFC] rounded-b-3xl">
              <form onSubmit={handleSend} className="flex items-center gap-2">
                <input
                  type="text"
                  maxLength={4000}
                  value={inputVal}
                  onChange={handleInputChange}
                  placeholder="اسأل UniMeta عن خطتك، المعدل، المواد..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-brand-border-soft bg-white text-xs text-slate-800 placeholder-slate-400 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all"
                />
                <button
                  type="submit"
                  disabled={!inputVal.trim() || isTyping || historyBusy}
                  aria-label="إرسال"
                  className="w-9 h-9 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white flex items-center justify-center shrink-0 shadow-xs transition-colors focus-ring cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                >
                  <svg className="w-4 h-4 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </form>
<<<<<<< HEAD
              <p className="text-[10px] text-slate-400 text-center mt-2">
                المساعد للدعم الدراسي؛ قد يخطئ. توفر الردود يعتمد على تفعيل الخدمة.
=======
              <p className="text-[10px] text-brand-subtle text-center mt-2">
                UniMeta AI مساعد رقمي ذكي متصل بخدمات جامعة الأزهر ومنظومة UniMeta.
>>>>>>> b079de5bb3c77012965f2ad45ddce455d601b6a9
              </p>
            </footer>
          </section>
        </div>
      )}
    </>
  );
}
