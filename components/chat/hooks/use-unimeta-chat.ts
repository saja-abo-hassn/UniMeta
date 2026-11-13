"use client";

import { useState, useEffect, useRef, useReducer, useCallback } from "react";
import { aiChatService, ChatMessage } from "@/src/services/ai-chat-service";
import {
  MascotState,
  mascotReducer,
  MASCOT_PRELOAD_IMAGES,
} from "../types";

export function useUniMetaChat(initiallyOpen = false) {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const [mascotState, dispatchMascot] = useReducer(mascotReducer, "idle");
  const [displayedState, setDisplayedState] = useState<MascotState>("greeting");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [mascotMounted, setMascotMounted] = useState(false);
  const [mascotVisible, setMascotVisible] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    aiChatService.getInitialWelcome(),
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const windowRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const greetingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const answeredTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      MASCOT_PRELOAD_IMAGES.forEach((src) => {
        const img = new window.Image();
        img.src = src;
      });
    }
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        window.innerWidth < 768 || window.matchMedia("(pointer: coarse)").matches
      );
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const clearAllTimers = useCallback(() => {
    if (greetingTimerRef.current) clearTimeout(greetingTimerRef.current);
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    if (answeredTimerRef.current) clearTimeout(answeredTimerRef.current);
  }, []);

  useEffect(() => {
    let unmountTimer: NodeJS.Timeout;
    if (isOpen) {
      clearAllTimers();
      dispatchMascot({ type: "OPEN_CHAT" });
      setDisplayedState("greeting");
      setMascotMounted(true);

      const raf = requestAnimationFrame(() => {
        setMascotVisible(true);
      });

      greetingTimerRef.current = setTimeout(() => {
        dispatchMascot({ type: "GREETING_TIMEOUT" });
      }, 2500);

      return () => {
        cancelAnimationFrame(raf);
      };
    } else {
      clearAllTimers();
      dispatchMascot({ type: "CLOSE_CHAT" });
      setMascotVisible(false);
      unmountTimer = setTimeout(() => {
        setMascotMounted(false);
      }, 250);
    }

    return () => {
      clearTimeout(unmountTimer);
      clearAllTimers();
    };
  }, [isOpen, clearAllTimers]);

  useEffect(() => {
    if (mascotState === displayedState) return;

    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setDisplayedState(mascotState);
      setIsTransitioning(false);
    }, 110);

    return () => clearTimeout(timer);
  }, [mascotState, displayedState]);

  useEffect(() => {
    if (mascotState === "answered") {
      if (answeredTimerRef.current) clearTimeout(answeredTimerRef.current);
      answeredTimerRef.current = setTimeout(() => {
        dispatchMascot({ type: "ANSWER_TIMEOUT" });
      }, 3000);
    }
  }, [mascotState]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputVal(e.target.value);
    if (!isTyping) {
      dispatchMascot({ type: "USER_START_TYPING" });
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => {
        dispatchMascot({ type: "USER_STOP_TYPING" });
      }, 2000);
    }
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = inputVal.trim();
    if (!query || isTyping) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");

    clearAllTimers();
    dispatchMascot({ type: "SEND_MESSAGE" });
    setIsTyping(true);

    setTimeout(() => {
      let replyText =
        "أهلاً بك! مساعد UniMeta AI الذكي مخصص لخدمتك في استعراض خطتك الدراسية، وحساب الساعات والمعدل، والبحث في المكتبة ومشاريع التخرج.";

      const lower = query.toLowerCase();
      if (lower.includes("خطة") || lower.includes("تخصص") || lower.includes("مسار")) {
        replyText =
          "يمكنك إدارة ومراجعة خطتك الدراسية كاملة عبر صفحة «مساري الأكاديمي» للوصول لجميع المقررات وساعات الإنجاز المعتمدة.";
      } else if (lower.includes("معدل") || lower.includes("حاسبة") || lower.includes("علامات")) {
        replyText =
          "حاسبة المعدل التراكمي مرتبطة مباشرة بمواد خطتك الدراسية لحساب المعدل الفصلي والتراكمي بدقة وفق مقياس 100%.";
      } else if (lower.includes("رسوم") || lower.includes("ساعة") || lower.includes("دفع")) {
        replyText =
          "حاسبة الرسوم تحتسب التكلفة تلقائياً بناءً على سعر الساعة المعتمد لتخصصك وعدد الساعات المسجلة لهذا الفصل.";
      } else if (lower.includes("كتب") || lower.includes("جهاز") || lower.includes("تبادل")) {
        replyText =
          "منصة التبادل الأكاديمي تتيح لك استعارة وشراء الكتب المنهجية والأدوات الهندسية من زملائك في الكلية بسهولة.";
      }

      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "assistant",
        text: replyText,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);

      dispatchMascot({ type: "RECEIVE_ANSWER" });
    }, 1300);
  };

  return {
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
  };
}

