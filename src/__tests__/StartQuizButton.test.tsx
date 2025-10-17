import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import DomainSelection from "../components/DomainSelection";
import { DomainOption, ExamData } from "../types/exam";

describe("Start Quiz Button", () => {
  const mockOnDomainToggle = jest.fn();
  const mockOnStartQuiz = jest.fn();
  const mockOnBack = jest.fn();

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
  };

  const mockDomainOptions: DomainOption[] = [
    {
      name: "Design Secure Architectures",
      percentage: 30,
      subcategories: ["Security Groups", "IAM"],
      selected: true,
    },
    {
      name: "Design Resilient Architectures",
      percentage: 26,
      subcategories: ["Auto Scaling", "Load Balancing"],
      selected: true,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call onStartQuiz when Start Quiz button is clicked", () => {
    render(
      <DomainSelection
        examData={mockExamData}
        domainOptions={mockDomainOptions}
        onDomainToggle={mockOnDomainToggle}
        onStartQuiz={mockOnStartQuiz}
        onBack={mockOnBack}
      />
    );

    const startQuizButton = screen.getByText("Start Quiz (2 domains selected)");
    fireEvent.click(startQuizButton);

    expect(mockOnStartQuiz).toHaveBeenCalledTimes(1);
  });

  it("should disable start button when no domains are selected", () => {
    const noSelectedDomains: DomainOption[] = mockDomainOptions.map(
      (domain) => ({
        ...domain,
        selected: false,
      })
    );

    render(
      <DomainSelection
        examData={mockExamData}
        domainOptions={noSelectedDomains}
        onDomainToggle={mockOnDomainToggle}
        onStartQuiz={mockOnStartQuiz}
        onBack={mockOnBack}
      />
    );

    const startQuizButton = screen.getByText("Start Quiz (0 domains selected)");
    expect(startQuizButton).toBeDisabled();
  });

  it("should show correct count of selected domains", () => {
    render(
      <DomainSelection
        examData={mockExamData}
        domainOptions={mockDomainOptions}
        onDomainToggle={mockOnDomainToggle}
        onStartQuiz={mockOnStartQuiz}
        onBack={mockOnBack}
      />
    );

    expect(
      screen.getByText("Start Quiz (2 domains selected)")
    ).toBeInTheDocument();
  });
});
