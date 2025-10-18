import React from "react";
import { ExamData, ExamResult } from "../types/exam";

interface ResultsSummaryProps {
  examData: ExamData;
  result: ExamResult;
  userAnswers: { [questionId: number]: string | string[] };
  onRetry: () => void;
  onNewExam: () => void;
}

const ResultsSummary: React.FC<ResultsSummaryProps> = ({
  examData,
  result,
  userAnswers,
  onRetry,
  onNewExam,
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-50 border-green-200";
    if (score >= 70) return "bg-yellow-50 border-yellow-200";
    return "bg-red-50 border-red-200";
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Exam Complete!
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Here are your results for {examData.title}
        </p>
      </div>

      {/* Overall Score */}
      <div
        className={`card text-center mb-8 border-2 ${getScoreBgColor(
          result.score
        )}`}
      >
        <div className="mb-4">
          <div
            className={`text-6xl font-bold ${getScoreColor(result.score)} mb-2`}
          >
            {result.score}%
          </div>
          <p className="text-lg text-gray-600">
            {result.correctAnswers} out of {result.totalQuestions} questions
            correct
          </p>
        </div>

        <div className="flex justify-center space-x-8 text-sm text-gray-600">
          <div>
            <span className="font-medium">Time Spent:</span> {result.timeSpent}{" "}
            minutes
          </div>
          <div>
            <span className="font-medium">Accuracy:</span>{" "}
            {result.correctAnswers}/{result.totalQuestions}
          </div>
        </div>
      </div>

      {/* Domain Breakdown */}
      <div className="card mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Performance by Domain
        </h3>
        <div className="space-y-4">
          {Object.entries(result.domainBreakdown).map(([domain, data]) => (
            <div key={domain} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{domain}</h4>
                <span
                  className={`font-semibold ${
                    data.percentage >= 70 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {data.percentage}%
                </span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>
                  {data.correct}/{data.total} correct
                </span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      data.percentage >= 70 ? "bg-green-500" : "bg-red-500"
                    }`}
                    style={{ width: `${data.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Exam Information */}
      <div className="card mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Exam Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Domains Covered</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              {examData.summary.domains.map((domain, index) => (
                <li key={index}>
                  {domain.name} ({domain.percentage}%)
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Description</h4>
            <p className="text-sm text-gray-600">
              {examData.summary.description}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <button onClick={onRetry} className="btn-primary px-8 py-3">
          Retry This Exam
        </button>
        <button onClick={onNewExam} className="btn-secondary px-8 py-3">
          Choose Different Exam
        </button>
      </div>

      {/* Question Review */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
          Question Review
        </h3>
        <div className="space-y-4">
          {examData.questions.map((question) => {
            const userAnswer = userAnswers[question.id];
            const correctAnswers = question.choices
              .filter((choice) => choice.is_correct)
              .map((choice) => choice.label)
              .sort();
            const correctAnswersCount = correctAnswers.length;

            let isCorrect = false;
            if (correctAnswersCount > 1) {
              // Multiple correct answers
              const userAnswers = Array.isArray(userAnswer)
                ? userAnswer.sort()
                : [userAnswer];
              isCorrect =
                userAnswers.length === correctAnswersCount &&
                userAnswers.every(
                  (answer, index) => answer === correctAnswers[index]
                );
            } else {
              // Single correct answer
              isCorrect = userAnswer === correctAnswers[0];
            }

            return (
              <div
                key={question.id}
                className={`card ${
                  isCorrect
                    ? "border-success-200 dark:border-success-700"
                    : "border-error-200 dark:border-error-700"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                        isCorrect
                          ? "bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300"
                          : "bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-300"
                      }`}
                    >
                      {question.id}
                    </span>
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-white">
                        Question {question.id}
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {question.domain} • {question.subcategory}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      isCorrect
                        ? "bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300"
                        : "bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-300"
                    }`}
                  >
                    {isCorrect ? "Correct" : "Incorrect"}
                  </span>
                </div>

                <p className="text-slate-700 dark:text-slate-300 mb-4">
                  {question.question}
                </p>

                <div className="space-y-2">
                  {question.choices.map((choice) => {
                    const userAnswers = Array.isArray(userAnswer)
                      ? userAnswer
                      : [userAnswer];
                    const isSelected = userAnswers.includes(choice.label);

                    return (
                      <div
                        key={choice.label}
                        className={`p-3 rounded-lg border ${
                          choice.is_correct
                            ? "border-success-500 bg-success-50 dark:bg-success-900/20 text-success-800 dark:text-success-200"
                            : isSelected && !choice.is_correct
                            ? "border-error-500 bg-error-50 dark:bg-error-900/20 text-error-800 dark:text-error-200"
                            : "border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <span className="font-medium">{choice.label}.</span>
                          <div className="flex-1">
                            <p className="font-medium">{choice.text}</p>
                            <p className="text-sm mt-1 opacity-90">
                              {choice.explanation}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Study Tips */}
      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
          Study Tips
        </h4>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
          <li>• Review questions you answered incorrectly</li>
          <li>• Focus on domains where you scored below 70%</li>
          <li>• Practice with AWS hands-on labs and documentation</li>
          <li>• Take practice exams regularly to track your progress</li>
        </ul>
      </div>
    </div>
  );
};

export default ResultsSummary;
