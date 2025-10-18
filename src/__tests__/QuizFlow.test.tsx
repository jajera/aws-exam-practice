import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import QuizFlow from "../components/QuizFlow";
import { AppSettings, ExamData } from "../types/exam";

// Mock the exam storage
jest.mock("../utils/examStorage", () => ({
  saveExamProgress: jest.fn(),
  removeCompletedExams: jest.fn(),
  getSavedExams: jest.fn(() => []),
}));

// Mock window.confirm
global.confirm = jest.fn() as jest.MockedFunction<typeof confirm>;

const mockSettings: AppSettings = {
  theme: "light",
  randomizeQuestions: false,
  randomizeChoices: false,
  narratorEnabled: false,
  narratorVoice: "",
  narratorRate: 1.0,
  narratorPitch: 1.0,
};

const mockExamData: ExamData = {
  examId: "saa-c03",
  title: "AWS Certified Solutions Architect – Associate (SAA-C03)",
  summary: {
    description: "Test exam",
    difficulty: "Basic",
    domains: [
      {
        name: "Design Secure Architectures",
        percentage: 30,
        subcategories: ["Security Groups", "IAM"],
      },
    ],
  },
  questions: [
    {
      id: 1,
      question: "What is the correct answer?",
      type: "single-choice" as const,
      domain: "Design Secure Architectures",
      subcategory: "Security Groups",
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
      question: "What is another question?",
      type: "single-choice" as const,
      domain: "Design Secure Architectures",
      subcategory: "IAM",
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

describe("QuizFlow", () => {
  const mockOnNewExam = jest.fn();
  const mockOnBackToExamSelection = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (global.confirm as jest.Mock).mockReturnValue(true);
  });

  it("should render quiz interface initially", () => {
    render(
      <QuizFlow
        examData={mockExamData}
        onNewExam={mockOnNewExam}
        onBackToExamSelection={mockOnBackToExamSelection}
        settings={mockSettings}
      />
    );

    expect(screen.getByText("Question 1 of 2")).not.toBeNull();
    expect(screen.getByText("What is the correct answer?")).not.toBeNull();
  });

  it("should handle answer selection", () => {
    render(
      <QuizFlow
        examData={mockExamData}
        onNewExam={mockOnNewExam}
        onBackToExamSelection={mockOnBackToExamSelection}
        settings={mockSettings}
      />
    );

    const answerButton = screen.getByText("Option A");
    fireEvent.click(answerButton);

    expect(screen.getByText("Next Question")).not.toBeNull();
  });

  it("should handle next question navigation", () => {
    render(
      <QuizFlow
        examData={mockExamData}
        onNewExam={mockOnNewExam}
        onBackToExamSelection={mockOnBackToExamSelection}
        settings={mockSettings}
      />
    );

    // Answer first question
    const answerButton = screen.getByText("Option A");
    fireEvent.click(answerButton);

    const nextButton = screen.getByText("Next Question");
    fireEvent.click(nextButton);

    expect(screen.getByText("Question 2 of 2")).not.toBeNull();
    expect(screen.getByText("What is another question?")).not.toBeNull();
  });

  it("should handle previous question navigation", () => {
    render(
      <QuizFlow
        examData={mockExamData}
        onNewExam={mockOnNewExam}
        onBackToExamSelection={mockOnBackToExamSelection}
        settings={mockSettings}
      />
    );

    // Answer first question and go to next
    const answerButton = screen.getByText("Option A");
    fireEvent.click(answerButton);

    const nextButton = screen.getByText("Next Question");
    fireEvent.click(nextButton);

    // Go back to previous question
    const prevButton = screen.getByText("Previous");
    fireEvent.click(prevButton);

    expect(screen.getByText("Question 1 of 2")).not.toBeNull();
    expect(screen.getByText("What is the correct answer?")).not.toBeNull();
  });

  it("should complete quiz and show results", async () => {
    render(
      <QuizFlow
        examData={mockExamData}
        onNewExam={mockOnNewExam}
        onBackToExamSelection={mockOnBackToExamSelection}
        settings={mockSettings}
      />
    );

    // Answer first question
    const answerButton1 = screen.getByText("Option A");
    fireEvent.click(answerButton1);

    const nextButton1 = screen.getByText("Next Question");
    fireEvent.click(nextButton1);

    // Answer second question
    const answerButton2 = screen.getByText("Option B");
    fireEvent.click(answerButton2);

    const nextButton2 = screen.getByText("Complete Exam");
    fireEvent.click(nextButton2);

    // Should show results
    await waitFor(() => {
      expect(screen.getByText("Exam Complete!")).not.toBeNull();
    });
  });

  it("should handle exit exam with confirmation", () => {
    render(
      <QuizFlow
        examData={mockExamData}
        onNewExam={mockOnNewExam}
        onBackToExamSelection={mockOnBackToExamSelection}
        settings={mockSettings}
      />
    );

    const exitButton = screen.getByText("Exit Exam");
    fireEvent.click(exitButton);

    expect(global.confirm).toHaveBeenCalledWith(
      "Are you sure you want to exit the exam? Your progress will be saved."
    );
    expect(mockOnBackToExamSelection).toHaveBeenCalledTimes(1);
  });

  it("should not exit exam when confirmation is cancelled", () => {
    (global.confirm as jest.Mock).mockReturnValue(false);

    render(
      <QuizFlow
        examData={mockExamData}
        onNewExam={mockOnNewExam}
        onBackToExamSelection={mockOnBackToExamSelection}
        settings={mockSettings}
      />
    );

    const exitButton = screen.getByText("Exit Exam");
    fireEvent.click(exitButton);

    expect(global.confirm).toHaveBeenCalledWith(
      "Are you sure you want to exit the exam? Your progress will be saved."
    );
    expect(mockOnBackToExamSelection).not.toHaveBeenCalled();
  });

  it("should handle end exam with confirmation", async () => {
    render(
      <QuizFlow
        examData={mockExamData}
        onNewExam={mockOnNewExam}
        onBackToExamSelection={mockOnBackToExamSelection}
        settings={mockSettings}
      />
    );

    const endButton = screen.getByText("End Exam");
    fireEvent.click(endButton);

    expect(global.confirm).toHaveBeenCalledWith(
      "Are you sure you want to end the exam and view your results? Any unanswered questions will be marked as incorrect."
    );

    // Should show results
    await waitFor(() => {
      expect(screen.getByText("Exam Complete!")).not.toBeNull();
    });
  });

  it("should not end exam when confirmation is cancelled", () => {
    (global.confirm as jest.Mock).mockReturnValue(false);

    render(
      <QuizFlow
        examData={mockExamData}
        onNewExam={mockOnNewExam}
        onBackToExamSelection={mockOnBackToExamSelection}
        settings={mockSettings}
      />
    );

    const endButton = screen.getByText("End Exam");
    fireEvent.click(endButton);

    expect(global.confirm).toHaveBeenCalledWith(
      "Are you sure you want to end the exam and view your results? Any unanswered questions will be marked as incorrect."
    );
    expect(screen.getByText("Question 1 of 2")).not.toBeNull();
  });

  it("should handle retry exam", async () => {
    render(
      <QuizFlow
        examData={mockExamData}
        onNewExam={mockOnNewExam}
        onBackToExamSelection={mockOnBackToExamSelection}
        settings={mockSettings}
      />
    );

    // Complete quiz first
    const answerButton1 = screen.getByText("Option A");
    fireEvent.click(answerButton1);

    const nextButton1 = screen.getByText("Next Question");
    fireEvent.click(nextButton1);

    const answerButton2 = screen.getByText("Option B");
    fireEvent.click(answerButton2);

    const nextButton2 = screen.getByText("Complete Exam");
    fireEvent.click(nextButton2);

    // Wait for results
    await waitFor(() => {
      expect(screen.getByText("Exam Complete!")).not.toBeNull();
    });

    // Click retry
    const retryButton = screen.getByText("Retry This Exam");
    fireEvent.click(retryButton);

    // Should start quiz again
    expect(screen.getByText("Question 1 of 2")).not.toBeNull();
  });

  it("should handle new exam", async () => {
    render(
      <QuizFlow
        examData={mockExamData}
        onNewExam={mockOnNewExam}
        onBackToExamSelection={mockOnBackToExamSelection}
        settings={mockSettings}
      />
    );

    // Complete quiz first
    const answerButton1 = screen.getByText("Option A");
    fireEvent.click(answerButton1);

    const nextButton1 = screen.getByText("Next Question");
    fireEvent.click(nextButton1);

    const answerButton2 = screen.getByText("Option B");
    fireEvent.click(answerButton2);

    const nextButton2 = screen.getByText("Complete Exam");
    fireEvent.click(nextButton2);

    // Wait for results
    await waitFor(() => {
      expect(screen.getByText("Exam Complete!")).not.toBeNull();
    });

    // Click new exam
    const newExamButton = screen.getByText("Choose Different Exam");
    fireEvent.click(newExamButton);

    expect(mockOnNewExam).toHaveBeenCalledTimes(1);
  });
});
