"use client";

import React from "react";
import { TwoStepExchangeModalProps } from "./modal-types";
import { useExchangeModal } from "./hooks/use-exchange-modal";
import { ModalStepperHeader } from "./components/modal-stepper-header";
import { StepKycForm } from "./components/step-kyc-form";
import { StepPledgeSignature } from "./components/step-pledge-signature";
import { Modal } from "@/components/shared/modal";

export type { TwoStepExchangeModalProps } from "./modal-types";

export function TwoStepExchangeModal(props: TwoStepExchangeModalProps) {
  const {
    currentStep,
    setCurrentStep,
    nationalId,
    setNationalId,
    phone,
    setPhone,
    studentId,
    setStudentId,
    fullName,
    setFullName,
    isPhoneVerified,
    setIsPhoneVerified,
    otpCode,
    setOtpCode,
    isSendingOtp,
    isVerifyingOtp,
    otpSent,
    otpCountdown,
    otpNotice,
    errors,
    setErrors,
    pledgeAgreed,
    setPledgeAgreed,
    signatureType,
    setSignatureType,
    signatureDataUrl,
    setSignatureDataUrl,
    canvasRef,
    hasDrawnOnCanvas,
    setHasDrawnOnCanvas,
    isSubmitting,
    submitErrorMessage,
    handleSendOtp,
    handleVerifyOtp,
    handleProceedToStep2,
    startDrawing,
    draw,
    stopDrawing,
    clearCanvas,
    handleFileUpload,
    handleSubmitFinal,
  } = useExchangeModal(props);

  if (!props.isOpen) return null;

  const isStep2Ready =
    pledgeAgreed &&
    (signatureType === "upload" ? !!signatureDataUrl : hasDrawnOnCanvas);

  return (
    <Modal
      isOpen={props.isOpen}
      onClose={props.onClose}
      size="xl"
    >
      <ModalStepperHeader
        item={props.item}
        currentStep={currentStep}
        onClose={props.onClose}
      />

      <Modal.Body className="p-5 sm:p-7 space-y-5">
        {currentStep === 1 && (
          <StepKycForm
            fullName={fullName}
            setFullName={setFullName}
            studentId={studentId}
            setStudentId={setStudentId}
            nationalId={nationalId}
            setNationalId={setNationalId}
            phone={phone}
            setPhone={setPhone}
            isPhoneVerified={isPhoneVerified}
            setIsPhoneVerified={setIsPhoneVerified}
            otpCode={otpCode}
            setOtpCode={setOtpCode}
            isSendingOtp={isSendingOtp}
            isVerifyingOtp={isVerifyingOtp}
            otpSent={otpSent}
            otpCountdown={otpCountdown}
            otpNotice={otpNotice}
            errors={errors}
            setErrors={setErrors}
            onSendOtp={handleSendOtp}
            onVerifyOtp={handleVerifyOtp}
          />
        )}

        {currentStep === 2 && (
          <StepPledgeSignature
            fullName={fullName}
            nationalId={nationalId}
            onBackToStep1={() => setCurrentStep(1)}
            pledgeAgreed={pledgeAgreed}
            setPledgeAgreed={setPledgeAgreed}
            signatureType={signatureType}
            setSignatureType={setSignatureType}
            signatureDataUrl={signatureDataUrl}
            setSignatureDataUrl={setSignatureDataUrl}
            canvasRef={canvasRef}
            hasDrawnOnCanvas={hasDrawnOnCanvas}
            setHasDrawnOnCanvas={setHasDrawnOnCanvas}
            startDrawing={startDrawing}
            draw={draw}
            stopDrawing={stopDrawing}
            clearCanvas={clearCanvas}
            handleFileUpload={handleFileUpload}
            errors={errors}
            submitErrorMessage={submitErrorMessage}
          />
        )}
      </Modal.Body>

      <Modal.Footer className="justify-between">
        {currentStep === 1 ? (
          <>
            <button
              type="button"
              onClick={props.onClose}
              className="px-4 py-2.5 rounded-xl border border-brand-border-soft text-xs font-bold text-brand-muted hover:bg-white transition-colors cursor-pointer"
            >
              إلغاء
            </button>

            <button
              type="button"
              onClick={handleProceedToStep2}
              disabled={!nationalId || !phone || !isPhoneVerified || !studentId}
              className="px-6 py-2.5 rounded-xl bg-brand-primary hover:bg-[#0046A0] disabled:bg-[#A3C7E8] text-white text-xs font-bold transition-all shadow-xs disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
            >
              <span>المتابعة إلى التعهد والتوقيع</span>
              <svg className="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2.5 rounded-xl border border-brand-border-soft text-xs font-bold text-brand-muted hover:bg-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <svg className="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>الرجوع للبيانات</span>
            </button>

            <button
              type="button"
              onClick={handleSubmitFinal}
              disabled={!isStep2Ready || isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:text-brand-muted text-white text-xs font-bold transition-all shadow-xs disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
            >
              {isSubmitting && (
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              <span>إرسال وتوثيق الطلب رسمياً</span>
            </button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
}
