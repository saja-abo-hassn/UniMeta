"use client";
import dynamic from "next/dynamic";
import { PermissionGuard } from "@/components/admin/permission-guard";
import { useAdminModeration } from "./hooks/use-admin-moderation";
import { ModerationHeader } from "./components/moderation-header";
import { ModerationKPIs } from "./components/moderation-kpis";
import { ModerationFilterBar } from "./components/moderation-filter-bar";
import { ReportsTable } from "./components/reports-table";

const DynamicModerationModals = dynamic(
  () => import("./components/moderation-modals").then((mod) => mod.ModerationModals),
  { ssr: false }
);

export default function AdminModerationPage() {
  return <PermissionGuard permission="manage_reports"><AdminModeration /></PermissionGuard>;
}
function AdminModeration() {
  const {
    counts,
    filteredReports,
    activeTab,
    setActiveTab,
    targetTypeFilter,
    setTargetTypeFilter,
    searchQuery,
    setSearchQuery,
    selectedReport,
    setSelectedReport,
    actionModalReport,
    setActionModalReport,
    actionType,
    setActionType,
    actionNote,
    setActionNote,
    deleteCandidate,
    setDeleteCandidate,
    handleActionSubmit,
    deleteReport,
    isSaving,
  } = useAdminModeration();

  return (
      <div className="space-y-6 animate-fade-in" dir="rtl">
        <ModerationHeader />

        <ModerationKPIs counts={counts} />

        <ModerationFilterBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          targetTypeFilter={targetTypeFilter}
          onTargetTypeFilterChange={setTargetTypeFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          counts={counts}
        />

        <ReportsTable
          reports={filteredReports}
          onSelectReport={setSelectedReport}
          onOpenActionModal={(item) => {
            setActionModalReport(item);
            setActionType("resolve");
            setActionNote("");
          }}
          onDeleteCandidate={setDeleteCandidate}
        />

        <DynamicModerationModals
          selectedReport={selectedReport}
          onCloseDetails={() => setSelectedReport(null)}
          onOpenActionFromDetails={(report) => {
            setActionModalReport(report);
            setActionType("resolve");
            setActionNote("");
            setSelectedReport(null);
          }}
          actionModalReport={actionModalReport}
          actionType={actionType}
          onActionTypeChange={setActionType}
          actionNote={actionNote}
          onActionNoteChange={setActionNote}
          onCloseAction={() => { if (!isSaving) setActionModalReport(null); }}
          onSubmitAction={handleActionSubmit}
          isSaving={isSaving}
          deleteCandidate={deleteCandidate}
          onCloseDelete={() => setDeleteCandidate(null)}
          onConfirmDelete={(id) => {
            deleteReport(id);
            setDeleteCandidate(null);
          }}
        />
      </div>
  );
}
