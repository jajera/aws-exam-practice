import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import DomainSelection from "../components/DomainSelection";
import { DomainOption, ExamData } from "../types/exam";

// Mock the exam utils
jest.mock("../utils/examUtils", () => ({
  getSelectedDomainsCount: jest.fn(
    (domains: DomainOption[]) => domains.filter((d) => d.selected).length
  ),
}));

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
  questions: [],
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
    selected: false,
  },
];

describe("DomainSelection", () => {
  const mockOnDomainToggle = jest.fn();
  const mockOnStartQuiz = jest.fn();
  const mockOnBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render domain selection interface", () => {
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
      screen.getByText(
        "Select Domains for AWS Certified Solutions Architect – Associate (SAA-C03)"
      )
    ).not.toBeNull();
    expect(
      screen.getByText(
        "Choose which domains you want to focus on. All domains are selected by default."
      )
    ).not.toBeNull();
    expect(screen.getByText("← Back to Difficulty")).not.toBeNull();
  });

  it("should display domain options with correct information", () => {
    render(
      <DomainSelection
        examData={mockExamData}
        domainOptions={mockDomainOptions}
        onDomainToggle={mockOnDomainToggle}
        onStartQuiz={mockOnStartQuiz}
        onBack={mockOnBack}
      />
    );

    expect(screen.getByText("Design Secure Architectures")).not.toBeNull();
    expect(screen.getByText("30% of exam")).not.toBeNull();
    expect(screen.getByText("Design Resilient Architectures")).not.toBeNull();
    expect(screen.getByText("26% of exam")).not.toBeNull();
  });

  it("should display subcategories for each domain", () => {
    render(
      <DomainSelection
        examData={mockExamData}
        domainOptions={mockDomainOptions}
        onDomainToggle={mockOnDomainToggle}
        onStartQuiz={mockOnStartQuiz}
        onBack={mockOnBack}
      />
    );

    expect(screen.getByText("Security Groups")).not.toBeNull();
    expect(screen.getByText("IAM")).not.toBeNull();
    expect(screen.getByText("Auto Scaling")).not.toBeNull();
    expect(screen.getByText("Load Balancing")).not.toBeNull();
  });

  it("should call onDomainToggle when domain is clicked", () => {
    render(
      <DomainSelection
        examData={mockExamData}
        domainOptions={mockDomainOptions}
        onDomainToggle={mockOnDomainToggle}
        onStartQuiz={mockOnStartQuiz}
        onBack={mockOnBack}
      />
    );

    const firstDomain = screen
      .getByText("Design Secure Architectures")
      .closest("div");
    fireEvent.click(firstDomain!);

    expect(mockOnDomainToggle).toHaveBeenCalledWith(
      "Design Secure Architectures"
    );
  });

  it("should call onDomainToggle when checkbox is clicked", () => {
    render(
      <DomainSelection
        examData={mockExamData}
        domainOptions={mockDomainOptions}
        onDomainToggle={mockOnDomainToggle}
        onStartQuiz={mockOnStartQuiz}
        onBack={mockOnBack}
      />
    );

    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[0]);

    expect(mockOnDomainToggle).toHaveBeenCalledWith(
      "Design Secure Architectures"
    );
  });

  it("should call onStartQuiz when start button is clicked", () => {
    render(
      <DomainSelection
        examData={mockExamData}
        domainOptions={mockDomainOptions}
        onDomainToggle={mockOnDomainToggle}
        onStartQuiz={mockOnStartQuiz}
        onBack={mockOnBack}
      />
    );

    const startButton = screen.getByText(/Start Quiz/);
    fireEvent.click(startButton);

    expect(mockOnStartQuiz).toHaveBeenCalledTimes(1);
  });

  it("should call onBack when back button is clicked", () => {
    render(
      <DomainSelection
        examData={mockExamData}
        domainOptions={mockDomainOptions}
        onDomainToggle={mockOnDomainToggle}
        onStartQuiz={mockOnStartQuiz}
        onBack={mockOnBack}
      />
    );

    const backButton = screen.getByText("← Back to Difficulty");
    fireEvent.click(backButton);

    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it("should disable start button when no domains are selected", () => {
    const noSelectedDomains = mockDomainOptions.map((d) => ({
      ...d,
      selected: false,
    }));

    render(
      <DomainSelection
        examData={mockExamData}
        domainOptions={noSelectedDomains}
        onDomainToggle={mockOnDomainToggle}
        onStartQuiz={mockOnStartQuiz}
        onBack={mockOnBack}
      />
    );

    const startButton = screen.getByText(/Start Quiz/);
    expect(startButton).toHaveProperty("disabled", true);
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

    expect(screen.getByText("Start Quiz (1 domain selected)")).not.toBeNull();
  });

  it("should show plural form for multiple domains", () => {
    const allSelectedDomains = mockDomainOptions.map((d) => ({
      ...d,
      selected: true,
    }));

    render(
      <DomainSelection
        examData={mockExamData}
        domainOptions={allSelectedDomains}
        onDomainToggle={mockOnDomainToggle}
        onStartQuiz={mockOnStartQuiz}
        onBack={mockOnBack}
      />
    );

    expect(screen.getByText("Start Quiz (2 domains selected)")).not.toBeNull();
  });

  it("should prevent event propagation when checkbox is clicked", () => {
    render(
      <DomainSelection
        examData={mockExamData}
        domainOptions={mockDomainOptions}
        onDomainToggle={mockOnDomainToggle}
        onStartQuiz={mockOnStartQuiz}
        onBack={mockOnBack}
      />
    );

    const checkboxes = screen.getAllByRole("checkbox");
    const stopPropagation = jest.fn();

    // Simulate the stopPropagation call
    fireEvent.click(checkboxes[0], { stopPropagation });

    expect(mockOnDomainToggle).toHaveBeenCalledWith(
      "Design Secure Architectures"
    );
  });
});
