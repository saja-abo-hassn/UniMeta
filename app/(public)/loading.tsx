import React from "react";
import { NavbarSkeleton, HeroSkeleton, CardSkeleton } from "@/components/shared/skeleton";

export default function PublicLoading() {
  return (
    <div className="min-h-screen bg-[#F0F6FA]">
      <NavbarSkeleton />
      <HeroSkeleton />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    </div>
  );
}

