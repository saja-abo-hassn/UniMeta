import React, { useId } from "react";

export interface FormFieldProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function FormField({
  label,
  error,
  helperText,
  required = false,
  children,
  className = "",
  id,
}: FormFieldProps) {
  const generatedId = useId();
  const fieldId = id || generatedId;

  return (
    <div className={`flex flex-col gap-1.5 w-full text-start ${className}`.trim()}>
      {label && (
        <label
          htmlFor={fieldId}
          className="text-xs font-semibold text-brand-dark flex items-center gap-1 select-none"
        >
          {label}
          {required && <span className="text-rose-600" aria-hidden="true">*</span>}
        </label>
      )}

      {/* Clone or wrap children to associate id and aria attributes */}
      <div className="relative">
        {React.isValidElement(children)
          ? React.cloneElement(children as React.ReactElement<{ id?: string; "aria-invalid"?: boolean }>, {
              id: fieldId,
              "aria-invalid": Boolean(error),
            })
          : children}
      </div>

      {error ? (
        <p className="text-xs text-rose-600 flex items-center gap-1 mt-0.5" role="alert">
          <svg
            className="w-3.5 h-3.5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          {error}
        </p>
      ) : helperText ? (
        <p className="text-xs text-brand-secondary mt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ hasError = false, className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full px-3.5 py-2 text-sm text-brand-dark bg-white/80 border rounded-xl transition-colors focus-ring placeholder:text-brand-secondary/60 disabled:bg-brand-light disabled:cursor-not-allowed ${
          hasError
            ? "border-rose-400 focus-visible:ring-rose-500"
            : "border-brand-secondary/30 hover:border-brand-secondary/60 focus-visible:ring-brand-primary"
        } ${className}`.trim()}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ hasError = false, className = "", rows = 3, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        rows={rows}
        className={`w-full px-3.5 py-2 text-sm text-brand-dark bg-white/80 border rounded-xl transition-colors focus-ring placeholder:text-brand-secondary/60 disabled:bg-brand-light disabled:cursor-not-allowed resize-y ${
          hasError
            ? "border-rose-400 focus-visible:ring-rose-500"
            : "border-brand-secondary/30 hover:border-brand-secondary/60 focus-visible:ring-brand-primary"
        } ${className}`.trim()}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ hasError = false, children, className = "", ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={`w-full px-3.5 py-2 text-sm text-brand-dark bg-white/80 border rounded-xl transition-colors focus-ring disabled:bg-brand-light disabled:cursor-not-allowed ${
          hasError
            ? "border-rose-400 focus-visible:ring-rose-500"
            : "border-brand-secondary/30 hover:border-brand-secondary/60 focus-visible:ring-brand-primary"
        } ${className}`.trim()}
        {...props}
      >
        {children}
      </select>
    );
  }
);
Select.displayName = "Select";

