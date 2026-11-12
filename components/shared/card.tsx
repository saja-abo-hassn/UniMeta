import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

export function Card({
  children,
  hoverable = false,
  padding = "md",
  className = "",
  ...props
}: CardProps) {
  const paddingStyles = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={`glass-card ${hoverable ? "glass-card-hover" : ""} ${paddingStyles[padding]} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`mb-4 flex flex-col gap-1 ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className = "",
  as: Component = "h3",
  ...props
}: React.HTMLAttributes<HTMLHeadingElement> & { as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" }) {
  return (
    <Component
      className={`text-lg font-bold text-brand-dark tracking-tight ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
}

export function CardDescription({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`text-sm text-brand-secondary ${className}`.trim()} {...props}>
      {children}
    </p>
  );
}

export function CardContent({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`text-sm text-brand-dark/90 ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`mt-6 pt-4 border-t border-brand-secondary/15 flex items-center justify-between gap-4 ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}

