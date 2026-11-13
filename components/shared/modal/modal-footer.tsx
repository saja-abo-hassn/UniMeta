"use client";

import React from "react";
import { ModalFooterProps } from "./types";

export function ModalFooter({ children, className = "" }: ModalFooterProps) {
  return (
    <div
      className={`shrink-0 px-6 py-4 bg-brand-surface-muted/95 backdrop-blur-md border-t border-brand-border-soft flex items-center justify-end gap-3 ${className}`}
    >
      {children}
    </div>
  );
}
