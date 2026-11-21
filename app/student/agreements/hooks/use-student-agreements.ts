"use client";

import { useState, useEffect, useRef } from "react";
import { useNotifications } from "@/src/contexts/notifications-context";
import { formatCurrency } from "@/src/lib/currency";
import { useStudentUser } from "@/src/hooks/use-student-user";
import { apiClient } from "@/src/services/api-client";
import { requireData, reportApiError } from "@/src/services/api-result";
import { marketplaceService } from "@/src/services/marketplace-service";
import { AgreementItem, OutgoingRequestItem, IncomingRequestItem } from "../types";
import {
  initialAgreements,
  initialOutgoingRequests,
  initialIncomingRequests,
} from "../data/initial-agreements-data";

const outgoingStatuses = {
  PENDING: "قيد المراجعة", ACCEPTED: "تمت الموافقة", REJECTED: "مرفوض",
  WITHDRAWN: "مسحوب", CANCELLED: "ملغى",
} satisfies Record<string, OutgoingRequestItem["status"]>;

const agreementLabels: Record<string, string> = {
  AWAITING_SIGNATURES: "بانتظار توقيع الطرفين", AWAITING_APPROVAL: "بانتظار اعتماد الإدارة",
  AWAITING_HANDOVER: "بانتظار التسليم", ACTIVE: "نشطة", OVERDUE: "بانتظار الإرجاع",
  DISPUTED: "محل نزاع", COMPLETED: "مكتملة", REJECTED: "مرفوضة", CANCELLED: "ملغاة",
  REVISION_REQUESTED: "مطلوب تعديل",
};
interface LiveAgreement {
  number: string;
  owner_id: number;
  status: string;
  return_due_date: string | null;
  created_at: string;
  terms: { title?: string; deposit?: string | null; currency?: "ILS" | "JOD" | "USD" | null };
}

async function loadAgreements(userId: string): Promise<AgreementItem[]> {
  const rows = requireData(await apiClient.all<LiveAgreement>("/agreements"));
  return rows.map((row) => {
    const deadline = row.return_due_date?.slice(0, 10);
    return {
      id: row.number,
      itemName: row.terms.title ?? "—",
      category: "—",
      otherParty: { name: "—", major: "", role: String(row.owner_id) === userId ? "المستعير" : "المالك" },
      startDate: row.created_at.slice(0, 10),
      returnDeadline: deadline ?? "—",
      daysRemaining: deadline ? Math.max(0, Math.ceil((Date.parse(deadline) - Date.now()) / 86400000)) : 0,
      depositAmount: 0,
      status: row.status === "ACTIVE" ? "نشطة" : row.status === "OVERDUE" ? "بانتظار الإرجاع" : "مكتملة",
      live: {
        statusLabel: agreementLabels[row.status] ?? row.status,
        depositLabel: row.terms.deposit != null && row.terms.currency
          ? new Intl.NumberFormat("ar", { style: "currency", currency: row.terms.currency }).format(Number(row.terms.deposit))
          : "—",
      },
    };
  });
}

