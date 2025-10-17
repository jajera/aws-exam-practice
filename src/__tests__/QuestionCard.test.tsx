import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import QuestionCard from "../components/QuestionCard";
import { Question } from "../types/exam";

// Mock question data
const mockQuestion: Question = {
  id: 1,
  question: "What is the best AWS service for storing files?",
  type: "single-choice",
  domain: "Storage",
  subcategory: "Object Storage",
  choices: [
    {
      label: "A",
      text: "Amazon S3",
      explanation: "S3 is perfect for object storage",
      is_correct: true,
    },
    {
      label: "B",
      text: "Amazon EBS",
      explanation: "EBS is for block storage",
      is_correct: false,
    },
    {
      label: "C",
      text: "Amazon EFS",
      explanation: "EFS is for file storage",
      is_correct: false,
    },
    {
      label: "D",
      text: "Amazon RDS",
      explanation: "RDS is for databases",
      is_correct: false,
    },
  ],
};

const mockMultipleChoiceQuestion: Question = {
  id: 2,
  question: "Which AWS services are used for compute? (Select TWO)",
  type: "multiple-choice",
  domain: "Compute",
  subcategory: "EC2",
  choices: [
    {
      label: "A",
      text: "Amazon EC2",
      explanation: "EC2 provides virtual servers",
      is_correct: true,
    },
    {
      label: "B",
      text: "Amazon Lambda",
      explanation: "Lambda provides serverless compute",
      is_correct: true,
    },
    {
      label: "C",
      text: "Amazon S3",
      explanation: "S3 is for storage",
      is_correct: false,
    },
    {
      label: "D",
      text: "Amazon RDS",
      explanation: "RDS is for databases",
      is_correct: false,
    },
  ],
};

