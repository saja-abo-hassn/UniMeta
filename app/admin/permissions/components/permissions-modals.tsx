"use client";

import React from "react";
import { ModeratorUser, AdminPermission, AdminRole } from "@/src/types/admin";
import { PERMISSION_COLUMNS } from "../types";
import { Modal } from "@/components/shared/modal";

export interface PermissionsFormData {
  name: string;
  email: string;
  title: string;
  role: AdminRole;
  assignedDepartment: string;
  permissions: Record<AdminPermission, boolean>;
}

interface PermissionsModalsProps {
  isAddModalOpen: boolean;
  onCloseAddModal: () => void;
  onSubmitAdd: (e: React.FormEvent) => void;
  formData: PermissionsFormData;
  onFormDataChange: (data: PermissionsFormData) => void;
  formError: string;
  isSubmitting?: boolean;
  deleteCandidate: ModeratorUser | null;
  onCloseDelete: () => void;
  onConfirmDelete: (id: string) => void;
}

export function PermissionsModals({
  isAddModalOpen,
  onCloseAddModal,
  onSubmitAdd,
  formData,
  onFormDataChange,
  formError,
  isSubmitting = false,
  deleteCandidate,
  onCloseDelete,
  onConfirmDelete,
}: PermissionsModalsProps) {
  return (
    <>
      <Modal isOpen={isAddModalOpen} onClose={onCloseAddModal} size="lg">
        <form onSubmit={onSubmitAdd} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          <Modal.Header
            title="دعوة مشرف جديد للنظام"
            description="حدد بيانات المشرف والمسمى الوظيفي والصلاحيات لإنشاء رابط دعوة صالح لمدة 48 ساعة"
            onClose={onCloseAddModal}
          />

          <Modal.Body className="p-5 sm:p-6 space-y-4 text-xs">
            {formError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 font-bold">
                {formError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#16324A] block">
                  الاسم الكامل <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => onFormDataChange({ ...formData, name: e.target.value })}
                  placeholder="مثال: د. يوسف النجار"
                  className="w-full px-3 py-2 rounded-xl border border-[#D7EAF7] bg-white text-xs font-bold text-[#16324A] focus:outline-none focus:border-[#0057C8]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#16324A] block">
                  البريد الإلكتروني <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  dir="ltr"
                  value={formData.email}
                  onChange={(e) => onFormDataChange({ ...formData, email: e.target.value })}
                  placeholder="yousef@unimeta.edu.ps"
                  className="w-full px-3 py-2 rounded-xl border border-[#D7EAF7] bg-white text-xs font-bold text-[#16324A] focus:outline-none focus:border-[#0057C8]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#16324A] block">
                  المسمى الوظيفي <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => onFormDataChange({ ...formData, title: e.target.value })}
                  placeholder="مثال: مشرف أكاديمي أو منسق المحتوى"
                  className="w-full px-3 py-2 rounded-xl border border-[#D7EAF7] bg-white text-xs font-bold text-[#16324A] focus:outline-none focus:border-[#0057C8]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#16324A] block">القسم الأكاديمي المخصص</label>
                <input
                  type="text"
                  value={formData.assignedDepartment}
                  onChange={(e) => onFormDataChange({ ...formData, assignedDepartment: e.target.value })}
                  placeholder="مثال: كلية الهندسة وتكنولوجيا المعلومات"
                  className="w-full px-3 py-2 rounded-xl border border-[#D7EAF7] bg-white text-xs font-bold text-[#16324A] focus:outline-none focus:border-[#0057C8]"
                />
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#D7EAF7]">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#16324A] block">
                  مصفوفة الصلاحيات الممنوحة:
                </label>
                <span className="text-[11px] text-[#66788A]">
                  حدد الأقسام التي يسمح للمشرف بالوصول إليها
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
                {PERMISSION_COLUMNS.map((p) => (
                  <label
                    key={p.key}
                    className="p-2.5 rounded-xl border border-[#D7EAF7] bg-[#F8FBFE] flex items-center justify-between cursor-pointer hover:bg-white transition-colors"
                  >
                    <div>
                      <span className="text-xs font-bold text-[#16324A] block">{p.label}</span>
                      <span className="text-[10px] text-[#66788A]">{p.description}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={!!formData.permissions[p.key]}
                      onChange={(e) =>
                        onFormDataChange({
                          ...formData,
                          permissions: { ...formData.permissions, [p.key]: e.target.checked },
                        })
                      }
                      className="w-4 h-4 rounded text-[#0057C8] border-[#D7EAF7] cursor-pointer"
                    />
                  </label>
                ))}
              </div>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <button
              type="button"
              onClick={onCloseAddModal}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl border border-[#D7EAF7] text-xs font-bold text-[#66788A] hover:bg-[#F8FBFE] cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-[#0057C8] hover:bg-[#2D78B7] disabled:opacity-50 text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-2"
            >
              {isSubmitting ? "جاري إنشاء الدعوة..." : "إرسال الدعوة ✉️"}
            </button>
          </Modal.Footer>
        </form>
      </Modal>

      <Modal isOpen={!!deleteCandidate} onClose={onCloseDelete} size="sm">
        {deleteCandidate && (
          <>
            <Modal.Header title="تأكيد إزالة المشرف" onClose={onCloseDelete} />
            <Modal.Body className="text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center text-2xl font-bold">
                ⚠️
              </div>
              <p className="text-xs text-[#66788A] leading-relaxed">
                هل أنت متأكد من سحب الصلاحيات وإزالة حساب <strong className="text-[#16324A]">{deleteCandidate.name}</strong> ({deleteCandidate.email})؟
              </p>
            </Modal.Body>
            <Modal.Footer>
              <button
                type="button"
                onClick={onCloseDelete}
                className="px-4 py-2 rounded-xl border border-[#D7EAF7] text-xs font-bold text-[#66788A] hover:bg-[#F8FBFE] cursor-pointer"
              >
                تراجع
              </button>
              <button
                type="button"
                onClick={() => onConfirmDelete(deleteCandidate.id)}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                نعم، احذف المشرف
              </button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </>
  );
}
