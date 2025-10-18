import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import ResultsSummary from "../components/ResultsSummary";
import { ExamData, ExamResult } from "../types/exam";

// Mock window.confirm
const mockConfirm = jest.fn();
Object.defineProperty(window, "confirm", {
  value: mockConfirm,
});

const mockExamData: ExamData = {
  examId: "test-exam",
  title: "Test Exam",
  summary: {
    description: "Test exam description",
    domains: [
      {
        name: "Domain 1",
        percentage: 50,
        subcategories: ["Subcategory 1"],
      },
      {
        name: "Domain 2",
        percentage: 50,
        subcategories: ["Subcategory 2"],
      },
    ],
  },
  questions: [
    {
      id: 1,
      question: "Test question 1?",
      type: "single-choice",
      domain: "Domain 1",
      subcategory: "Subcategory 1",
      choices: [
        {
          label: "A",
          text: "Option A",
          explanation: "Explanation A",
          is_correct: true,
        },
        {
          label: "B",
          text: "Option B",
          explanation: "Explanation B",
          is_correct: false,
        },
      ],
    },
    {
      id: 2,
      question: "Test question 2?",
      type: "single-choice",
      domain: "Domain 2",
      subcategory: "Subcategory 2",
      choices: [
        {
          label: "A",
          text: "Option A",
          explanation: "Explanation A",
          is_correct: false,
        },
        {
          label: "B",
          text: "Option B",
          explanation: "Explanation B",
          is_correct: true,
        },
      ],
    },
  ],
};

const mockResult: ExamResult = {
  totalQuestions: 2,
  correctAnswers: 1,
  score: 50,
  domainBreakdown: {
    "Domain 1": {
      correct: 1,
      total: 1,
      percentage: 100,
    },
    "Domain 2": {
      correct: 0,
      total: 1,
      percentage: 0,
    },
  },
  timeSpent: 5,
};

const mockUserAnswers = {
  1: "A",
  2: "A",
};

const mockOnRetry = jest.fn();
const mockOnNewExam = jest.fn();

describe("ResultsSummary", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render results summary", () => {
    render(
      <ResultsSummary
        examData={mockExamData}
        result={mockResult}
        userAnswers={mockUserAnswers}
        onRetry={mockOnRetry}
        onNewExam={mockOnNewExam}
      />
    );

    expect(screen.getByText("Exam Complete!")).not.toBeNull();
    expect(screen.getByText("50%")).not.toBeNull();
    expect(screen.getByText("1 out of 2 questions correct")).not.toBeNull();
    expect(screen.getByText("5 minutes")).not.toBeNull();
  });

  it("should display domain breakdown", () => {
    render(
      <ResultsSummary
        examData={mockExamData}
        result={mockResult}
        userAnswers={mockUserAnswers}
        onRetry={mockOnRetry}
        onNewExam={mockOnNewExam}
      />
    );

    expect(screen.getByText("Domain 1")).not.toBeNull();
    expect(screen.getByText("100%")).not.toBeNull();
    expect(screen.getByText("Domain 2")).not.toBeNull();
    expect(screen.getByText("0%")).not.toBeNull();
  });

  it("should call onRetry when retry button is clicked", () => {
    render(
      <ResultsSummary
        examData={mockExamData}
        result={mockResult}
        userAnswers={mockUserAnswers}
        onRetry={mockOnRetry}
        onNewExam={mockOnNewExam}
      />
    );

    const retryButton = screen.getByText("Retry This Exam");
    fireEvent.click(retryButton);

    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });

  it("should call onNewExam when new exam button is clicked", () => {
    render(
      <ResultsSummary
        examData={mockExamData}
        result={mockResult}
        userAnswers={mockUserAnswers}
        onRetry={mockOnRetry}
        onNewExam={mockOnNewExam}
      />
    );

    const newExamButton = screen.getByText("Choose Different Exam");
    fireEvent.click(newExamButton);

    expect(mockOnNewExam).toHaveBeenCalledTimes(1);
  });

  it("should display question review section", () => {
    render(
      <ResultsSummary
        examData={mockExamData}
        result={mockResult}
        userAnswers={mockUserAnswers}
        onRetry={mockOnRetry}
        onNewExam={mockOnNewExam}
      />
    );

    expect(screen.getByText("Question Review")).not.toBeNull();
    expect(screen.getByText("Test question 1?")).not.toBeNull();
    expect(screen.getByText("Test question 2?")).not.toBeNull();
  });

  it("should show correct/incorrect indicators", () => {
    render(
      <ResultsSummary
        examData={mockExamData}
        result={mockResult}
        userAnswers={mockUserAnswers}
        onRetry={mockOnRetry}
        onNewExam={mockOnNewExam}
      />
    );

    // First question should be correct (user answered A, which is correct)
    const firstQuestion = screen.getByText("Test question 1?");
    const firstQuestionContainer = firstQuestion.closest("div");
    expect(firstQuestionContainer?.textContent).toContain("Correct");

    // Second question should be incorrect (user answered A, but B is correct)
    const secondQuestion = screen.getByText("Test question 2?");
    const secondQuestionContainer = secondQuestion.closest("div");
    expect(secondQuestionContainer?.textContent).toContain("Incorrect");
  });

  it("should display explanations for all choices", () => {
    render(
      <ResultsSummary
        examData={mockExamData}
        result={mockResult}
        userAnswers={mockUserAnswers}
        onRetry={mockOnRetry}
        onNewExam={mockOnNewExam}
      />
    );

    // Explanations should be visible for all choices
    const explanationsA = screen.getAllByText("Explanation A");
    const explanationsB = screen.getAllByText("Explanation B");
    expect(explanationsA).toHaveLength(2); // One for each question
    expect(explanationsB).toHaveLength(2); // One for each question
  });
});
