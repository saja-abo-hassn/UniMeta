"use client";

import React from "react";
import { createPortal } from "react-dom";
import { useOnboardingTour } from "./onboarding-tour/hooks/use-onboarding-tour";
import { TourSpotlightFrame } from "./onboarding-tour/components/tour-spotlight-frame";
import { TourCard } from "./onboarding-tour/components/tour-card";

export type { TourStepConfig } from "./onboarding-tour/types";

export function OnboardingTour() {
  const {
    mounted,
    isOpen,
    cardRef,
    cardPos,
    targetRect,
    prefersReducedMotion,
    activeSteps,
    validStepIndex,
    currentTourStep,
    totalSteps,
    isLastStep,
    progressPercent,
    markTourDone,
    handleNext,
    handlePrev,
    handleTryNow,
    setCurrentStep,
  } = useOnboardingTour();

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-hidden select-none" dir="rtl">
      <div
        className="fixed inset-0 z-40 cursor-default"
        onClick={markTourDone}
        aria-label="إغلاق الجولة التعريفية"
      />

      <TourSpotlightFrame
        targetRect={targetRect}
        prefersReducedMotion={prefersReducedMotion}
      />

      <TourCard
        cardRef={cardRef}
        cardPos={cardPos}
        prefersReducedMotion={prefersReducedMotion}
        currentTourStep={currentTourStep}
        validStepIndex={validStepIndex}
        totalSteps={totalSteps}
        isLastStep={isLastStep}
        progressPercent={progressPercent}
        activeSteps={activeSteps}
        onMarkDone={markTourDone}
        onNext={handleNext}
        onPrev={handlePrev}
        onTryNow={handleTryNow}
        onStepSelect={setCurrentStep}
      />
    </div>,
    document.body
  );
}