export function useStudentAgreements() {
  const { notify } = useNotifications();
  const { user } = useStudentUser();
  const mock = apiClient.isUsingMock();
  const busy = useRef(false);
  const currentStudentName = user?.name || "سارة أحمد النجار";
  const currentStudentId = user?.studentId || "20231045";
  const currentStudentMajor = (user as unknown as { major?: string })?.major || user?.faculty || "هندسة أنظمة الحاسوب";

  const [activeTab, setActiveTab] = useState<"agreements" | "outgoing" | "incoming">("agreements");
  const [agreements, setAgreements] = useState<AgreementItem[]>(mock ? initialAgreements : []);
  const [agreementFilter, setAgreementFilter] = useState<"all" | "active" | "returning" | "completed">("all");

  const [outgoingRequests, setOutgoingRequests] = useState<OutgoingRequestItem[]>(mock ? initialOutgoingRequests : []);
  const [incomingRequests, setIncomingRequests] = useState<IncomingRequestItem[]>(mock ? initialIncomingRequests : []);
  const [modifyingRequest, setModifyingRequest] = useState<OutgoingRequestItem | null>(null);

  useEffect(() => {
    if (!mock) {
      if (!user?.id) return;
      let active = true;
      void loadAgreements(user.id).then((rows) => {
        if (active) setAgreements(rows);
      }).catch((error: unknown) => { if (active) reportApiError(error); });
      void marketplaceService.outgoing().then((rows) => {
        if (active) setOutgoingRequests(rows.map((request) => ({
          id: String(request.id), itemName: request.offer?.title ?? "—",
          category: "—", ownerName: "—", ownerMajor: "", deposit: null,
          requestedDuration: "—", proposedStartDate: "—", requestDate: request.created_at.slice(0, 10),
          status: outgoingStatuses[request.status],
        })));
      }).catch((error: unknown) => { if (active) reportApiError(error); });
      void marketplaceService.incoming().then((rows) => {
        if (active) setIncomingRequests(rows.map(({ offer, request }) => ({
          id: String(request.id), itemName: offer.title, offerId: offer.id, offerType: offer.offer_type,
          category: offer.item_type === "DEVICE" ? "أجهزة" : "كتب ومراجع",
          requesterName: request.requester?.full_name ?? "—", requesterMajor: "—",
          requestedDuration: offer.duration_days ? offer.duration_days + " يوم" : "—",
          proposedStartDate: "—", requestDate: request.created_at.slice(0, 10), message: request.message ?? undefined,
        })));
      }).catch((error: unknown) => { if (active) reportApiError(error); });
      return () => { active = false; };
    }
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
  }, [mock, user?.id]);

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
    if (agreementFilter === "completed") return (a.live?.statusLabel ?? a.status) === "مكتملة";
    return true;
  });

  const handleConfirmExtension = () => {
    if (!mock || !extensionModal.agreement) return;
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
    if (!mock || !returnConfirmModal.agreement) return;
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
    if (!mock) {
      if (busy.current || !req.offerType) return;
      const temporary = ["LOAN", "RENTAL", "TEMPORARY_EXCHANGE"].includes(req.offerType);
      const exchange = req.offerType.includes("EXCHANGE");
      const due = temporary ? window.prompt("أدخل موعد الإرجاع بصيغة YYYY-MM-DD")?.trim() : undefined;
      if (temporary && !due) return;
      const item = exchange ? window.prompt("اكتب وصف الغرض الذي سيقدّمه الطرف الآخر")?.trim() : undefined;
      if (exchange && !item) return;
      void updateRequest(async () => {
        await marketplaceService.respond(req.id, "accept", { return_due_date: due, exchange_item: item });
        setIncomingRequests((rows) => rows.filter((row) => row.offerId !== req.offerId));
        notify({ type: "agreement", title: "تم قبول الطلب", message: "أُنشئت اتفاقية بانتظار توقيع الطرفين." });
        if (user?.id) setAgreements(await loadAgreements(user.id));
      });
      return;
    }
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

  function openRejectIncoming(request: IncomingRequestItem) {
    if (mock) {
      setRejectModal({ open: true, request, reason: "" });
      return;
    }
    if (busy.current || !window.confirm("هل تريد رفض هذا الطلب؟")) return;
    void updateRequest(async () => {
      await marketplaceService.respond(request.id, "reject");
      setIncomingRequests((rows) => rows.filter((row) => row.id !== request.id));
    });
  }

  const handleCancelOutgoing = (id: string, itemName: string) => {
    if (!mock) {
      void updateRequest(async () => {
        await marketplaceService.respond(id, "withdraw");
        setOutgoingRequests((rows) => rows.map((row) => row.id === id ? { ...row, status: "مسحوب" } : row));
      });
      return;
    }
    setOutgoingRequests((prev) => prev.filter((r) => r.id !== id));
    notify({
      type: "general",
      title: "تم إلغاء الطلب",
      message: `تم إلغاء طلب استعارة "${itemName}" بنجاح.`,
    });
  };

  async function updateRequest(action: () => Promise<void>) {
    if (busy.current) return;
    busy.current = true;
    try {
      await action();
    } catch (error) {
      reportApiError(error);
    } finally {
      busy.current = false;
    }
  }

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
    openRejectIncoming,
    handleCancelOutgoing,
  };
}

