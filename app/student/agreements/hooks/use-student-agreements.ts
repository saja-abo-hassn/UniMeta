"use client";

import { useState, useEffect } from "react";
import { useNotifications } from "@/src/contexts/notifications-context";
import { formatCurrency } from "@/src/lib/currency";
import { useStudentUser } from "@/src/hooks/use-student-user";
import { AgreementItem, OutgoingRequestItem, IncomingRequestItem } from "../types";
import {
  initialAgreements,
  initialOutgoingRequests,
  initialIncomingRequests,
} from "../data/initial-agreements-data";

export function useStudentAgreements() {
  const { notify } = useNotifications();
  const { user } = useStudentUser();
  const currentStudentName = user?.name || "سارة أحمد النجار";
  const currentStudentId = user?.studentId || "20231045";
  const currentStudentMajor = (user as unknown as { major?: string })?.major || user?.faculty || "هندسة أنظمة الحاسوب";

  const [activeTab, setActiveTab] = useState<"agreements" | "outgoing" | "incoming">("agreements");
  const [agreements, setAgreements] = useState<AgreementItem[]>(initialAgreements);
  const [agreementFilter, setAgreementFilter] = useState<"all" | "active" | "returning" | "completed">("all");

  const [outgoingRequests, setOutgoingRequests] = useState<OutgoingRequestItem[]>(initialOutgoingRequests);
  const [incomingRequests, setIncomingRequests] = useState<IncomingRequestItem[]>(initialIncomingRequests);
  const [modifyingRequest, setModifyingRequest] = useState<OutgoingRequestItem | null>(null);

  useEffect(() => {
    const loadDynamicOutgoing = () => {
      try {
        const adminStored = localStorage.getItem("unimeta_admin_agreements_v1");
        const adminList: Array<{
          id: string;
          status: string;
          rejectionReason?: string;
          modificationNote?: string;
          signatureUrl?: string;
          pledgeVersion?: string;
        }> = adminStored ? JSON.parse(adminStored) : [];
        const studentStored = localStorage.getItem("unimeta_student_outgoing_requests_v1");
        const studentList: OutgoingRequestItem[] = studentStored ? JSON.parse(studentStored) : [];

        const adminMap = new Map(adminList.map((a) => [a.id, a]));
        const combined = [...studentList, ...initialOutgoingRequests];
        const deduplicated: OutgoingRequestItem[] = [];
        const seenIds = new Set<string>();

        for (const item of combined) {
          if (!seenIds.has(item.id)) {
            seenIds.add(item.id);
            const adminMatch = adminMap.get(item.id);
            if (adminMatch) {
              const mappedStatus =
                adminMatch.status === "موافق عليها"
                  ? "تمت الموافقة"
                  : adminMatch.status === "مرفوضة"
                  ? "مرفوض"
                  : adminMatch.status === "طلب تعديل"
                  ? "طلب تعديل"
                  : "قيد المراجعة";

              deduplicated.push({
                ...item,
                status: mappedStatus as OutgoingRequestItem["status"],
                rejectionReason: adminMatch.rejectionReason || item.rejectionReason,
                modificationNote: adminMatch.modificationNote || item.modificationNote,
                signatureUrl: adminMatch.signatureUrl || item.signatureUrl,
                pledgeVersion: adminMatch.pledgeVersion || item.pledgeVersion,
              });
            } else {
              deduplicated.push(item);
            }
          }
        }

        setOutgoingRequests(deduplicated);
      } catch {
        // ignore
      }
    };

    loadDynamicOutgoing();
    window.addEventListener("unimeta_agreements_updated", loadDynamicOutgoing);
    window.addEventListener("unimeta_admin_agreements_updated", loadDynamicOutgoing);
    return () => {
      window.removeEventListener("unimeta_agreements_updated", loadDynamicOutgoing);
      window.removeEventListener("unimeta_admin_agreements_updated", loadDynamicOutgoing);
    };
  }, []);

  const [extensionModal, setExtensionModal] = useState<{ open: boolean; agreement?: AgreementItem; days: number }>({
    open: false,
    days: 7,
  });

  const [returnConfirmModal, setReturnConfirmModal] = useState<{ open: boolean; agreement?: AgreementItem }>({
    open: false,
  });

  const [rejectModal, setRejectModal] = useState<{ open: boolean; request?: IncomingRequestItem; reason: string }>({
    open: false,
    reason: "",
  });

  const activeAgreementsCount = agreements.filter((a) => a.status === "نشطة").length;
  const returningCount = agreements.filter((a) => a.status === "بانتظار الإرجاع").length;
  const pendingIncomingCount = incomingRequests.length;
  const pendingOutgoingCount = outgoingRequests.filter((r) => r.status === "قيد المراجعة").length;

  const filteredAgreements = agreements.filter((a) => {
    if (agreementFilter === "active") return a.status === "نشطة";
    if (agreementFilter === "returning") return a.status === "بانتظار الإرجاع";
    if (agreementFilter === "completed") return a.status === "مكتملة";
    return true;
  });

  const handleConfirmExtension = () => {
    if (!extensionModal.agreement) return;
    const { agreement, days } = extensionModal;

    setAgreements((prev) =>
      prev.map((a) =>
        a.id === agreement.id
          ? {
              ...a,
              daysRemaining: a.daysRemaining + days,
              returnDeadline: `2026-04-${15 + days > 30 ? "30" : 15 + days}`,
            }
          : a
      )
    );

    notify({
      type: "agreement",
      title: "تم إرسال طلب تمديد الاتفاقية",
      message: `تم إرسال طلب تمديد لمدة ${days} أيام للاتفاقية (${agreement.id}) بانتظار موافقة الطرف الآخر.`,
    });

    setExtensionModal({ open: false, days: 7 });
  };

  const handleConfirmReturn = () => {
    if (!returnConfirmModal.agreement) return;
    const agreement = returnConfirmModal.agreement;

    setAgreements((prev) =>
      prev.map((a) =>
        a.id === agreement.id
          ? {
              ...a,
              status: "مكتملة",
              daysRemaining: 0,
            }
          : a
      )
    );

    notify({
      type: "agreement",
      title: "تم توثيق إرجاع العنصر واسترداد التأمين",
      message: `تم إنهاء الاتفاقية ${agreement.id} بنجاح، وتأكيد استرجاع مبلغ التأمين (${formatCurrency(agreement.depositAmount, "ILS")}).`,
    });

    setReturnConfirmModal({ open: false });
  };

  const handleAcceptIncoming = (req: IncomingRequestItem) => {
    setIncomingRequests((prev) => prev.filter((r) => r.id !== req.id));

    const newAgreementId = `AGR-2026-${req.id.replace(/\D/g, "") || "105"}`;
    const newAgreement: AgreementItem = {
      id: newAgreementId,
      itemName: req.itemName,
      category: req.category,
      otherParty: {
        name: req.requesterName,
        major: req.requesterMajor,
        role: "المستعير",
        phone: "+970 59-7000000",
      },
      startDate: new Date().toISOString().split("T")[0],
      returnDeadline: "2026-04-25",
      daysRemaining: 14,
      depositAmount: req.category === "أجهزة" ? 15 : 5,
      status: "نشطة",
      notes: "تم قبول الطلب عبر منصة يوني ميتا وتوثيق الاتفاقية.",
    };

    setAgreements((prev) => [newAgreement, ...prev]);

    notify({
      type: "agreement",
      title: "تم قبول طلب الإعارة وتفعيل الاتفاقية",
      message: `وافقت على إعارة "${req.itemName}" للطالب ${req.requesterName}. تم إنشاء العقد ${newAgreementId}.`,
    });
  };

  const handleConfirmRejectIncoming = () => {
    if (!rejectModal.request) return;
    const req = rejectModal.request;

    setIncomingRequests((prev) => prev.filter((r) => r.id !== req.id));

    notify({
      type: "agreement",
      title: "تم الاعتذار عن طلب الإعارة",
      message: `تم إرسال إشعار اعتذار للطالب ${req.requesterName} عن إعارة "${req.itemName}".`,
    });

    setRejectModal({ open: false, reason: "" });
  };

  const handleCancelOutgoing = (id: string, itemName: string) => {
    setOutgoingRequests((prev) => prev.filter((r) => r.id !== id));
    notify({
      type: "general",
      title: "تم إلغاء الطلب",
      message: `تم إلغاء طلب استعارة "${itemName}" بنجاح.`,
    });
  };

  return {
    currentStudentName,
    currentStudentId,
    currentStudentMajor,
    activeTab,
    setActiveTab,
    agreementFilter,
    setAgreementFilter,
    filteredAgreements,
    outgoingRequests,
    incomingRequests,
    modifyingRequest,
    setModifyingRequest,
    extensionModal,
    setExtensionModal,
    returnConfirmModal,
    setReturnConfirmModal,
    rejectModal,
    setRejectModal,
    activeAgreementsCount,
    returningCount,
    pendingIncomingCount,
    pendingOutgoingCount,
    handleConfirmExtension,
    handleConfirmReturn,
    handleAcceptIncoming,
    handleConfirmRejectIncoming,
    handleCancelOutgoing,
  };
}

