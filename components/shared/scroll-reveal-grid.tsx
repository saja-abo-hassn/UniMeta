"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Keeps card content visible in server-rendered HTML, then plays a short,
 * one-time entrance when the grid approaches the viewport.
 */
export function ScrollRevealGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          grid.classList.add("card-reveal-visible");
          observer.disconnect();
        }
      },
      { rootMargin: "80px 0px", threshold: 0.01 },
    );

    observer.observe(grid);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={gridRef} className={`card-reveal-grid ${className ?? ""}`}>
      {children}
    </div>
  );
}
