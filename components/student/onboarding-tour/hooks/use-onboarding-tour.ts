"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useStudentUser } from "@/src/hooks/use-student-user";
import {
  ALL_TOUR_STEPS,
  SPOTLIGHT_PADDING,
  MeasuredTarget,
  CardPosition,
  TourStepConfig,
  getVisibleElement,
} from "../types";

export function useOnboardingTour() {
  const router = useRouter();
  const { user } = useStudentUser();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<MeasuredTarget | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const storageKey = user?.studentId
    ? `unimeta_onboarding_done_${user.studentId}`
    : user?.id
    ? `unimeta_onboarding_done_${user.id}`
    : "unimeta_onboarding_done_guest";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const [activeSteps, setActiveSteps] = useState<TourStepConfig[]>(ALL_TOUR_STEPS);

  const refreshActiveSteps = useCallback(() => {
    if (typeof document === "undefined") return;
    const available = ALL_TOUR_STEPS.filter((s) => getVisibleElement(s.selector) !== null);
    if (available.length > 0) {
      setActiveSteps(available);
    } else {
      setActiveSteps(ALL_TOUR_STEPS);
    }
  }, []);

  useEffect(() => {
    try {
      const done = localStorage.getItem(storageKey);
      if (done !== "true") {
        const timer = setTimeout(() => {
          if (window.innerWidth < 1024) {
            window.dispatchEvent(new CustomEvent("unimeta_set_sidebar_open", { detail: true }));
          }
          refreshActiveSteps();
          setIsOpen(true);
          setCurrentStep(0);
        }, 700);
        return () => clearTimeout(timer);
      }
    } catch {}
  }, [storageKey, refreshActiveSteps]);

  useEffect(() => {
    const handleOpen = () => {
      if (window.innerWidth < 1024) {
        window.dispatchEvent(new CustomEvent("unimeta_set_sidebar_open", { detail: true }));
      }
      setTimeout(() => {
        refreshActiveSteps();
        setCurrentStep(0);
        setIsOpen(true);
      }, 50);
    };

    window.addEventListener("unimeta_open_onboarding", handleOpen);
    return () => window.removeEventListener("unimeta_open_onboarding", handleOpen);
  }, [refreshActiveSteps]);

  const markTourDone = useCallback(() => {
    try {
      localStorage.setItem(storageKey, "true");
    } catch {}
    setIsOpen(false);
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      window.dispatchEvent(new CustomEvent("unimeta_set_sidebar_open", { detail: false }));
    }
  }, [storageKey]);

  const validStepIndex = Math.min(currentStep, Math.max(0, activeSteps.length - 1));
  const currentTourStep = activeSteps[validStepIndex] || ALL_TOUR_STEPS[0];
  const totalSteps = activeSteps.length;
  const isLastStep = validStepIndex >= totalSteps - 1;
  const progressPercent = ((validStepIndex + 1) / totalSteps) * 100;

  const measureElement = useCallback((el: HTMLElement): MeasuredTarget => {
    const rect = el.getBoundingClientRect();
    const style = window.getComputedStyle(el);
    const rawRadius = parseFloat(style.borderRadius) || 12;
    return {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
      borderRadius: rawRadius,
    };
  }, []);

  const updateTarget = useCallback(() => {
    if (!isOpen || !currentTourStep) return;
    const el = getVisibleElement(currentTourStep.selector);
    if (el) {
      setTargetRect(measureElement(el));
    } else {
      setTargetRect(null);
    }
  }, [isOpen, currentTourStep, measureElement]);

  useEffect(() => {
    if (!isOpen || !currentTourStep) return;

    const el = getVisibleElement(currentTourStep.selector);
    if (el) {
      setTargetRect(measureElement(el));

      el.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "nearest",
        inline: "nearest",
      });

      let animId: number;
      const startTime = performance.now();
      const loop = (now: number) => {
        const currentEl = getVisibleElement(currentTourStep.selector);
        if (currentEl) {
          setTargetRect(measureElement(currentEl));
        }
        if (now - startTime < 350) {
          animId = requestAnimationFrame(loop);
        }
      };
      animId = requestAnimationFrame(loop);

      return () => {
        cancelAnimationFrame(animId);
      };
    }
  }, [isOpen, validStepIndex, currentTourStep, prefersReducedMotion, measureElement]);

  useEffect(() => {
    if (!isOpen) return;

    const onScrollOrResize = () => {
      requestAnimationFrame(updateTarget);
    };

    window.addEventListener("scroll", onScrollOrResize, { capture: true, passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScrollOrResize, { capture: true });
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [isOpen, updateTarget]);

  useEffect(() => {
    if (!isOpen || typeof ResizeObserver === "undefined") return;

    const ro = new ResizeObserver(() => {
      requestAnimationFrame(updateTarget);
    });

    const el = currentTourStep ? getVisibleElement(currentTourStep.selector) : null;
    if (el) ro.observe(el);

    const sidebarNav = document.querySelector("aside nav") || document.querySelector("aside");
    if (sidebarNav) ro.observe(sidebarNav);

    return () => {
      ro.disconnect();
    };
  }, [isOpen, currentTourStep, updateTarget]);

  const computeCardPosition = useCallback((): CardPosition => {
    const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 1200;
    const viewportHeight = typeof window !== "undefined" ? window.innerHeight : 800;
    const CARD_WIDTH = Math.min(320, Math.max(280, viewportWidth - 32));
    const cardEl = cardRef.current;
    const cardHeight = cardEl ? cardEl.offsetHeight : 230;

    if (viewportWidth < 768) {
      return {
        left: Math.round((viewportWidth - CARD_WIDTH) / 2),
        top: Math.round(viewportHeight - cardHeight - 16),
        arrowTop: 0,
        arrowPlacement: "right",
        isMobile: true,
      };
    }

    const frame = targetRect
      ? {
          left: targetRect.left - SPOTLIGHT_PADDING,
          top: targetRect.top - SPOTLIGHT_PADDING,
          width: targetRect.width + SPOTLIGHT_PADDING * 2,
          height: targetRect.height + SPOTLIGHT_PADDING * 2,
        }
      : {
          left: viewportWidth - 296 - SPOTLIGHT_PADDING,
          top: 180,
          width: 250 + SPOTLIGHT_PADDING * 2,
          height: 44 + SPOTLIGHT_PADDING * 2,
        };

    const gap = 14;
    let left = Math.round(frame.left - CARD_WIDTH - gap);
    let arrowPlacement: "right" | "left" = "right";

    if (left < 16) {
      if (frame.left + frame.width + CARD_WIDTH + gap <= viewportWidth - 16) {
        left = Math.round(frame.left + frame.width + gap);
        arrowPlacement = "left";
      } else {
        left = Math.max(16, Math.min(left, viewportWidth - CARD_WIDTH - 16));
      }
    }

    const targetCenterY = targetRect
      ? targetRect.top + targetRect.height / 2
      : frame.top + frame.height / 2;

    let top = Math.round(targetCenterY - cardHeight / 2);
    top = Math.max(16, Math.min(top, viewportHeight - cardHeight - 16));

    const relativeTargetY = targetCenterY - top;
    const arrowTop = Math.max(22, Math.min(relativeTargetY, cardHeight - 22));

    return {
      left,
      top,
      arrowTop,
      arrowPlacement,
      isMobile: false,
    };
  }, [targetRect]);

  const [cardPos, setCardPos] = useState<CardPosition>({
    left: 100,
    top: 100,
    arrowTop: 30,
    arrowPlacement: "right",
    isMobile: false,
  });

  useEffect(() => {
    if (isOpen) {
      setCardPos(computeCardPosition());
    }
  }, [isOpen, targetRect, computeCardPosition]);

  const handleNext = () => {
    if (validStepIndex < totalSteps - 1) {
      setCurrentStep(validStepIndex + 1);
    } else {
      markTourDone();
    }
  };

  const handlePrev = () => {
    if (validStepIndex > 0) {
      setCurrentStep(validStepIndex - 1);
    }
  };

  const handleTryNow = (url: string) => {
    markTourDone();
    router.push(url);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        markTourDone();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, validStepIndex, totalSteps, markTourDone]);

  return {
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
  };
}

