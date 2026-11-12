"use client";

import React, { useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { ModalProps, ModalSize } from "./types";
import { useScrollLock } from "./use-scroll-lock";
import { useFocusTrap } from "./use-focus-trap";
import { ModalHeader } from "./modal-header";
import { ModalBody } from "./modal-body";
import { ModalFooter } from "./modal-footer";

const SIZE_CLASSES: Record<ModalSize, string> = {
  sm: "max-w-[440px]",
  md: "max-w-[600px]",
  lg: "max-w-[760px]",
  xl: "max-w-[920px]",
  full: "max-w-[95vw]",
};

const emptySubscribe = () => () => {};

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  className = "",
  closeOnBackdrop = true,
  closeOnEscape = true,
  dir = "rtl",
}: ModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  useScrollLock(isOpen);
  useFocusTrap({
    enabled: isOpen && closeOnEscape,
    onEscape: onClose,
    containerRef,
  });

  if (!isOpen || !mounted) return null;

  const isCompoundElement = (el: React.ReactNode): boolean => {
    if (!React.isValidElement(el)) return false;
    if (
      el.type === ModalHeader ||
      el.type === ModalBody ||
      el.type === ModalFooter
    ) {
      return true;
    }
    const props = el.props as { children?: React.ReactNode } | undefined;
    if (props && props.children) {
      return React.Children.toArray(props.children).some(isCompoundElement);
    }
    return false;
  };

  const hasCompoundChildren = React.Children.toArray(children).some(isCompoundElement);

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "rgba(11, 25, 44, 0.62)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        overflow: "hidden",
      }}
      dir={dir}
      onClick={(e) => {
        if (closeOnBackdrop && e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={containerRef}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxHeight: "min(92vh, 92dvh, calc(100dvh - 32px))",
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
        }}
        className={`${SIZE_CLASSES[size]} bg-white rounded-3xl border border-[#D7EAF7] shadow-2xl overflow-hidden focus:outline-none motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 motion-safe:duration-200 ${className}`}
      >
        {hasCompoundChildren ? (
          children
        ) : (
          <>
            {title && (
              <ModalHeader
                title={title}
                description={description}
                onClose={onClose}
              />
            )}
            <ModalBody>{children}</ModalBody>
            {footer && <ModalFooter>{footer}</ModalFooter>}
          </>
        )}
      </div>
    </div>,
    document.body
  );
}

Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
