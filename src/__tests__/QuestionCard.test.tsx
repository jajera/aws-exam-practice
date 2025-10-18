import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import QuestionCard from "../components/QuestionCard";
import { AppSettings, Question } from "../types/exam";

// Mock narrator utilities
jest.mock("../utils/narratorUtils", () => ({
  formatQuestionForNarration: jest.fn(),
  speakText: jest.fn(),
  stopSpeaking: jest.fn(),
  getNarratorSettings: jest.fn(),
}));

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
  const mockSettings: AppSettings = {
    theme: "light",
    randomizeQuestions: false,
    randomizeChoices: false,
    narratorEnabled: true,
    narratorVoice: "",
    narratorRate: 1.0,
    narratorPitch: 1.0,
  };

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
          settings={mockSettings}
        />
      );

      expect(
        screen.getByText("What is the best AWS service for storing files?")
      ).not.toBeNull();
      expect(screen.getByText("Amazon S3")).not.toBeNull();
      expect(screen.getByText("Amazon EBS")).not.toBeNull();
      expect(screen.getByText("Amazon EFS")).not.toBeNull();
      expect(screen.getByText("Amazon RDS")).not.toBeNull();
    });

    it("should call onAnswerSelect with single answer when choice is clicked", () => {
      render(
        <QuestionCard
          question={mockQuestion}
          onAnswerSelect={mockOnAnswerSelect}
          showExplanations={false}
          settings={mockSettings}
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
          settings={mockSettings}
        />
      );

      const selectedButton = screen.getByText("Amazon S3").closest("button");
      expect(selectedButton?.classList.contains("border-primary-600")).toBe(
        true
      );
      expect(selectedButton?.classList.contains("bg-primary-200")).toBe(true);
    });

    it("should show explanations when showExplanations is true", () => {
      render(
        <QuestionCard
          question={mockQuestion}
          selectedAnswer="A"
          onAnswerSelect={mockOnAnswerSelect}
          showExplanations={true}
          settings={mockSettings}
        />
      );

      expect(
        screen.getByText("S3 is perfect for object storage")
      ).not.toBeNull();
      expect(screen.getByText("EBS is for block storage")).not.toBeNull();
    });

    it("should show correct/incorrect styling when explanations are shown", () => {
      render(
        <QuestionCard
          question={mockQuestion}
          selectedAnswer="B"
          onAnswerSelect={mockOnAnswerSelect}
          showExplanations={true}
          settings={mockSettings}
        />
      );

      const correctButton = screen.getByText("Amazon S3").closest("button");
      const incorrectButton = screen.getByText("Amazon EBS").closest("button");

      expect(correctButton?.classList.contains("choice-correct")).toBe(true);
      expect(incorrectButton?.classList.contains("choice-incorrect")).toBe(
        true
      );
    });
  });

  describe("Multiple Choice Questions", () => {
    it("should render multiple choice question with checkboxes", () => {
      render(
        <QuestionCard
          question={mockMultipleChoiceQuestion}
          onAnswerSelect={mockOnAnswerSelect}
          showExplanations={false}
          settings={mockSettings}
        />
      );

      expect(
        screen.getByText("Select 2 answers (0/2 selected)")
      ).not.toBeNull();
    });

    it("should call onAnswerSelect with array when choice is clicked", () => {
      render(
        <QuestionCard
          question={mockMultipleChoiceQuestion}
          onAnswerSelect={mockOnAnswerSelect}
          showExplanations={false}
          settings={mockSettings}
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
          settings={mockSettings}
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
          settings={mockSettings}
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
          settings={mockSettings}
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
          settings={mockSettings}
        />
      );

      const disabledButton = screen.getByText("Amazon S3").closest("button");
      expect(disabledButton).toHaveProperty("disabled", true);
    });

    it("should show correct selection count", () => {
      render(
        <QuestionCard
          question={mockMultipleChoiceQuestion}
          selectedAnswer={["A"]}
          onAnswerSelect={mockOnAnswerSelect}
          showExplanations={false}
          settings={mockSettings}
        />
      );

      expect(
        screen.getByText("Select 2 answers (1/2 selected)")
      ).not.toBeNull();
    });

    it("should show checkboxes for multiple choice questions", () => {
      render(
        <QuestionCard
          question={mockMultipleChoiceQuestion}
          selectedAnswer={["A"]}
          onAnswerSelect={mockOnAnswerSelect}
          showExplanations={false}
          settings={mockSettings}
        />
      );

      // Check that the checkbox container exists and has the right structure
      const button = screen.getByText("Amazon EC2").closest("button");
      expect(button).not.toBeNull();

      // Check that the checkbox div exists within the button
      const checkboxContainer = button?.querySelector("div.flex-shrink-0");
      expect(checkboxContainer).not.toBeNull();
    });

    it("should handle array selectedAnswer correctly", () => {
      render(
        <QuestionCard
          question={mockMultipleChoiceQuestion}
          selectedAnswer={["A", "B"]}
          onAnswerSelect={mockOnAnswerSelect}
          showExplanations={false}
          settings={mockSettings}
        />
      );

      expect(
        screen.getByText("Select 2 answers (2/2 selected)")
      ).not.toBeNull();
    });

    it("should handle string selectedAnswer for multiple choice", () => {
      render(
        <QuestionCard
          question={mockMultipleChoiceQuestion}
          selectedAnswer="A"
          onAnswerSelect={mockOnAnswerSelect}
          showExplanations={false}
          settings={mockSettings}
        />
      );

      expect(
        screen.getByText("Select 2 answers (1/2 selected)")
      ).not.toBeNull();
    });

    it("should handle undefined selectedAnswer for multiple choice", () => {
      render(
        <QuestionCard
          question={mockMultipleChoiceQuestion}
          onAnswerSelect={mockOnAnswerSelect}
          showExplanations={false}
          settings={mockSettings}
        />
      );

      expect(
        screen.getByText("Select 2 answers (0/2 selected)")
      ).not.toBeNull();
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
          settings={mockSettings}
        />
      );

      // Should render as single choice since correctAnswersCount = 0
      expect(screen.queryByText(/Select \d+ answers/)).toBeNull();
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
          settings={mockSettings}
        />
      );

      expect(
        screen.getByText("Select 3 answers (0/3 selected)")
      ).not.toBeNull();
    });

    it("should handle disabled state correctly", () => {
      render(
        <QuestionCard
          question={mockMultipleChoiceQuestion}
          selectedAnswer={["A", "B"]}
          onAnswerSelect={mockOnAnswerSelect}
          showExplanations={false}
          settings={mockSettings}
        />
      );

      const allButtons = screen.getAllByRole("button");
      // Filter out the narrator button to only test choice buttons
      const choiceButtons = allButtons.filter((button) =>
        button.textContent?.includes("Amazon")
      );
      const disabledButtons = choiceButtons.filter(
        (button) => (button as HTMLButtonElement).disabled
      );
      const enabledButtons = choiceButtons.filter(
        (button) => !(button as HTMLButtonElement).disabled
      );

      // Only selected buttons should be enabled when at limit
      expect(enabledButtons).toHaveLength(2); // A and B
      expect(disabledButtons).toHaveLength(2); // C and D
    });
  });

  describe("Narrator Functionality", () => {
    const {
      formatQuestionForNarration,
      speakText,
      stopSpeaking,
      getNarratorSettings,
    } = require("../utils/narratorUtils");

    it("should show Read Question button when narrator is enabled", () => {
      render(
        <QuestionCard
          question={mockQuestion}
          onAnswerSelect={mockOnAnswerSelect}
          showExplanations={false}
          settings={mockSettings}
        />
      );

      expect(screen.getByText("🔊 Read Question")).not.toBeNull();
    });

    it("should hide Read Question button when narrator is disabled", () => {
      const disabledSettings = { ...mockSettings, narratorEnabled: false };

      render(
        <QuestionCard
          question={mockQuestion}
          onAnswerSelect={mockOnAnswerSelect}
          showExplanations={false}
          settings={disabledSettings}
        />
      );

      expect(screen.queryByText("🔊 Read Question")).toBeNull();
    });

    it("should call narrator functions when Read Question button is clicked", async () => {
      formatQuestionForNarration.mockReturnValue("Test narration text");
      getNarratorSettings.mockReturnValue({
        enabled: true,
        voice: "",
        rate: 1,
        pitch: 1,
      });
      speakText.mockResolvedValue(undefined);

      render(
        <QuestionCard
          question={mockQuestion}
          onAnswerSelect={mockOnAnswerSelect}
          showExplanations={false}
          settings={mockSettings}
        />
      );

      fireEvent.click(screen.getByText("🔊 Read Question"));

      expect(formatQuestionForNarration).toHaveBeenCalledWith(mockQuestion);
      expect(getNarratorSettings).toHaveBeenCalledWith(mockSettings);
      expect(speakText).toHaveBeenCalledWith("Test narration text", {
        enabled: true,
        voice: "",
        rate: 1,
        pitch: 1,
      });
    });

    it("should show Stop Reading button when speaking", () => {
      render(
        <QuestionCard
          question={mockQuestion}
          onAnswerSelect={mockOnAnswerSelect}
          showExplanations={false}
          settings={mockSettings}
        />
      );

      // Click to start speaking (mocked)
      fireEvent.click(screen.getByText("🔊 Read Question"));

      // The button text should change to Stop Reading
      expect(screen.getByText("⏹️ Stop Reading")).not.toBeNull();
    });

    it("should call stopSpeaking when Stop Reading button is clicked", () => {
      render(
        <QuestionCard
          question={mockQuestion}
          onAnswerSelect={mockOnAnswerSelect}
          showExplanations={false}
          settings={mockSettings}
        />
      );

      // Click to start speaking
      fireEvent.click(screen.getByText("🔊 Read Question"));

      // Click to stop speaking
      fireEvent.click(screen.getByText("⏹️ Stop Reading"));

      expect(stopSpeaking).toHaveBeenCalled();
    });
  });
});
