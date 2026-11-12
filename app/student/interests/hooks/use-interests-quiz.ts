"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ORIENTATION_QUESTIONS,
  TraitKey,
  calculateOrientationResult,
  QuizResultCalculation,
  STORAGE_QUIZ_PROGRESS_KEY,
  STORAGE_QUIZ_RESULT_KEY,
} from "@/src/data/major-orientation-config";
import { useStudyPlan } from "@/src/contexts/study-plan-context";
import { useNotifications } from "@/src/contexts/notifications-context";

export function useInterestsQuiz() {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const { selectPlan } = useStudyPlan();
  const { notify } = useNotifications();

  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, TraitKey>>({});
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [result, setResult] = useState<QuizResultCalculation | null>(null);
  const [hasRestoredProgress, setHasRestoredProgress] = useState<boolean>(false);
  const [isApplyingPlan, setIsApplyingPlan] = useState<boolean>(false);

  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem(STORAGE_QUIZ_PROGRESS_KEY);
      if (savedProgress) {
        const parsed = JSON.parse(savedProgress);
        if (parsed.answers && typeof parsed.answers === "object") {
          setAnswers(parsed.answers);
          if (typeof parsed.currentIdx === "number") {
            setCurrentIdx(Math.min(parsed.currentIdx, ORIENTATION_QUESTIONS.length - 1));
          }
          if (parsed.isFinished && parsed.result) {
            setResult(parsed.result);
            setQuizFinished(true);
          } else if (Object.keys(parsed.answers).length > 0) {
            setHasRestoredProgress(true);
          }
        }
      }
    } catch {}
  }, []);

  const persistProgress = (
    nextAnswers: Record<number, TraitKey>,
    nextIdx: number,
    isFinished: boolean = false,
    calculatedResult: QuizResultCalculation | null = null
  ) => {
    try {
      localStorage.setItem(
        STORAGE_QUIZ_PROGRESS_KEY,
        JSON.stringify({
          answers: nextAnswers,
          currentIdx: nextIdx,
          isFinished,
          result: calculatedResult,
          updatedAt: new Date().toISOString(),
        })
      );
      if (isFinished && calculatedResult) {
        localStorage.setItem(STORAGE_QUIZ_RESULT_KEY, JSON.stringify(calculatedResult));
        window.dispatchEvent(new Event("unimeta_orientation_result_updated"));
      }
    } catch {}
  };

  const handleSelectOption = (trait: TraitKey) => {
    const questionId = ORIENTATION_QUESTIONS[currentIdx].id;
    const nextAnswers = { ...answers, [questionId]: trait };
    setAnswers(nextAnswers);

    if (currentIdx + 1 < ORIENTATION_QUESTIONS.length) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      persistProgress(nextAnswers, nextIdx, false, null);
    } else {
      const finalResult = calculateOrientationResult(nextAnswers);
      setResult(finalResult);
      setQuizFinished(true);
      persistProgress(nextAnswers, currentIdx, true, finalResult);

      notify({
        type: "general",
        title: "اكتمل مقياس الميول الأكاديمية! 🎯",
        message: `التخصص الأنسب لك هو: ${finalResult.topMajor.majorName} بنسبة توافق ${finalResult.topMajor.matchPercentage}%.`,
        playSound: true,
      });
    }
  };

  const handlePrevious = () => {
    if (currentIdx > 0) {
      const prevIdx = currentIdx - 1;
      setCurrentIdx(prevIdx);
      persistProgress(answers, prevIdx, false, null);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setAnswers({});
    setQuizFinished(false);
    setResult(null);
    setHasRestoredProgress(false);
    try {
      localStorage.removeItem(STORAGE_QUIZ_PROGRESS_KEY);
    } catch {}
  };

  const handleChoosePlan = (planId: string, majorTitle: string) => {
    setIsApplyingPlan(true);
    selectPlan(planId);

    notify({
      type: "general",
      title: "تم اعتماد الخطة الأكاديمية بنجاح! 🎓",
      message: `تم اعتماد خطة "${majorTitle}" وربطها بملفك الأكاديمي.`,
      playSound: true,
      browserNotify: true,
    });

    setTimeout(() => {
      startTransition(() => {
        router.push("/student/academic");
      });
    }, 450);
  };

  const currentQuestion = ORIENTATION_QUESTIONS[currentIdx];
  const progressPercent = Math.round(((currentIdx + 1) / ORIENTATION_QUESTIONS.length) * 100);
  const selectedTraitForCurrent = answers[currentQuestion?.id];

  return {
    currentIdx,
    answers,
    quizFinished,
    result,
    hasRestoredProgress,
    isApplyingPlan,
    currentQuestion,
    progressPercent,
    selectedTraitForCurrent,
    handleSelectOption,
    handlePrevious,
    handleRestart,
    handleChoosePlan,
  };
}

