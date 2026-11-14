"use client";

import React from "react";
import { ModeratorUser, AdminPermission } from "@/src/types/admin";
import { PERMISSION_COLUMNS } from "../types";

interface PermissionsMatrixTableProps {
  filteredModerators: ModeratorUser[];
  currentUser: ModeratorUser;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  superAdminsCount: number;
  onTogglePermission: (mod: ModeratorUser, permKey: AdminPermission) => void;
  onToggleStatus: (id: string) => void;
  onDeletePrompt: (mod: ModeratorUser) => void;
  onCopyInvite?: (url: string, key: string) => void;
  copiedToken?: string | null;
}

export function PermissionsMatrixTable({
  filteredModerators,
  currentUser,
  searchQuery,
  onSearchChange,
  superAdminsCount,
  onTogglePermission,
  onToggleStatus,
  onDeletePrompt,
  onCopyInvite,
  copiedToken,
}: PermissionsMatrixTableProps) {
  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <span className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-brand-muted">
            🔍
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ابحث بالاسم، البريد أو القسم..."
            className="w-full ps-9 pe-3 py-2 rounded-xl border border-brand-border-soft bg-white text-xs font-medium text-brand-ink focus:outline-none focus:border-brand-primary"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-brand-border-soft overflow-hidden shadow-xs space-y-2">
        <div className="p-4 bg-brand-surface-muted border-b border-brand-border-soft flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-black text-brand-ink">
              مصفوفة الصلاحيات التفاعلية (Interactive Permissions Matrix)
            </h3>
            <p className="text-xs text-brand-muted">
              اضغط على مفتاح التبديل (ON/OFF) أمام أي مشرف لتحديث صلاحياته فورياً بدون إعادة تحميل الصفحة.
            </p>
          </div>
          <span className="text-xs font-bold text-brand-primary bg-white px-3 py-1 rounded-xl border border-brand-border-soft">
            الحفظ تلقائي في قاعدة البيانات
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead>
              <tr className="bg-brand-surface-muted border-b border-brand-border-soft text-brand-muted font-bold">
                <th className="py-3.5 px-4 text-start min-w-[220px]">المشرف والدور</th>
                {PERMISSION_COLUMNS.map((col) => (
                  <th key={col.key} className="py-3.5 px-3 text-center min-w-[130px]" title={col.description}>
                    <span className="block text-brand-ink">{col.label}</span>
                    <span className="text-[10px] text-brand-muted font-normal">{col.key}</span>
                  </th>
                ))}
                <th className="py-3.5 px-4 text-center min-w-[150px]">الحالة والتحكم</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border-soft/60">
              {filteredModerators.map((mod) => {
                const isSuper = mod.role === "super_admin";
                const isCurrent = mod.id === currentUser.id;
                const isPending = mod.status === "دعوة معلّقة";
                const inviteLink = mod.inviteToken
                  ? typeof window !== "undefined"
                    ? `${window.location.origin}/invite/${mod.inviteToken}`
                    : `/invite/${mod.inviteToken}`
                  : null;

                return (
                  <tr key={mod.id} className="hover:bg-brand-surface-muted transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs text-white shrink-0 ${
                            isSuper
                              ? "bg-brand-primary shadow-xs"
                              : isPending
                              ? "bg-amber-500 shadow-xs"
                              : "bg-brand-primary"
                          }`}
                        >
                          {mod.name.slice(0, 2)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-brand-ink text-xs truncate">{mod.name}</span>
                            {isCurrent && (
                              <span className="text-[9px] bg-brand-surface-blue text-brand-primary px-1.5 py-0.2 rounded font-bold">
                                أنت
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-brand-muted block font-mono" dir="ltr">
                            {mod.email}
                          </span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md border ${
                                isSuper
                                  ? "bg-brand-surface-blue text-brand-primary border-brand-border-soft"
                                  : isPending
                                  ? "bg-amber-50 text-amber-800 border-amber-200"
                                  : "bg-brand-surface-blue text-brand-primary border-brand-border-soft"
                              }`}
                            >
                              {isSuper ? "Super Admin" : mod.title || "مشرف"}
                            </span>
                            <span className="text-[10px] text-brand-muted truncate">{mod.assignedDepartment}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {PERMISSION_COLUMNS.map((col) => {
                      const hasPerm = isSuper || !!mod.permissions[col.key];

                      return (
                        <td key={col.key} className="py-4 px-3 text-center">
                          {isSuper ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-primary bg-brand-surface-blue px-2.5 py-1 rounded-full border border-brand-border-soft">
                              <span>✓</span>
                              <span>دائم</span>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => onTogglePermission(mod, col.key)}
                              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                hasPerm ? "bg-brand-primary" : "bg-slate-200"
                              }`}
                              aria-label={`تبديل صلاحية ${col.label} لـ ${mod.name}`}
                            >
                              <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                  hasPerm ? "-translate-x-5" : "translate-x-0"
                                }`}
                              />
                            </button>
                          )}
                        </td>
                      );
                    })}

                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-2 flex-wrap">
                        {isPending ? (
                          <>
                            <span className="px-2.5 py-1 rounded-lg text-xs font-bold border bg-amber-50 text-amber-800 border-amber-200">
                              دعوة معلّقة
                            </span>
                            {inviteLink && onCopyInvite && (
                              <button
                                type="button"
                                onClick={() => onCopyInvite(inviteLink, mod.id)}
                                className="px-2 py-1 rounded-lg border border-brand-primary/30 bg-brand-surface-blue text-brand-primary hover:bg-brand-border-soft text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                                title="نسخ رابط تفعيل الحساب"
                              >
                                <span>{copiedToken === mod.id ? "تم النسخ ✓" : "نسخ الرابط 📋"}</span>
                              </button>
                            )}
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onToggleStatus(mod.id)}
                            disabled={isSuper && superAdminsCount <= 1}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors ${
                              mod.status === "نشط"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                : "bg-slate-100 text-brand-muted border-brand-border-soft hover:bg-slate-200"
                            }`}
                            title={mod.status === "نشط" ? "تعطيل الحساب" : "تفعيل الحساب"}
                          >
                            {mod.status}
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => onDeletePrompt(mod)}
                          disabled={isSuper && superAdminsCount <= 1}
                          className="p-1 rounded-lg border border-red-200 bg-white text-red-600 hover:bg-red-50 text-xs transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title="حذف المشرف / إلغاء الدعوة"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
