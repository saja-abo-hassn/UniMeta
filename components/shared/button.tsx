import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      fullWidth = false,
      isLoading = false,
      disabled,
      className = "",
      type = "button",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus-ring cursor-pointer select-none active:scale-[0.98]";

    const variantStyles = {
      primary:
        "bg-brand-primary text-white hover:bg-brand-primary-hover shadow-sm hover:shadow active:bg-brand-dark disabled:bg-brand-primary/50",
      secondary:
        "bg-brand-secondary text-white hover:bg-brand-secondary-hover shadow-sm disabled:bg-brand-secondary/50",
      outline:
        "border border-brand-primary/30 text-brand-primary hover:bg-brand-primary/10 hover:border-brand-primary active:bg-brand-primary/20 disabled:border-brand-primary/20 disabled:text-brand-primary/40",
      ghost:
        "text-brand-primary hover:bg-brand-secondary/15 active:bg-brand-secondary/25 disabled:text-brand-secondary/40",
      danger:
        "bg-rose-700 text-white hover:bg-rose-800 shadow-sm disabled:bg-rose-700/50",
    };

    const sizeStyles = {
      sm: "px-3 py-1.5 text-xs gap-1.5",
      md: "px-4 py-2 text-sm gap-2",
      lg: "px-6 py-3 text-base gap-2.5",
    };

    const widthStyles = fullWidth ? "w-full" : "";
    const disabledStyles = disabled || isLoading ? "opacity-60 cursor-not-allowed pointer-events-none" : "";

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${disabledStyles} ${className}`.trim()}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin h-4 w-4 me-2 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

