"use client";
import { apiClient } from "@/src/services/api-client";
import { LiveReports } from "@/components/integration/live-reports";


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

export default function AdminModerationPage() { return apiClient.isUsingMock() ? <MockAdminModerationPage/> : <LiveReports admin/>; }
function MockAdminModerationPage() {
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
  } = useAdminModeration();

  return (
    <PermissionGuard permission="manage_reports">
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
            setSelectedReport(null);
          }}
          actionModalReport={actionModalReport}
          actionType={actionType}
          onActionTypeChange={setActionType}
          actionNote={actionNote}
          onActionNoteChange={setActionNote}
          onCloseAction={() => setActionModalReport(null)}
          onSubmitAction={handleActionSubmit}
          deleteCandidate={deleteCandidate}
          onCloseDelete={() => setDeleteCandidate(null)}
          onConfirmDelete={(id) => {
            deleteReport(id);
            setDeleteCandidate(null);
          }}
        />
      </div>
    </PermissionGuard>
  );
}
