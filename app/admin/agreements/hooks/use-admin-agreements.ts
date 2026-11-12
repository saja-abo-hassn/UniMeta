"use client";

import { useState, useMemo, useEffect } from "react";
import { useAdmin, AdminAgreementItem, AdminAgreementStatus } from "@/src/contexts/admin-context";
import {
  VerifiedStudentParty,
  AuditLogEntry,
  logSensitiveDataAccess,
  getPersistedAuditLogs,
  getStudentPartyProfile,
} from "@/src/services/student-verification-service";

export function useAdminAgreements() {
  const { currentUser, agreements, approveAgreement, rejectAgreement, requestAgreementModification } = useAdmin();

  const [activeTab, setActiveTab] = useState<"all" | AdminAgreementStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | "أجهزة" | "كتب ومراجع">("all");
  const [showAuditDrawer, setShowAuditDrawer] = useState(false);

  const [selectedDetails, setSelectedDetails] = useState<AdminAgreementItem | null>(null);
  const [rejectingItem, setRejectingItem] = useState<AdminAgreementItem | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [modifyingItem, setModifyingItem] = useState<AdminAgreementItem | null>(null);
  const [modificationNote, setModificationNote] = useState("");

  const [unmaskTarget, setUnmaskTarget] = useState<{
    agreementId: string;
    student: VerifiedStudentParty;
    partyType: "owner" | "requester";
  } | null>(null);

  const [unmaskedStudentIds, setUnmaskedStudentIds] = useState<Record<string, boolean>>({});
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);

  useEffect(() => {
    setAuditLogs(getPersistedAuditLogs());
  }, []);

  const counts = useMemo(() => {
    return {
      total: agreements.length,
      pending: agreements.filter((a) => a.status === "قيد الانتظار").length,
      approved: agreements.filter((a) => a.status === "موافق عليها").length,
      rejected: agreements.filter((a) => a.status === "مرفوضة").length,
      modification: agreements.filter((a) => a.status === "طلب تعديل").length,
    };
  }, [agreements]);

  const filteredAgreements = useMemo(() => {
    return agreements.filter((agr) => {
      if (activeTab !== "all" && agr.status !== activeTab) return false;
      if (categoryFilter !== "all" && agr.category !== categoryFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchesId = agr.id.toLowerCase().includes(q);
        const matchesTitle = agr.title.toLowerCase().includes(q);
        const matchesRequester = agr.requesterName.toLowerCase().includes(q);
        const matchesOwner = agr.ownerName.toLowerCase().includes(q);
        return matchesId || matchesTitle || matchesRequester || matchesOwner;
      }
      return true;
    });
  }, [agreements, activeTab, categoryFilter, searchQuery]);

  const partiesData = useMemo(() => {
    if (!selectedDetails) return null;

    const requester =
      (selectedDetails.requesterId && getStudentPartyProfile(selectedDetails.requesterId)) ||
      getStudentPartyProfile(selectedDetails.requesterName) || {
        id: "std-unknown-req",
        studentId: "20230000",
        name: selectedDetails.requesterName,
        academicYear: "غير محدد",
        college: "كلية الهندسة وتكنولوجيا المعلومات",
        major: selectedDetails.requesterMajor,
        phone: "0590000000",
        maskedPhone: "059••••00",
        nationalId: "400000000",
        maskedNationalId: "40•••••00",
        borrowingEligibility: "قيد المراجعة الأولية",
        verificationStatus: {
          emailVerified: true,
          phoneVerified: true,
          studentCardVerified: false,
          idVerified: false,
          overallVerified: false,
        },
      };

    const owner =
      (selectedDetails.ownerId && getStudentPartyProfile(selectedDetails.ownerId)) ||
      getStudentPartyProfile(selectedDetails.ownerName) || {
        id: "std-unknown-own",
        studentId: "20220000",
        name: selectedDetails.ownerName,
        academicYear: "غير محدد",
        college: "كلية الهندسة وتكنولوجيا المعلومات",
        major: selectedDetails.ownerMajor,
        phone: "0590000000",
        maskedPhone: "059••••00",
        nationalId: "400000000",
        maskedNationalId: "40•••••00",
        borrowingEligibility: "قيد المراجعة الأولية",
        verificationStatus: {
          emailVerified: true,
          phoneVerified: true,
          studentCardVerified: true,
          idVerified: true,
          overallVerified: true,
        },
      };

    const isRequesterVerified = requester.verificationStatus.overallVerified;
    const isOwnerVerified = owner.verificationStatus.overallVerified;
    const isBothVerified = isRequesterVerified && isOwnerVerified;

    return {
      requester,
      owner,
      isRequesterVerified,
      isOwnerVerified,
      isBothVerified,
    };
  }, [selectedDetails]);

  const handleConfirmUnmask = () => {
    if (!unmaskTarget) return;

    const newLog = logSensitiveDataAccess(
      currentUser.name,
      currentUser.role === "super_admin" ? "Super Admin" : "مشرف",
      unmaskTarget.agreementId,
      unmaskTarget.student
    );

    setAuditLogs((prev) => [newLog, ...prev]);
    setUnmaskedStudentIds((prev) => ({
      ...prev,
      [unmaskTarget.student.id]: true,
    }));
    setUnmaskTarget(null);
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingItem) return;
    if (!rejectionReason.trim()) return;

    rejectAgreement(rejectingItem.id, rejectionReason.trim());
    setRejectingItem(null);
    setRejectionReason("");
    if (selectedDetails?.id === rejectingItem.id) {
      setSelectedDetails(null);
    }
  };

  const handleModificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modifyingItem) return;
    if (!modificationNote.trim()) return;

    requestAgreementModification(modifyingItem.id, modificationNote.trim());
    setModifyingItem(null);
    setModificationNote("");
    if (selectedDetails?.id === modifyingItem.id) {
      setSelectedDetails(null);
    }
  };

  return {
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
  };
}

