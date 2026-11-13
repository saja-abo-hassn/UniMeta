"use client";

import { PermissionGuard } from "@/components/admin/permission-guard";
import { useAdminPermissions } from "./hooks/use-admin-permissions";
import { PermissionsHeader } from "./components/permissions-header";
import { PermissionsKPIs } from "./components/permissions-kpis";
import { PermissionsMatrixTable } from "./components/permissions-matrix-table";
import { PermissionsModals } from "./components/permissions-modals";

export type { PermissionDef } from "./types";

export default function AdminPermissionsPage() {
  const {
    currentUser,
    counts,
    filteredModerators,
    searchQuery,
    setSearchQuery,
    isAddModalOpen,
    setIsAddModalOpen,
    deleteCandidate,
    setDeleteCandidate,
    formData,
    setFormData,
    formError,
    setFormError,
    isSubmitting,
    lastCreatedInvite,
    setLastCreatedInvite,
    copiedToken,
    copyInviteUrl,
    handleTogglePermission,
    handleSubmitAdd,
    toggleModeratorStatus,
    deleteModerator,
  } = useAdminPermissions();

  return (
    <PermissionGuard superAdminOnly>
      <div className="space-y-6 animate-fade-in" dir="rtl">
        <PermissionsHeader
          onOpenAddModal={() => {
            setFormError("");
            setIsAddModalOpen(true);
          }}
        />

        {lastCreatedInvite && (
          <div className="p-4 rounded-2xl bg-brand-surface-blue border-2 border-brand-primary text-brand-ink shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in">
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-lg">🎉</span>
                <span className="font-extrabold text-sm text-brand-primary">
                  تم إنشاء رابط دعوة المشرف بنجاح (صالح لمدة 48 ساعة):
                </span>
              </div>
              <p className="text-xs text-brand-muted">
                تمت دعوة المشرف: <strong className="text-brand-ink">{lastCreatedInvite.moderator.name}</strong> ({lastCreatedInvite.moderator.email})
              </p>
              <div
                className="font-mono text-xs bg-white px-3 py-2 rounded-xl border border-brand-border-soft select-all break-all text-brand-primary font-bold"
                dir="ltr"
              >
                {lastCreatedInvite.inviteUrl}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => copyInviteUrl(lastCreatedInvite.inviteUrl, "banner")}
                className="px-4 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-hover-medium text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>{copiedToken === "banner" ? "تم النسخ ✓" : "نسخ الرابط 📋"}</span>
              </button>
              <button
                type="button"
                onClick={() => setLastCreatedInvite(null)}
                className="p-2 rounded-xl text-brand-muted hover:bg-slate-200 text-xs transition-colors cursor-pointer"
                title="إغلاق"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <PermissionsKPIs counts={counts} />

        <PermissionsMatrixTable
          filteredModerators={filteredModerators}
          currentUser={currentUser}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          superAdminsCount={counts.superAdmins}
          onTogglePermission={handleTogglePermission}
          onToggleStatus={toggleModeratorStatus}
          onDeletePrompt={setDeleteCandidate}
          onCopyInvite={copyInviteUrl}
          copiedToken={copiedToken}
        />

        <PermissionsModals
          isAddModalOpen={isAddModalOpen}
          onCloseAddModal={() => setIsAddModalOpen(false)}
          onSubmitAdd={handleSubmitAdd}
          formData={formData}
          onFormDataChange={setFormData}
          formError={formError}
          isSubmitting={isSubmitting}
          deleteCandidate={deleteCandidate}
          onCloseDelete={() => setDeleteCandidate(null)}
          onConfirmDelete={(id) => {
            deleteModerator(id);
            setDeleteCandidate(null);
          }}
        />
      </div>
    </PermissionGuard>
  );
}
