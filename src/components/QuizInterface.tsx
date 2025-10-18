import { useState } from "react";
import { ExamData, QuizState, AppSettings } from "../types/exam";
import QuestionCard from "./QuestionCard";

interface QuizInterfaceProps {
  examData: ExamData;
  quizState: QuizState;
  onAnswerSelect: (questionId: number, answer: string | string[]) => void;
  onNextQuestion: () => void;
  onPreviousQuestion: () => void;
  onComplete: () => void;
  onExitExam: () => void;
  onEndExam: () => void;
  settings: AppSettings;
}

const QuizInterface: React.FC<QuizInterfaceProps> = ({
  examData,
  quizState,
  onAnswerSelect,
  onNextQuestion,
  onPreviousQuestion,
  onComplete,
  onExitExam,
  onEndExam,
  settings,
}) => {
  const [showExplanations, setShowExplanations] = useState(false);
  const currentQuestion = examData.questions[quizState.currentQuestionIndex];
  const selectedAnswer = quizState.answers[currentQuestion.id];
  const totalQuestions = examData.questions.length;
  const answeredQuestions = Object.keys(quizState.answers).length;
  const progressPercentage = (answeredQuestions / totalQuestions) * 100;

  // Calculate which domains are actually included in this quiz
  const includedDomains = examData.summary.domains.filter((domain) =>
    examData.questions.some((question) => question.domain === domain.name)
  );

  const handleAnswerSelect = (answer: string | string[]) => {
    onAnswerSelect(currentQuestion.id, answer);
    // Don't show explanations immediately - wait for user to click "Show Answer"
  };

  const handleNext = () => {
    if (quizState.currentQuestionIndex === totalQuestions - 1) {
      onComplete();
    } else {
      setShowExplanations(false);
      onNextQuestion();
    }
  };

  const handlePrevious = () => {
    setShowExplanations(false);
    onPreviousQuestion();
  };

  const handleShowAnswer = () => {
    setShowExplanations(true);
  };

  const handleEndExam = () => {
    if (
      confirm(
        "Are you sure you want to end the exam and view your results? Any unanswered questions will be marked as incorrect."
      )
    ) {
      onEndExam();
    }
  };

  const isLastQuestion = quizState.currentQuestionIndex === totalQuestions - 1;
  const hasAnswered = !!selectedAnswer;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header with progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
            {examData.title}
          </h2>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Question {quizState.currentQuestionIndex + 1} of {totalQuestions}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-300 shadow-sm"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mt-2">
          <span>{answeredQuestions} answered</span>
          <span>{totalQuestions - answeredQuestions} remaining</span>
        </div>
      </div>

      {/* Question card */}
      <div className="mb-8">
        <QuestionCard
          question={currentQuestion}
          selectedAnswer={selectedAnswer}
          onAnswerSelect={handleAnswerSelect}
          showExplanations={showExplanations}
          settings={settings}
        />
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-3">
          <button
            onClick={handlePrevious}
            disabled={quizState.currentQuestionIndex === 0}
            className={`btn-secondary ${
              quizState.currentQuestionIndex === 0
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            Previous
          </button>

          <button
            onClick={onExitExam}
            className="px-4 py-3 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-200"
          >
            Exit Exam
          </button>

          <button
            onClick={handleEndExam}
            className="px-4 py-3 text-white bg-red-600 hover:bg-red-700 font-medium border border-red-600 rounded-lg transition-colors duration-200"
          >
            End Exam
          </button>
        </div>

        <div className="flex space-x-4">
          {hasAnswered && !showExplanations && (
            <button onClick={handleShowAnswer} className="btn-secondary">
              Show Answer
            </button>
          )}

          {hasAnswered && (
            <button onClick={handleNext} className="btn-primary">
              {isLastQuestion ? "Complete Exam" : "Next Question"}
            </button>
          )}
        </div>
      </div>

      {/* Domain info */}
      <div className="mt-8 p-6 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-xl border border-primary-200 dark:border-primary-700">
        <h4 className="font-semibold text-primary-900 dark:text-primary-100 mb-3">
          {includedDomains.length === 1 ? "Exam Domain" : "Exam Domains"}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          {includedDomains.map((domain, index) => (
            <div
              key={index}
              className="text-primary-800 dark:text-primary-200 bg-white/50 dark:bg-slate-800/50 px-3 py-2 rounded-lg"
            >
              <span className="font-medium">{domain.name}</span>
              <span className="ml-2 text-primary-600 dark:text-primary-300 font-semibold">
                ({domain.percentage}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizInterface;
