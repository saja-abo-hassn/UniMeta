"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { Button } from "./button";

type ModalProps = {
  open: boolean;
  title: string;
  description?: string;
  children: ReactNode;
  onClose: () => void;
  closeLabel?: string;
};

export function Modal({ open, title, description, children, onClose, closeLabel = "إغلاق" }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const id = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog ref={dialogRef} className="modal-dialog" aria-labelledby={`${id}-title`} aria-describedby={description ? `${id}-description` : undefined} onClose={() => { if (open) onClose(); }}>
      <div className="modal-heading">
        <h2 id={`${id}-title`}>{title}</h2>
        <Button type="button" variant="ghost" aria-label={closeLabel} onClick={() => dialogRef.current?.close()}>×</Button>
      </div>
      {description && <p id={`${id}-description`} className="page-lede">{description}</p>}
      <div className="modal-content">{children}</div>
    </dialog>
  );
}
