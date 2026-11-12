"use client";

import React from "react";
import dynamic from "next/dynamic";
import { PermissionGuard } from "@/components/admin/permission-guard";
import { useAdminAgreements } from "./hooks/use-admin-agreements";
import { AgreementStatsCards } from "./components/agreement-stats-cards";
import { AgreementFilterTabs } from "./components/agreement-filter-tabs";
import { AgreementTable } from "./components/agreement-table";

const AgreementDetailsModal = dynamic(
  () =>
    import("./components/agreement-details-modal").then(
      (mod) => mod.AgreementDetailsModal
    ),
  { ssr: false }
);

const AgreementActionModals = dynamic(
  () =>
    import("./components/agreement-action-modals").then(
      (mod) => mod.AgreementActionModals
    ),
  { ssr: false }
);

const SensitiveDataModal = dynamic(
  () =>
    import("./components/sensitive-data-modal").then(
      (mod) => mod.SensitiveDataModal
    ),
  { ssr: false }
);

const AuditLogDrawer = dynamic(
  () =>
    import("./components/audit-log-drawer").then((mod) => mod.AuditLogDrawer),
  { ssr: false }
);

export default function AdminAgreementsPage() {
  const {
    currentUser,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    showAuditDrawer,
    setShowAuditDrawer,
    selectedDetails,
    setSelectedDetails,
    rejectingItem,
    setRejectingItem,
    rejectionReason,
    setRejectionReason,
    modifyingItem,
    setModifyingItem,
    modificationNote,
    setModificationNote,
    unmaskTarget,
    setUnmaskTarget,
    unmaskedStudentIds,
    auditLogs,
    counts,
    filteredAgreements,
    partiesData,
    handleConfirmUnmask,
    handleRejectSubmit,
    handleModificationSubmit,
    approveAgreement,
  } = useAdminAgreements();

  return (
    <PermissionGuard superAdminOnly>
      <div className="space-y-6" dir="rtl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0057C8]" />
              <span className="text-xs font-bold text-[#0057C8] uppercase tracking-wider">
                نظام الرقابة والضمان المعتمد
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                Super Admin فقط
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#16324A] tracking-tight">
              إدارة ومراجعة الاتفاقيات والعهد
            </h1>
            <p className="text-xs sm:text-sm text-[#66788A] leading-relaxed max-w-2xl">
              تدقيق اتفاقيات استعارة الأجهزة والكتب والعهد بين الطلاب بناءً على هويات حقيقية ومتحقق منها. حماية البيانات الشخصية عبر التشفير وسجل التدقيق الأمني (Audit Log).
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setShowAuditDrawer(!showAuditDrawer)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#D7EAF7] bg-white hover:bg-[#F8FBFE] text-[#16324A] text-xs sm:text-sm font-bold transition-all shadow-2xs"
            >
              <span>🛡️ سجل تدقيق الكشف الأمني</span>
              {auditLogs.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#EAF4FD] text-[#0057C8] font-mono font-bold">
                  {auditLogs.length}
                </span>
              )}
            </button>
          </div>
        </div>

        <AuditLogDrawer
          isOpen={showAuditDrawer}
          onClose={() => setShowAuditDrawer(false)}
          auditLogs={auditLogs}
        />

        <AgreementStatsCards counts={counts} />

        <AgreementFilterTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          counts={counts}
        />

        <AgreementTable
          agreements={filteredAgreements}
          onSelectDetails={setSelectedDetails}
        />

        {selectedDetails && partiesData && (
          <AgreementDetailsModal
            selectedDetails={selectedDetails}
            partiesData={partiesData}
            unmaskedStudentIds={unmaskedStudentIds}
            onClose={() => setSelectedDetails(null)}
            onOpenUnmask={setUnmaskTarget}
            onOpenReject={setRejectingItem}
            onOpenModify={setModifyingItem}
            onApprove={(id) => {
              approveAgreement(id);
              setSelectedDetails(null);
            }}
          />
        )}

        <SensitiveDataModal
          unmaskTarget={unmaskTarget}
          actorName={currentUser.name}
          onClose={() => setUnmaskTarget(null)}
          onConfirm={handleConfirmUnmask}
        />

        <AgreementActionModals
          rejectingItem={rejectingItem}
          rejectionReason={rejectionReason}
          setRejectionReason={setRejectionReason}
          onCloseReject={() => setRejectingItem(null)}
          onSubmitReject={handleRejectSubmit}
          modifyingItem={modifyingItem}
          modificationNote={modificationNote}
          setModificationNote={setModificationNote}
          onCloseModify={() => setModifyingItem(null)}
          onSubmitModify={handleModificationSubmit}
        />
      </div>
    </PermissionGuard>
  );
}
