import { useState } from "react";
import { ExamData, ExamResult, QuizState } from "../types/exam";
import { removeCompletedExams, saveExamProgress } from "../utils/examStorage";
import { calculateQuestionScore } from "../utils/examUtils";
import QuizInterface from "./QuizInterface";
import ResultsSummary from "./ResultsSummary";

interface QuizFlowProps {
  examData: ExamData;
  onNewExam: () => void;
  onBackToExamSelection: () => void;
}

export default function QuizFlow({
  examData,
  onNewExam,
  onBackToExamSelection,
}: QuizFlowProps) {
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    answers: {},
    isCompleted: false,
    startTime: Date.now(),
  });
  const [result, setResult] = useState<ExamResult | null>(null);
  const [currentState, setCurrentState] = useState<"quiz" | "results">("quiz");

  const handleAnswerSelect = (
    questionId: number,
    answer: string | string[]
  ) => {
    const newAnswers: { [questionId: number]: string | string[] } = {
      ...quizState.answers,
      [questionId]: answer,
    };
    const updatedState: QuizState = {
      ...quizState,
      answers: newAnswers,
    };
    setQuizState(updatedState);

    // Save progress using new storage system
    saveExamProgress(examData, updatedState);
  };

  const handleNextQuestion = () => {
    if (quizState.currentQuestionIndex < examData.questions.length - 1) {
      setQuizState((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
      }));
    }
  };

  const handlePreviousQuestion = () => {
    if (quizState.currentQuestionIndex > 0) {
      setQuizState((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1,
      }));
    }
  };

  const handleQuizComplete = () => {
    const endTime = Date.now();
    const timeSpent = Math.round((endTime - quizState.startTime) / 1000 / 60); // minutes

    // Calculate results
    let correctAnswers = 0;
    const domainBreakdown: {
      [domain: string]: { correct: number; total: number; percentage: number };
    } = {};

    examData.questions.forEach((question) => {
      const userAnswer = quizState.answers[question.id];
      const isCorrect = calculateQuestionScore(question, userAnswer);
      if (isCorrect) correctAnswers++;

      if (!domainBreakdown[question.domain]) {
        domainBreakdown[question.domain] = {
          correct: 0,
          total: 0,
          percentage: 0,
        };
      }
      domainBreakdown[question.domain].total++;
      if (isCorrect) domainBreakdown[question.domain].correct++;
    });

    // Calculate percentages
    Object.keys(domainBreakdown).forEach((domain) => {
      const domainData = domainBreakdown[domain];
      domainData.percentage = Math.round(
        (domainData.correct / domainData.total) * 100
      );
    });

    const examResult: ExamResult = {
      totalQuestions: examData.questions.length,
      correctAnswers,
      score: Math.round((correctAnswers / examData.questions.length) * 100),
      domainBreakdown,
      timeSpent,
    };

    setResult(examResult);
    setQuizState((prev) => ({ ...prev, isCompleted: true, endTime }));
    setCurrentState("results");

    // Save completed state and remove from saved exams
    saveExamProgress(examData, {
      ...quizState,
      isCompleted: true,
      endTime,
    });
    // Remove completed exams from saved exams list
    removeCompletedExams();
  };

  const handleExitExam = () => {
    if (
      window.confirm(
        "Are you sure you want to exit the exam? Your progress will be saved."
      )
    ) {
      onBackToExamSelection();
    }
  };

  const handleEndExam = () => {
    if (
      window.confirm(
        "Are you sure you want to end the exam? You will see your results."
      )
    ) {
      handleQuizComplete();
    }
  };

  const handleRetry = () => {
    setQuizState({
      currentQuestionIndex: 0,
      answers: {},
      isCompleted: false,
      startTime: Date.now(),
    });
    setResult(null);
    setCurrentState("quiz");
  };

  if (currentState === "quiz") {
    return (
      <QuizInterface
        examData={examData}
        quizState={quizState}
        onAnswerSelect={handleAnswerSelect}
        onNextQuestion={handleNextQuestion}
        onPreviousQuestion={handlePreviousQuestion}
        onComplete={handleQuizComplete}
        onExitExam={handleExitExam}
        onEndExam={handleEndExam}
      />
    );
  }

  if (currentState === "results" && result) {
    return (
      <ResultsSummary
        examData={examData}
        result={result}
        userAnswers={
          quizState.answers as { [questionId: number]: string | string[] }
        }
        onRetry={handleRetry}
        onNewExam={onNewExam}
      />
    );
  }

  return null;
}
