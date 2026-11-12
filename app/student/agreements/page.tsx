"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useStudentAgreements } from "./hooks/use-student-agreements";
import { AgreementsKpiCards } from "./components/agreements-kpi-cards";
import { ActiveAgreementsSection } from "./components/active-agreements-section";
import { OutgoingRequestsSection } from "./components/outgoing-requests-section";
import { IncomingRequestsSection } from "./components/incoming-requests-section";
import { useNotifications } from "@/src/contexts/notifications-context";

const TwoStepExchangeModal = dynamic(
  () =>
    import("@/components/student/exchange/two-step-exchange-modal").then(
      (m) => m.TwoStepExchangeModal
    ),
  { ssr: false }
);

const AgreementStudentModals = dynamic(
  () =>
    import("./components/agreement-student-modals").then(
      (m) => m.AgreementStudentModals
    ),
  { ssr: false }
);

export default function StudentAgreementsPage() {
  const { notify } = useNotifications();
  const {
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
  } = useStudentAgreements();

  return (
    <div className="space-y-6 animate-fade-in" dir="rtl">
      <section className="card-entrance relative overflow-hidden p-6 sm:p-7 rounded-3xl bg-white border border-[#D7EAF7] shadow-xs">
        <div className="absolute top-0 end-0 -mt-8 -me-8 w-64 h-64 bg-gradient-to-br from-[#4DB7F2]/10 to-[#0057C8]/5 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#EAF4FD] text-[#0057C8] border border-[#D7EAF7]">
                <span className="w-2 h-2 rounded-full bg-[#0057C8]" />
                عقود الإعارة والطلبات الأكاديمية الموثقة
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#16324A] tracking-tight">
              اتفاقياتي وطلباتي
            </h1>
            <p className="text-xs sm:text-sm text-[#66788A] mt-1 max-w-2xl leading-relaxed">
              إدارة عقود تبادل واستئجار الأجهزة والمراجع الدراسية، متابعة مواعيد الإرجاع، وتوثيق استلام وتسليم المقتنيات بالشيكل (₪).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-xl bg-[#F0F7FD] text-xs font-bold text-[#0057C8] border border-[#D7EAF7]">
              العملة المعتمدة: الشيكل (₪)
            </span>
          </div>
        </div>
      </section>

      <AgreementsKpiCards
        activeAgreementsCount={activeAgreementsCount}
        returningCount={returningCount}
        pendingIncomingCount={pendingIncomingCount}
        pendingOutgoingCount={pendingOutgoingCount}
      />

      <div className="bg-white border border-[#D7EAF7] rounded-2xl p-1.5 shadow-xs overflow-x-auto">
        <div className="flex items-center justify-between gap-1.5 min-w-[550px] sm:min-w-0">
          <button
            type="button"
            onClick={() => setActiveTab("agreements")}
            className={`flex-1 py-2.5 px-4 rounded-xl text-center text-xs sm:text-sm font-bold transition-all duration-150 flex items-center justify-center gap-2 ${
              activeTab === "agreements"
                ? "bg-[#0057C8] text-white shadow-xs"
                : "text-[#16324A] hover:text-[#0057C8] hover:bg-[#F4FAFF]"
            }`}
          >
            <span>اتفاقياتي السارية والمكتملة</span>
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full ${
                activeTab === "agreements" ? "bg-white/20 text-white" : "bg-[#F0F7FD] text-[#0057C8]"
              }`}
            >
              {filteredAgreements.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("outgoing")}
            className={`flex-1 py-2.5 px-4 rounded-xl text-center text-xs sm:text-sm font-bold transition-all duration-150 flex items-center justify-center gap-2 ${
              activeTab === "outgoing"
                ? "bg-[#0057C8] text-white shadow-xs"
                : "text-[#16324A] hover:text-[#0057C8] hover:bg-[#F4FAFF]"
            }`}
          >
            <span>طلباتي الصادرة</span>
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full ${
                activeTab === "outgoing" ? "bg-white/20 text-white" : "bg-[#F0F7FD] text-[#0057C8]"
              }`}
            >
              {outgoingRequests.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("incoming")}
            className={`flex-1 py-2.5 px-4 rounded-xl text-center text-xs sm:text-sm font-bold transition-all duration-150 flex items-center justify-center gap-2 ${
              activeTab === "incoming"
                ? "bg-[#0057C8] text-white shadow-xs"
                : "text-[#16324A] hover:text-[#0057C8] hover:bg-[#F4FAFF]"
            }`}
          >
            <span>طلباتي الواردة</span>
            {pendingIncomingCount > 0 && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500 text-white font-bold">
                {pendingIncomingCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {activeTab === "agreements" && (
        <ActiveAgreementsSection
          agreements={filteredAgreements}
          filteredAgreements={filteredAgreements}
          activeAgreementsCount={activeAgreementsCount}
          returningCount={returningCount}
          agreementFilter={agreementFilter}
          setAgreementFilter={setAgreementFilter}
          onOpenExtension={(agreement) =>
            setExtensionModal({ open: true, agreement, days: 7 })
          }
          onOpenReturn={(agreement) =>
            setReturnConfirmModal({ open: true, agreement })
          }
        />
      )}

      {activeTab === "outgoing" && (
        <OutgoingRequestsSection
          outgoingRequests={outgoingRequests}
          onCancelOutgoing={handleCancelOutgoing}
          onModifyRequest={setModifyingRequest}
        />
      )}

      {activeTab === "incoming" && (
        <IncomingRequestsSection
          incomingRequests={incomingRequests}
          onAcceptIncoming={handleAcceptIncoming}
          onOpenRejectModal={(req) =>
            setRejectModal({ open: true, request: req, reason: "" })
          }
        />
      )}

      <AgreementStudentModals
        extensionModal={extensionModal}
        setExtensionModal={setExtensionModal}
        onConfirmExtension={handleConfirmExtension}
        returnConfirmModal={returnConfirmModal}
        setReturnConfirmModal={setReturnConfirmModal}
        onConfirmReturn={handleConfirmReturn}
        rejectModal={rejectModal}
        setRejectModal={setRejectModal}
        onConfirmRejectIncoming={handleConfirmRejectIncoming}
      />

      {modifyingRequest && (
        <TwoStepExchangeModal
          isOpen={!!modifyingRequest}
          onClose={() => setModifyingRequest(null)}
          existingAgreementId={modifyingRequest.id}
          item={{
            id: modifyingRequest.id,
            title: modifyingRequest.itemName,
            category: modifyingRequest.category,
            ownerName: modifyingRequest.ownerName,
            ownerMajor: modifyingRequest.ownerMajor,
            depositAmount: modifyingRequest.deposit,
            durationText: modifyingRequest.requestedDuration,
          }}
          currentStudent={{
            name: currentStudentName,
            studentId: currentStudentId,
            major: currentStudentMajor,
          }}
          onSuccess={() => {
            setModifyingRequest(null);
            notify({
              type: "agreement",
              title: "تم تعديل الطلب وإعادة الإرسال بنجاح",
              message: "تم تحديث البيانات والتوقيع بنجاح وإعادة تقديم الاتفاقية إلى الإدارة للمراجعة.",
            });
          }}
        />
      )}
    </div>
  );
}
