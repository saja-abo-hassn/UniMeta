"use client";

import React from "react";
import { ModalFooterProps } from "./types";

export function ModalFooter({ children, className = "" }: ModalFooterProps) {
  return (
    <div
      className={`shrink-0 px-6 py-4 bg-[#F8FBFE]/95 backdrop-blur-md border-t border-[#D7EAF7] flex items-center justify-end gap-3 ${className}`}
    >
      {children}
    </div>
  );
}
