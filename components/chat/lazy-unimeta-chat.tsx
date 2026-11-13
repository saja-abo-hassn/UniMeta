"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { ChatFloatingButton } from "./components/chat-floating-button";

// Keep the assistant and its mascot/message code out of the initial route bundle.
const UniMetaChat = dynamic(
  () => import("@/components/chat/unimeta-chat").then((module) => module.UniMetaChat),
  { ssr: false },
);

export function LazyUniMetaChat() {
  const [isRequested, setIsRequested] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  if (isRequested) return <UniMetaChat initiallyOpen />;

  return (
    <ChatFloatingButton
      buttonRef={buttonRef}
      isOpen={false}
      onToggle={() => setIsRequested(true)}
    />
  );
}
