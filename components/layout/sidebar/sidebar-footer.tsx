"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/contexts/auth-context";
import { Modal } from "@/components/shared/modal";

interface SidebarFooterProps {
  onLogout?: () => void;
  onClose?: () => void;
}

export function SidebarFooter({ onLogout }: SidebarFooterProps) {
  const router = useRouter();
  const { logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = async () => {
    setShowLogoutConfirm(false);
    if (onLogout) {
      onLogout();
      return;
    }
    await logout();
    router.replace("/login");
  };

  return (
    <>
      <div className="p-4 border-t border-[#D7EAF7] shrink-0 space-y-2">
        <button
          type="button"
          onClick={() => setShowLogoutConfirm(true)}
          className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-[#D7EAF7] hover:border-red-300 bg-white text-xs font-semibold text-[#66788A] hover:text-red-600 hover:bg-red-50/60 transition-colors w-full cursor-pointer"
        >
          <svg className="w-3.5 h-3.5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>تسجيل الخروج</span>
        </button>
        <div className="text-[10px] text-[#66788A] text-center">
          منصة يوني ميتا &copy; 2026
        </div>
      </div>

      <Modal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        size="sm"
      >
        <Modal.Header
          title="تسجيل الخروج"
          onClose={() => setShowLogoutConfirm(false)}
        />
        <Modal.Body className="text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-100">
            <svg className="w-6 h-6 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
          <p className="text-xs text-[#66788A] leading-relaxed">
            هل تريد تسجيل الخروج؟ سيتعين عليك إدخال بياناتك مجدداً لتسجيل الدخول.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            onClick={() => setShowLogoutConfirm(false)}
            className="flex-1 py-2 rounded-xl border border-[#D7EAF7] text-xs font-semibold text-[#16324A] hover:bg-[#F8FBFE] transition-colors cursor-pointer"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            تأكيد الخروج
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
