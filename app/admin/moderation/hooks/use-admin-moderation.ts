"use client";

import { useState, useMemo } from "react";
import { useAdmin, AdminReportItem } from "@/src/contexts/admin-context";

export function useAdminModeration() {
  const { reports, updateReportStatus, deleteReport } = useAdmin();

  const [activeTab, setActiveTab] = useState<"all" | "مفتوح" | "قيد المعالجة" | "مغلق">("all");
  const [targetTypeFilter, setTargetTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedReport, setSelectedReport] = useState<AdminReportItem | null>(null);
  const [actionModalReport, setActionModalReport] = useState<AdminReportItem | null>(null);
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

  const handleActionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionModalReport) return;

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
  };
}

