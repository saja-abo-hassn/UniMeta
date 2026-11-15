"use client";
import { apiClient } from "@/src/services/api-client";
import { LiveAdminOverview } from "@/components/integration/live-admin";

import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { useAdmin } from "@/src/contexts/admin-context";
import { AdminAgreementItem } from "@/src/types/admin";
import { AdminOverviewHeader } from "./components/admin-overview-header";
import { AdminKPIs } from "./components/admin-kpis";
import { AdminAgreementsReview } from "./components/admin-agreements-review";
import { AdminQuickModules } from "./components/admin-quick-modules";

const DynamicAdminRejectionModal = dynamic(
  () => import("./components/admin-rejection-modal").then((m) => m.AdminRejectionModal),
  { ssr: false }
);

const DynamicAdminAgreementDetailsModal = dynamic(
  () => import("./components/admin-agreement-details-modal").then((m) => m.AdminAgreementDetailsModal),
  { ssr: false }
);

export default function AdminOverviewPage() { return apiClient.isUsingMock() ? <MockAdminOverviewPage/> : <LiveAdminOverview/>; }
function MockAdminOverviewPage() {
  const {
    currentUser,
    agreements,
    materials,
    courses,
    reports,
    members,
    approveAgreement,
    rejectAgreement,
  } = useAdmin();

  const [agreementStatusFilter, setAgreementStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState("");
  const [detailsAgreement, setDetailsAgreement] = useState<AdminAgreementItem | null>(null);

  const pendingAgreementsCount = agreements.filter((a) => a.status === "قيد الانتظار").length;
  const activeAgreementsCount = agreements.filter((a) => a.status === "موافق عليها").length;
  const reviewMaterialsCount = materials.filter((m) => m.status === "قيد المراجعة").length;
  const publishedMaterialsCount = materials.filter((m) => m.status === "منشور").length;
  const openReportsCount = reports.filter((r) => r.status === "مفتوح").length;
  const totalStudents = members.length;

  const activeNow = useMemo(() => {
    return members.filter((m) => {
      const last = (m.lastActive || "").toLowerCase();
      return (
        m.status === "نشط" &&
        (last.includes("10") ||
          last.includes("15") ||
          last.includes("دقيقة") ||
          last.includes("دقائق") ||
          last.includes("الآن"))
      );
    }).length;
  }, [members]);

  const coveredCoursesCount = useMemo(() => {
    const publishedCodes = new Set(
      materials.filter((m) => m.status === "منشور").map((m) => m.courseCode.toUpperCase())
    );
    return courses.filter((c) => publishedCodes.has(c.code.toUpperCase())).length;
  }, [materials, courses]);

  const filteredAgreements = useMemo(() => {
    return agreements.filter((agr) => {
      if (agreementStatusFilter !== "all" && agr.status !== agreementStatusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        return (
          agr.id.toLowerCase().includes(q) ||
          agr.title.toLowerCase().includes(q) ||
          agr.requesterName.toLowerCase().includes(q) ||
          agr.ownerName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [agreements, agreementStatusFilter, searchQuery]);

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingId) return;
    rejectAgreement(rejectingId, rejectionReasonInput.trim() || "لم يتم استيفاء شروط الاستعارة المعتمدة.");
    setRejectingId(null);
    setRejectionReasonInput("");
  };

  return (
    <div className="space-y-7" dir="rtl">
      <AdminOverviewHeader
        currentUser={currentUser}
        pendingAgreementsCount={pendingAgreementsCount}
      />

      <AdminKPIs
        totalStudents={totalStudents}
        activeNow={activeNow}
        pendingAgreementsCount={pendingAgreementsCount}
        activeAgreementsCount={activeAgreementsCount}
        publishedMaterialsCount={publishedMaterialsCount}
        coveredCoursesCount={coveredCoursesCount}
        totalCoursesCount={courses.length}
        openReportsCount={openReportsCount}
      />

      <AdminAgreementsReview
        agreements={agreements}
        filteredAgreements={filteredAgreements}
        agreementStatusFilter={agreementStatusFilter}
        onStatusFilterChange={setAgreementStatusFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        pendingAgreementsCount={pendingAgreementsCount}
        activeAgreementsCount={activeAgreementsCount}
        onApprove={approveAgreement}
        onRejectPrompt={setRejectingId}
        onViewDetails={setDetailsAgreement}
      />

      <AdminQuickModules reviewMaterialsCount={reviewMaterialsCount} />

      {rejectingId && (
        <DynamicAdminRejectionModal
          rejectingId={rejectingId}
          rejectionReasonInput={rejectionReasonInput}
          onReasonChange={setRejectionReasonInput}
          onClose={() => setRejectingId(null)}
          onSubmit={handleConfirmReject}
        />
      )}

      {detailsAgreement && (
        <DynamicAdminAgreementDetailsModal
          detailsAgreement={detailsAgreement}
          onClose={() => setDetailsAgreement(null)}
          onApprove={approveAgreement}
          onRejectPrompt={setRejectingId}
        />
      )}
    </div>
  );
}
