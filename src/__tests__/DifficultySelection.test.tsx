import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import DifficultySelection from "../components/DifficultySelection";
import { ExamData } from "../types/exam";

// Mock the exam config
jest.mock("../config/examConfig", () => ({
  generateExamConfig: jest.fn((exam: ExamData) => ({
    displayName: `${exam.title} - ${exam.summary.difficulty}`,
    description: `Practice questions for ${exam.title}`,
    order: exam.questions.length,
    colorScheme: {
      primary: "bg-blue-50 border-blue-200",
      questionTag: "bg-blue-100 text-blue-800",
      domainTag: "bg-green-100 text-green-800",
    },
    icon: "📚",
  })),
}));

const mockExamData: ExamData[] = [
  {
    examId: "saa-c03-basic",
    title: "AWS Certified Solutions Architect – Associate (SAA-C03)",
    summary: {
      description: "Basic level practice questions",
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
    ],
  },
  {
    examId: "saa-c03-advanced",
    title: "AWS Certified Solutions Architect – Associate (SAA-C03)",
    summary: {
      description: "Advanced level practice questions",
      difficulty: "Advanced",
      domains: [
        {
          name: "Design Resilient Architectures",
          percentage: 26,
          subcategories: ["Auto Scaling", "Load Balancing"],
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: "What is another question?",
        type: "single-choice" as const,
        domain: "Design Resilient Architectures",
        subcategory: "Auto Scaling",
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
      {
        id: 2,
        question: "What is a third question?",
        type: "single-choice" as const,
        domain: "Design Resilient Architectures",
        subcategory: "Load Balancing",
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
    ],
  },
];

describe("DifficultySelection", () => {
  const mockOnDifficultySelect = jest.fn();
  const mockOnBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render difficulty selection interface", () => {
    render(
      <DifficultySelection
        availableExams={mockExamData}
        onDifficultySelect={mockOnDifficultySelect}
        onBack={mockOnBack}
      />
    );

    expect(screen.getByText("Select Difficulty Level")).not.toBeNull();
    expect(
      screen.getByText("Choose the difficulty level for your practice exam.")
    ).not.toBeNull();
    expect(screen.getByText("← Back to Exams")).not.toBeNull();
  });

  it("should display available exams with correct information", () => {
    render(
      <DifficultySelection
        availableExams={mockExamData}
        onDifficultySelect={mockOnDifficultySelect}
        onBack={mockOnBack}
      />
    );

    // Check first exam
    expect(
      screen.getByText(
        "AWS Certified Solutions Architect – Associate (SAA-C03) - Basic"
      )
    ).not.toBeNull();
    expect(
      screen.getAllByText(
        "Practice questions for AWS Certified Solutions Architect – Associate (SAA-C03)"
      )
    ).toHaveLength(2);
    expect(screen.getByText("1 Questions")).not.toBeNull();
    expect(screen.getAllByText("1 Domain")).toHaveLength(2);

    // Check second exam
    expect(
      screen.getByText(
        "AWS Certified Solutions Architect – Associate (SAA-C03) - Advanced"
      )
    ).not.toBeNull();
    expect(screen.getByText("2 Questions")).not.toBeNull();
  });

  it("should call onDifficultySelect when exam is clicked", () => {
    render(
      <DifficultySelection
        availableExams={mockExamData}
        onDifficultySelect={mockOnDifficultySelect}
        onBack={mockOnBack}
      />
    );

    const firstExam = screen
      .getByText(
        "AWS Certified Solutions Architect – Associate (SAA-C03) - Basic"
      )
      .closest("div");
    fireEvent.click(firstExam!);

    expect(mockOnDifficultySelect).toHaveBeenCalledWith("saa-c03-basic");
  });

  it("should call onBack when back button is clicked", () => {
    render(
      <DifficultySelection
        availableExams={mockExamData}
        onDifficultySelect={mockOnDifficultySelect}
        onBack={mockOnBack}
      />
    );

    const backButton = screen.getByText("← Back to Exams");
    fireEvent.click(backButton);

    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it("should sort exams by question count", () => {
    render(
      <DifficultySelection
        availableExams={mockExamData}
        onDifficultySelect={mockOnDifficultySelect}
        onBack={mockOnBack}
      />
    );

    const examCards = screen.getAllByText(/Questions/);
    expect(examCards[0].textContent).toBe("1 Questions");
    expect(examCards[1].textContent).toBe("2 Questions");
  });

  it("should display icons when available", () => {
    render(
      <DifficultySelection
        availableExams={mockExamData}
        onDifficultySelect={mockOnDifficultySelect}
        onBack={mockOnBack}
      />
    );

    const icons = screen.getAllByText("📚");
    expect(icons).toHaveLength(2);
  });

  it("should handle empty exams array", () => {
    render(
      <DifficultySelection
        availableExams={[]}
        onDifficultySelect={mockOnDifficultySelect}
        onBack={mockOnBack}
      />
    );

    expect(screen.getByText("Select Difficulty Level")).not.toBeNull();
    expect(screen.queryByText(/Questions/)).toBeNull();
  });
});
