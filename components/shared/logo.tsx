import React from "react";
import Image from "next/image";
import Link from "next/link";

export interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  href?: string;
  variant?: "light" | "dark";
  className?: string;
  subtitle?: string;
}

export function Logo({
  size = "md",
  showText = true,
  href = "/",
  variant = "light",
  className = "",
  subtitle = "University Meta",
}: LogoProps) {
  const dimensions = {
    sm: { width: 30, height: 38 },
    md: { width: 38, height: 48 },
    lg: { width: 50, height: 63 },
  }[size];

  const content = (
    <div className={`flex items-center gap-2.5 select-none ${className}`.trim()}>
      <div className="relative shrink-0 flex items-center justify-center">
        <Image
          src="/images/unimeta-logo.png"
          alt="UniMeta Logo"
          width={dimensions.width}
          height={dimensions.height}
          priority
          className="object-contain"
        />
      </div>
      {showText && (
        <div className="flex flex-col text-start">
          <span
            className={`font-extrabold text-base sm:text-lg tracking-tight leading-none ${
              variant === "dark" ? "text-white" : "text-[#0B192C]"
            }`}
          >
            UniMeta
          </span>
          <span
            className={`text-[10px] font-medium tracking-wide mt-1 ${
              variant === "dark" ? "text-brand-light/90" : "text-brand-muted"
            }`}
          >
            {subtitle}
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="focus-ring rounded-xl inline-block" aria-label="UniMeta">
        {content}
      </Link>
    );
  }

  return content;
}
