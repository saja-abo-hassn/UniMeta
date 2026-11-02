import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

type FieldBase = { label: string; hint?: string; error?: string; id: string };
type InputProps = FieldBase & InputHTMLAttributes<HTMLInputElement>;
type TextareaProps = FieldBase & TextareaHTMLAttributes<HTMLTextAreaElement>;
type SelectProps = FieldBase & SelectHTMLAttributes<HTMLSelectElement> & { options: Array<{ label: string; value: string }> };

function FieldHint({ id, hint, error }: { id: string; hint?: string; error?: string }) {
  return <p className="field-hint" id={`${id}-hint`} aria-live="polite">{error || hint || " "}</p>;
}

export function Input({ label, hint, error, id, className = "", ...props }: InputProps) {
  return <label className="field-label" htmlFor={id}>{label}<input id={id} className={`field-control ${className}`.trim()} aria-invalid={Boolean(error)} aria-describedby={`${id}-hint`} {...props} /><FieldHint id={id} hint={hint} error={error} /></label>;
}

export function Textarea({ label, hint, error, id, className = "", ...props }: TextareaProps) {
  return <label className="field-label" htmlFor={id}>{label}<textarea id={id} className={`field-control field-textarea ${className}`.trim()} aria-invalid={Boolean(error)} aria-describedby={`${id}-hint`} {...props} /><FieldHint id={id} hint={hint} error={error} /></label>;
}

export function Select({ label, hint, error, id, options, className = "", ...props }: SelectProps) {
  return <label className="field-label" htmlFor={id}>{label}<select id={id} className={`field-control ${className}`.trim()} aria-invalid={Boolean(error)} aria-describedby={`${id}-hint`} {...props}>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select><FieldHint id={id} hint={hint} error={error} /></label>;
}