describe("QuestionCard", () => {
  const mockOnAnswerSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Single Choice Questions", () => {
    it("should render single choice question with radio buttons", () => {
      render(
        <QuestionCard
          question={mockQuestion}
          onAnswerSelect={mockOnAnswerSelect}
          showExplanations={false}
        />
      );

      expect(
        screen.getByText("What is the best AWS service for storing files?")
      ).toBeInTheDocument();
      expect(screen.getByText("Amazon S3")).toBeInTheDocument();
      expect(screen.getByText("Amazon EBS")).toBeInTheDocument();
      expect(screen.getByText("Amazon EFS")).toBeInTheDocument();
      expect(screen.getByText("Amazon RDS")).toBeInTheDocument();
    });

    it("should call onAnswerSelect with single answer when choice is clicked", () => {
      render(
        <QuestionCard
          question={mockQuestion}
          onAnswerSelect={mockOnAnswerSelect}
          showExplanations={false}
        />
      );

      fireEvent.click(screen.getByText("Amazon S3"));
      expect(mockOnAnswerSelect).toHaveBeenCalledWith("A");
    });

    it("should show selected answer with proper styling", () => {
      render(
        <QuestionCard
          question={mockQuestion}
          selectedAnswer="A"
          onAnswerSelect={mockOnAnswerSelect}
          showExplanations={false}
        />
      );

      const selectedButton = screen.getByText("Amazon S3").closest("button");
      expect(selectedButton).toHaveClass(
        "border-primary-600",
        "bg-primary-200"
      );
    });

    it("should show explanations when showExplanations is true", () => {
      render(
        <QuestionCard
          question={mockQuestion}
          selectedAnswer="A"
          onAnswerSelect={mockOnAnswerSelect}
          showExplanations={true}
        />
      );

      expect(
        screen.getByText("S3 is perfect for object storage")
      ).toBeInTheDocument();
      expect(screen.getByText("EBS is for block storage")).toBeInTheDocument();
    });

    it("should show correct/incorrect styling when explanations are shown", () => {
      render(
        <QuestionCard
          question={mockQuestion}
          selectedAnswer="B"
          onAnswerSelect={mockOnAnswerSelect}
          showExplanations={true}
        />
      );

      const correctButton = screen.getByText("Amazon S3").closest("button");
      const incorrectButton = screen.getByText("Amazon EBS").closest("button");

      expect(correctButton).toHaveClass("choice-correct");
      expect(incorrectButton).toHaveClass("choice-incorrect");
    });
  });

  describe("Multiple Choice Questions", () => {
    it("should render multiple choice question with checkboxes", () => {
      render(
        <QuestionCard
          question={mockMultipleChoiceQuestion}
          onAnswerSelect={mockOnAnswerSelect}
          showExplanations={false}
        />
      );

      expect(
        screen.getByText("Select 2 answers (0/2 selected)")
      ).toBeInTheDocument();
    });

    it("should call onAnswerSelect with array when choice is clicked", () => {
      render(
        <QuestionCard
          question={mockMultipleChoiceQuestion}
          onAnswerSelect={mockOnAnswerSelect}
          showExplanations={false}
        />
      );

      fireEvent.click(screen.getByText("Amazon EC2"));
      expect(mockOnAnswerSelect).toHaveBeenCalledWith(["A"]);
    });

    it("should add to existing selections when under limit", () => {
      render(
        <QuestionCard
          question={mockMultipleChoiceQuestion}
          selectedAnswer={["A"]}
          onAnswerSelect={mockOnAnswerSelect}
          showExplanations={false}
        />
      );

      fireEvent.click(screen.getByText("Amazon Lambda"));
      expect(mockOnAnswerSelect).toHaveBeenCalledWith(["A", "B"]);
    });

    it("should remove selection when already selected choice is clicked", () => {
      render(
        <QuestionCard
          question={mockMultipleChoiceQuestion}
          selectedAnswer={["A", "B"]}
          onAnswerSelect={mockOnAnswerSelect}
          showExplanations={false}
        />
      );

      fireEvent.click(screen.getByText("Amazon EC2"));
      expect(mockOnAnswerSelect).toHaveBeenCalledWith(["B"]);
    });

    it("should not add selection when at limit and trying to add new choice", () => {
      render(
        <QuestionCard
          question={mockMultipleChoiceQuestion}
          selectedAnswer={["A", "B"]}
          onAnswerSelect={mockOnAnswerSelect}
          showExplanations={false}
        />
      );

      fireEvent.click(screen.getByText("Amazon S3"));
      expect(mockOnAnswerSelect).not.toHaveBeenCalled();
    });

    it("should disable choices when at limit and not selected", () => {
      render(
        <QuestionCard
          question={mockMultipleChoiceQuestion}
          selectedAnswer={["A", "B"]}
          onAnswerSelect={mockOnAnswerSelect}
          showExplanations={false}
        />
      );

      const disabledButton = screen.getByText("Amazon S3").closest("button");
      expect(disabledButton).toBeDisabled();
    });

    it("should show correct selection count", () => {
      render(
        <QuestionCard
          question={mockMultipleChoiceQuestion}
          selectedAnswer={["A"]}
          onAnswerSelect={mockOnAnswerSelect}
          showExplanations={false}
        />
      );

      expect(
        screen.getByText("Select 2 answers (1/2 selected)")
      ).toBeInTheDocument();
    });

    it("should show checkboxes for multiple choice questions", () => {
      render(
        <QuestionCard
          question={mockMultipleChoiceQuestion}
          selectedAnswer={["A"]}
          onAnswerSelect={mockOnAnswerSelect}
          showExplanations={false}
        />
      );

      // Check that the checkbox container exists and has the right structure
      const button = screen.getByText("Amazon EC2").closest("button");
      expect(button).toBeInTheDocument();

      // Check that the checkbox div exists within the button
      const checkboxContainer = button?.querySelector("div.flex-shrink-0");
      expect(checkboxContainer).toBeInTheDocument();
    });

    it("should handle array selectedAnswer correctly", () => {
      render(
        <QuestionCard
          question={mockMultipleChoiceQuestion}
          selectedAnswer={["A", "B"]}
          onAnswerSelect={mockOnAnswerSelect}
          showExplanations={false}
        />
      );

      expect(
        screen.getByText("Select 2 answers (2/2 selected)")
      ).toBeInTheDocument();
    });

    it("should handle string selectedAnswer for multiple choice", () => {
      render(
        <QuestionCard
          question={mockMultipleChoiceQuestion}
          selectedAnswer="A"
          onAnswerSelect={mockOnAnswerSelect}
          showExplanations={false}
        />
      );

      expect(
        screen.getByText("Select 2 answers (1/2 selected)")
      ).toBeInTheDocument();
    });

    it("should handle undefined selectedAnswer for multiple choice", () => {
      render(
        <QuestionCard
          question={mockMultipleChoiceQuestion}
          onAnswerSelect={mockOnAnswerSelect}
          showExplanations={false}
        />
      );

      expect(
        screen.getByText("Select 2 answers (0/2 selected)")
      ).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle question with no correct answers", () => {
      const questionWithNoCorrect: Question = {
        ...mockQuestion,
        choices: mockQuestion.choices.map((choice) => ({
          ...choice,
          is_correct: false,
        })),
      };

      render(
        <QuestionCard
          question={questionWithNoCorrect}
          onAnswerSelect={mockOnAnswerSelect}
          showExplanations={false}
        />
      );

      // Should render as single choice since correctAnswersCount = 0
      expect(screen.queryByText(/Select \d+ answers/)).not.toBeInTheDocument();
    });

    it("should handle question with 3 correct answers", () => {
      const questionWithThreeCorrect: Question = {
        ...mockMultipleChoiceQuestion,
        choices: mockMultipleChoiceQuestion.choices.map((choice, index) => ({
          ...choice,
          is_correct: index < 3, // First 3 choices are correct
        })),
      };

      render(
        <QuestionCard
          question={questionWithThreeCorrect}
          onAnswerSelect={mockOnAnswerSelect}
          showExplanations={false}
        />
      );

      expect(
        screen.getByText("Select 3 answers (0/3 selected)")
      ).toBeInTheDocument();
    });

    it("should handle disabled state correctly", () => {
      render(
        <QuestionCard
          question={mockMultipleChoiceQuestion}
          selectedAnswer={["A", "B"]}
          onAnswerSelect={mockOnAnswerSelect}
          showExplanations={false}
        />
      );

      const allButtons = screen.getAllByRole("button");
      const disabledButtons = allButtons.filter((button) => button.disabled);
      const enabledButtons = allButtons.filter((button) => !button.disabled);

      // Only selected buttons should be enabled when at limit
      expect(enabledButtons).toHaveLength(2); // A and B
      expect(disabledButtons).toHaveLength(2); // C and D
    });
  });
});
