import React from "react";

export interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`skeleton-shimmer rounded-xl ${className}`.trim()}
    />
  );
}

export function NavbarSkeleton() {
  return (
    <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-md border-b border-brand-border-soft h-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Logo Placeholder */}
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <div className="space-y-1.5 hidden sm:block">
            <Skeleton className="w-24 h-4 rounded-md" />
            <Skeleton className="w-14 h-3 rounded-md" />
          </div>
        </div>

        {/* Links Placeholder */}
        <div className="hidden md:flex items-center gap-6">
          <Skeleton className="w-16 h-4 rounded-md" />
          <Skeleton className="w-20 h-4 rounded-md" />
          <Skeleton className="w-16 h-4 rounded-md" />
          <Skeleton className="w-16 h-4 rounded-md" />
          <Skeleton className="w-20 h-4 rounded-md" />
        </div>

        {/* Action Button Placeholder */}
        <div className="flex items-center gap-3">
          <Skeleton className="w-20 h-9 rounded-xl hidden sm:block" />
          <Skeleton className="w-24 h-9 rounded-xl" />
        </div>
      </div>
    </header>
  );
}

export function HeroSkeleton() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="max-w-3xl space-y-4">
        {/* Badge */}
        <Skeleton className="w-36 h-6 rounded-full" />
        {/* Title */}
        <Skeleton className="w-full sm:w-4/5 h-12 rounded-2xl" />
        <Skeleton className="w-3/4 sm:w-3/5 h-10 rounded-2xl" />
        {/* Paragraph */}
        <div className="space-y-2 pt-2">
          <Skeleton className="w-full h-4 rounded-md" />
          <Skeleton className="w-5/6 h-4 rounded-md" />
          <Skeleton className="w-2/3 h-4 rounded-md" />
        </div>
        {/* Action Buttons */}
        <div className="flex items-center gap-4 pt-4">
          <Skeleton className="w-36 h-12 rounded-xl" />
          <Skeleton className="w-32 h-12 rounded-xl" />
        </div>
      </div>
    </section>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white/95 rounded-2xl p-6 border border-brand-border-soft space-y-4 shadow-xs">
      <div className="flex items-center gap-3">
        <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
        <div className="space-y-2 flex-1">
          <Skeleton className="w-3/4 h-4 rounded-md" />
          <Skeleton className="w-1/2 h-3 rounded-md" />
        </div>
      </div>
      <div className="space-y-2 pt-1">
        <Skeleton className="w-full h-3 rounded-md" />
        <Skeleton className="w-4/5 h-3 rounded-md" />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in" dir="rtl">
      {/* Welcome Card Skeleton */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-brand-border-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2.5 max-w-xl flex-1">
          <Skeleton className="w-36 h-5 rounded-full" />
          <Skeleton className="w-56 h-8 rounded-xl" />
          <Skeleton className="w-full sm:w-3/4 h-4 rounded-md" />
        </div>
        <Skeleton className="w-36 h-10 rounded-xl shrink-0" />
      </div>

      {/* 4 Metric Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-brand-border-soft space-y-3">
          <Skeleton className="w-24 h-4 rounded-md" />
          <Skeleton className="w-28 h-8 rounded-xl" />
          <Skeleton className="w-36 h-3 rounded-md" />
        </div>
        <div className="p-5 rounded-2xl bg-white border border-brand-border-soft space-y-3">
          <Skeleton className="w-24 h-4 rounded-md" />
          <Skeleton className="w-28 h-8 rounded-xl" />
          <Skeleton className="w-36 h-3 rounded-md" />
        </div>
        <div className="p-5 rounded-2xl bg-white border border-brand-border-soft space-y-3">
          <Skeleton className="w-24 h-4 rounded-md" />
          <Skeleton className="w-28 h-8 rounded-xl" />
          <Skeleton className="w-36 h-3 rounded-md" />
        </div>
        <div className="p-5 rounded-2xl bg-white border border-brand-border-soft space-y-3">
          <Skeleton className="w-24 h-4 rounded-md" />
          <Skeleton className="w-28 h-8 rounded-xl" />
          <Skeleton className="w-36 h-3 rounded-md" />
        </div>
      </div>

      {/* Middle Row Skeletons */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-brand-border-soft space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="w-36 h-6 rounded-md" />
            <Skeleton className="w-24 h-7 rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center py-4">
            <div className="sm:col-span-4 flex justify-center">
              <Skeleton className="w-24 h-24 rounded-full" />
            </div>
            <div className="sm:col-span-8 space-y-3">
              <Skeleton className="w-full h-4 rounded-md" />
              <Skeleton className="w-full h-4 rounded-md" />
              <Skeleton className="w-full h-4 rounded-md" />
            </div>
          </div>
          <Skeleton className="w-full h-10 rounded-2xl" />
        </div>

        <div className="lg:col-span-5 p-6 rounded-3xl bg-white border border-brand-border-soft space-y-3">
          <Skeleton className="w-32 h-6 rounded-md" />
          <Skeleton className="w-full h-16 rounded-2xl" />
          <Skeleton className="w-full h-16 rounded-2xl" />
          <Skeleton className="w-full h-16 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

