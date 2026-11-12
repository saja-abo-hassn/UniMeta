"use client";

import React from "react";
import { ModalBodyProps } from "./types";

export function ModalBody({ children, className = "" }: ModalBodyProps) {
  return (
    <div
      className={`flex-1 min-h-0 overflow-y-auto px-6 py-5 text-start overscroll-contain text-[#16324A] ${className}`}
      style={{ scrollbarGutter: "stable" }}
    >
      {children}
    </div>
  );
}
