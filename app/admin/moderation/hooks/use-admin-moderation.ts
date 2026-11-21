"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useAdmin, AdminReportItem } from "@/src/contexts/admin-context";
import { apiClient } from "@/src/services/api-client";
import { requireData, reportApiError } from "@/src/services/api-result";

type ReportStatus = "NEW" | "UNDER_REVIEW" | "WAITING_FOR_INFORMATION" | "RESOLVED" | "CLOSED";
interface DisputeReport {
  id: number;
  agreement_id: number;
  reporter_id: number;
  status: ReportStatus;
  description: string;
  resolution: string | null;
  created_at: string;
}
export type ModerationReport = AdminReportItem & { serverStatus?: ReportStatus };
export const reportActions: Record<ReportStatus, { resolve?: ReportStatus; warning?: ReportStatus; delete_content?: ReportStatus }> = {
  NEW: { resolve: "UNDER_REVIEW" },
  UNDER_REVIEW: { resolve: "RESOLVED", warning: "WAITING_FOR_INFORMATION" },
  WAITING_FOR_INFORMATION: { resolve: "RESOLVED", warning: "UNDER_REVIEW" },
  RESOLVED: { resolve: "CLOSED" },
  CLOSED: {},
};
export const reportLabels: Record<ReportStatus, string> = {
  NEW: "جديد", UNDER_REVIEW: "قيد المراجعة", WAITING_FOR_INFORMATION: "بانتظار معلومات",
  RESOLVED: "تم الحل", CLOSED: "مغلق",
};

function reportRow(row: DisputeReport): ModerationReport {
  return {
    id: String(row.id),
    targetType: "اتفاقية",
    targetTitle: "اتفاقية #" + row.agreement_id,
    reportedBy: "حساب #" + row.reporter_id,
    reason: row.description,
    createdAt: row.created_at.slice(0, 10),
    actionTaken: row.resolution ?? undefined,
    status: row.status === "NEW" ? "مفتوح" : row.status === "CLOSED" ? "مغلق" : "قيد المعالجة",
    serverStatus: row.status,
  };
}

export function useAdminModeration() {
  const { reports: mockReports, updateReportStatus, deleteReport } = useAdmin();
  const [liveReports, setLiveReports] = useState<ModerationReport[]>([]);
  const mock = apiClient.isUsingMock();
  const reports = mock ? mockReports : liveReports;
  const saving = useRef(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (mock) return;
    let active = true;
    void apiClient.all<DisputeReport>("/admin/reports").then(requireData).then((rows) => {
      if (active) setLiveReports(rows.map(reportRow));
    }).catch((error: unknown) => { if (active) reportApiError(error); });
    return () => { active = false; };
  }, [mock]);

  const [activeTab, setActiveTab] = useState<"all" | "مفتوح" | "قيد المعالجة" | "مغلق">("all");
  const [targetTypeFilter, setTargetTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedReport, setSelectedReport] = useState<ModerationReport | null>(null);
  const [actionModalReport, setActionModalReport] = useState<ModerationReport | null>(null);
  const [actionType, setActionType] = useState<"resolve" | "warning" | "delete_content">("resolve");
  const [actionNote, setActionNote] = useState("");
  const [deleteCandidate, setDeleteCandidate] = useState<AdminReportItem | null>(null);

  const counts = useMemo(() => {
    return {
      total: reports.length,
      open: reports.filter((r) => r.status === "مفتوح").length,
      inProgress: reports.filter((r) => r.status === "قيد المعالجة").length,
      closed: reports.filter((r) => r.status === "مغلق").length,
    };
  }, [reports]);

  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      if (activeTab !== "all" && r.status !== activeTab) return false;
      if (targetTypeFilter !== "all" && r.targetType !== targetTypeFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchesId = r.id.toLowerCase().includes(q);
        const matchesTitle = r.targetTitle.toLowerCase().includes(q);
        const matchesReporter = r.reportedBy.toLowerCase().includes(q);
        const matchesReason = r.reason.toLowerCase().includes(q);
        return matchesId || matchesTitle || matchesReporter || matchesReason;
      }
      return true;
    });
  }, [reports, activeTab, targetTypeFilter, searchQuery]);

  const handleActionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionModalReport) return;
    if (!mock) {
      const reason = actionNote.trim();
      const status = actionModalReport.serverStatus && reportActions[actionModalReport.serverStatus][actionType];
      if (!status || !reason || saving.current) return;
      saving.current = true;
      setIsSaving(true);
      try {
        const saved = requireData(await apiClient.patch<DisputeReport>("/admin/reports/" + actionModalReport.id, { status, reason }));
        setLiveReports((rows) => rows.map((row) => row.id === String(saved.id) ? reportRow(saved) : row));
        setActionModalReport(null);
        setActionNote("");
      } catch (error) {
        reportApiError(error);
      } finally {
        saving.current = false;
        setIsSaving(false);
      }
      return;
    }

    let finalAction = "";
    if (actionType === "resolve") {
      finalAction = actionNote.trim() || "تمت التسوية وإغلاق البلاغ بنجاح.";
      updateReportStatus(actionModalReport.id, "مغلق", finalAction);
    } else if (actionType === "warning") {
      finalAction = `تم توجيه إنذار رسمي للمستخدم: ${actionNote.trim()}`;
      updateReportStatus(actionModalReport.id, "قيد المعالجة", finalAction);
    } else if (actionType === "delete_content") {
      finalAction = `تم حجب أو حذف المحتوى المبلغ عنه: ${actionNote.trim()}`;
      updateReportStatus(actionModalReport.id, "مغلق", finalAction);
    }

    setActionModalReport(null);
    setActionNote("");
  };

  return {
    reports,
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
  };
}

