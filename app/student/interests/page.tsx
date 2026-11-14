"use client";

import { useInterestsQuiz } from "./hooks/use-interests-quiz";
import { apiClient } from "@/src/services/api-client";
import { LiveInterests } from "@/components/integration/live-interests";
import { InterestsHeader } from "./components/interests-header";
import { QuizQuestionCard } from "./components/quiz-question-card";
import { QuizResultView } from "./components/quiz-result-view";

export default function StudentInterestsPage() { return apiClient.isUsingMock() ? <MockStudentInterestsPage/> : <LiveInterests/>; }
function MockStudentInterestsPage() {
  const {
    currentIdx,
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
  } = useInterestsQuiz();

  return (
    <div className="space-y-6 animate-fade-in" dir="rtl">
      <InterestsHeader />

      <div className="max-w-3xl mx-auto">
        {!quizFinished ? (
          <QuizQuestionCard
            currentIdx={currentIdx}
            currentQuestion={currentQuestion}
            progressPercent={progressPercent}
            selectedTraitForCurrent={selectedTraitForCurrent}
            hasRestoredProgress={hasRestoredProgress}
            onSelectOption={handleSelectOption}
            onPrevious={handlePrevious}
            onRestart={handleRestart}
          />
        ) : (
          result && (
            <QuizResultView
              result={result}
              isApplyingPlan={isApplyingPlan}
              onChoosePlan={handleChoosePlan}
              onRestart={handleRestart}
            />
          )
        )}
      </div>
    </div>
  );
}
