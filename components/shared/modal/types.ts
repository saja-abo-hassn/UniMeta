import React from "react";

export type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: ModalSize;
  className?: string;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  dir?: "rtl" | "ltr";
}

export interface ModalHeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  onClose?: () => void;
  className?: string;
  badge?: React.ReactNode;
}

export interface ModalBodyProps {
  children: React.ReactNode;
  className?: string;
}

export interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

