import React from "react";
import Link from "next/link";
import { studentDestinations } from "@/src/lib/navigation/student";
import { renderSidebarIcon } from "./sidebar-icons";

interface SidebarNavListProps {
  pathname: string;
  onClose?: () => void;
}

export function SidebarNavList({ pathname, onClose }: SidebarNavListProps) {
  return (
    <>
      <div className="px-5 pt-1 pb-1">
        <span className="text-[10px] font-bold text-[#66788A] uppercase tracking-wider block">
          مساحة الطالب
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-1 space-y-1" aria-label="تنقل الطالب">
        {studentDestinations.map((dest) => {
          const hasSubItems = dest.subItems && dest.subItems.length > 0;
          const isParentActive =
            pathname === dest.path ||
            (hasSubItems && dest.subItems?.some((sub) => pathname === sub.path || pathname === `/student${sub.path}`));

          if (hasSubItems) {
            const isDirectParentActive = pathname === dest.path;
            const parentTourKey = dest.id === "student-academic" ? "academic-path" : undefined;
            return (
              <div key={dest.id} className="space-y-1">
                <Link
                  href={dest.path}
                  onClick={onClose}
                  data-tour={parentTourKey}
                  aria-current={isDirectParentActive ? "page" : undefined}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors ${
                    isDirectParentActive
                      ? "bg-[#EAF4FD] text-[#0057C8] border-s-4 border-[#0057C8] shadow-xs"
                      : isParentActive
                      ? "text-[#0057C8] hover:bg-[#F0F7FD]"
                      : "text-[#16324A] hover:bg-[#F0F7FD] hover:text-[#0057C8]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={isDirectParentActive || isParentActive ? "text-[#0057C8]" : "text-[#66788A]"}>
                      {renderSidebarIcon(dest.icon)}
                    </span>
                    <span className="truncate">{dest.title}</span>
                  </div>
                  {isDirectParentActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0057C8] shrink-0" />
                  )}
                </Link>

                <div className="ps-4 pe-1 space-y-1 border-s-2 border-[#D7EAF7] ms-5 my-1">
                  {dest.subItems?.map((sub) => {
                    const isSubActive =
                      (sub.id === "my-hours" && (pathname === "/my-hours" || pathname === "/student/my-hours")) ||
                      (sub.id === "gpa-calculator" && (pathname === "/gpa-calculator" || pathname === "/student/gpa-calculator")) ||
                      (sub.id === "fee-calculator" && (pathname === "/fee-calculator" || pathname === "/student/fee-calculator")) ||
                      pathname === sub.path;

                    const subTourKey =
                      sub.id === "my-hours"
                        ? "hours"
                        : sub.id === "gpa-calculator"
                        ? "gpa"
                        : sub.id === "fee-calculator"
                        ? "fees"
                        : undefined;

                    return (
                      <Link
                        key={sub.id}
                        href={sub.path}
                        onClick={onClose}
                        data-tour={subTourKey}
                        aria-current={isSubActive ? "page" : undefined}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                          isSubActive
                            ? "bg-[#0057C8] text-white font-bold shadow-xs"
                            : "text-[#16324A] hover:bg-[#F0F7FD] hover:text-[#0057C8] font-medium"
                        }`}
                      >
                        <span className="truncate">{sub.title}</span>
                        {isSubActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          }

          const isActive = pathname === dest.path;
          const destTourKey =
            dest.id === "student-productivity"
              ? "study-space"
              : dest.id === "student-exchange-devices"
              ? "exchange-devices"
              : dest.id === "student-exchange-books"
              ? "exchange-books"
              : dest.id === "student-agreements"
              ? "agreements"
              : undefined;

          return (
            <Link
              key={dest.id}
              href={dest.path}
              onClick={onClose}
              data-tour={destTourKey}
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#EAF4FD] text-[#0057C8] font-bold border-s-4 border-[#0057C8] shadow-xs"
                  : "text-[#16324A] hover:bg-[#F0F7FD] hover:text-[#0057C8]"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className={isActive ? "text-[#0057C8]" : "text-[#66788A]"}>
                  {renderSidebarIcon(dest.icon)}
                </span>
                <span className="truncate">{dest.title}</span>
              </div>
              {dest.badge && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0057C8] text-white">
                  {dest.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </>
  );
}

