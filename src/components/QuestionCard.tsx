import React from "react";
import { Question } from "../types/exam";

interface QuestionCardProps {
  question: Question;
  selectedAnswer?: string | string[];
  onAnswerSelect: (answer: string | string[]) => void;
  showExplanations: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedAnswer,
  onAnswerSelect,
  showExplanations,
}) => {
  const correctAnswersCount = question.choices.filter(
    (choice) => choice.is_correct
  ).length;
  const isMultipleChoice = correctAnswersCount > 1;
  const selectedAnswers = Array.isArray(selectedAnswer)
    ? selectedAnswer
    : selectedAnswer
    ? [selectedAnswer]
    : [];

  const handleAnswerSelect = (choiceLabel: string) => {
    if (isMultipleChoice) {
      const currentAnswers = Array.isArray(selectedAnswer)
        ? selectedAnswer
        : selectedAnswer
        ? [selectedAnswer]
        : [];

      if (currentAnswers.includes(choiceLabel)) {
        // Remove if already selected
        const newAnswers = currentAnswers.filter(
          (answer) => answer !== choiceLabel
        );
        onAnswerSelect(newAnswers);
      } else if (currentAnswers.length < correctAnswersCount) {
        // Add if under the limit
        const newAnswers = [...currentAnswers, choiceLabel];
        onAnswerSelect(newAnswers);
      }
      // If at limit and trying to add new answer, do nothing
    } else {
      onAnswerSelect(choiceLabel);
    }
  };

  const getChoiceClassName = (choice: any) => {
    if (!showExplanations) {
      const isSelected = isMultipleChoice
        ? selectedAnswers.includes(choice.label)
        : selectedAnswer === choice.label;

      const isAtLimit =
        isMultipleChoice && selectedAnswers.length >= correctAnswersCount;
      const isDisabled = isAtLimit && !isSelected;

      return `choice-neutral ${
        isSelected
          ? "border-primary-600 bg-primary-200 dark:bg-primary-700 text-primary-900 dark:text-primary-100"
          : isDisabled
          ? "opacity-50 cursor-not-allowed"
          : ""
      }`;
    }

    if (choice.is_correct) {
      return "choice-correct";
    }

    const isSelected = isMultipleChoice
      ? selectedAnswers.includes(choice.label)
      : selectedAnswer === choice.label;

    if (isSelected && !choice.is_correct) {
      return "choice-incorrect";
    }

    return "choice-neutral";
  };

  return (
    <div className="card">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-primary-700 dark:text-primary-300 bg-primary-100 dark:bg-primary-900/30 px-4 py-2 rounded-full border border-primary-200 dark:border-primary-700">
            Question {question.id}
          </span>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            <span className="font-medium">{question.domain}</span>
            {question.subcategory && (
              <span className="ml-2">• {question.subcategory}</span>
            )}
          </div>
        </div>

        <h3 className="text-lg font-medium text-slate-900 dark:text-white leading-relaxed">
          {question.question}
        </h3>
        {isMultipleChoice && (
          <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Select {correctAnswersCount} answer
            {correctAnswersCount > 1 ? "s" : ""} ({selectedAnswers.length}/
            {correctAnswersCount} selected)
          </div>
        )}
      </div>

      <div className="space-y-3">
        {question.choices.map((choice) => (
          <div key={choice.label}>
            <button
              onClick={() => handleAnswerSelect(choice.label)}
              disabled={
                showExplanations ||
                (isMultipleChoice &&
                  selectedAnswers.length >= correctAnswersCount &&
                  !selectedAnswers.includes(choice.label))
              }
              className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                showExplanations
                  ? "cursor-default"
                  : "cursor-pointer hover:shadow-md"
              } ${getChoiceClassName(choice)}`}
            >
              <div className="flex items-start space-x-4">
                {isMultipleChoice ? (
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                    <div
                      className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                        selectedAnswers.includes(choice.label)
                          ? "border-primary-600 bg-primary-600 shadow-md"
                          : "border-slate-300 dark:border-slate-600"
                      }`}
                    >
                      {selectedAnswers.includes(choice.label) && (
                        <svg
                          className="w-4 h-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                ) : (
                  <span
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm border-2 ${
                      selectedAnswer === choice.label
                        ? "bg-primary-600 border-primary-600 text-white shadow-md"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600"
                    }`}
                  >
                    {choice.label}
                  </span>
                )}
                <div className="flex-1">
                  <p className="font-medium text-slate-900 dark:text-white leading-relaxed">
                    {choice.text}
                  </p>
                  {showExplanations && (
                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border-l-4 border-primary-300 dark:border-primary-600">
                      {choice.explanation}
                    </p>
                  )}
                </div>
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
