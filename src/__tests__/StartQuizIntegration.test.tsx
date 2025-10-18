import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import App from "../App";
import { ExamData } from "../types/exam";

// Mock the exam config
jest.mock("../config/examConfig", () => ({
  getAvailableExamFiles: jest.fn(() => ["saa-c03.json"]),
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

// Mock the exam data
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
    {
      id: 2,
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
  ],
};

// Mock fetch for exam data loading
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(mockExamData),
  } as Response)
) as jest.MockedFunction<typeof fetch>;

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock window.confirm
Object.defineProperty(window, "confirm", {
  value: jest.fn(() => true),
});

describe("Start Quiz Button Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it("should successfully start quiz after selecting exam and difficulty", async () => {
    render(<App />);

    // Wait for app to load
    await waitFor(() => {
      expect(screen.getByText("AWS Exam Practice")).not.toBeNull();
    });

    // Click on an exam radio button
    const examRadio = screen.getByRole("radio");
    fireEvent.click(examRadio);

    // Click Start Exam button
    const startExamButton = screen.getByText("Start Exam");
    fireEvent.click(startExamButton);

    // Should show difficulty selection
    await waitFor(() => {
      expect(screen.getByText("Select Difficulty Level")).not.toBeNull();
    });

    // Click on a difficulty
    const difficultyButton = screen.getByText(
      "AWS Certified Solutions Architect – Associate (SAA-C03) - Basic"
    );
    fireEvent.click(difficultyButton);

    // Should show domain selection
    await waitFor(() => {
      expect(
        screen.getByText(
          "Select Domains for AWS Certified Solutions Architect – Associate (SAA-C03)"
        )
      ).not.toBeNull();
    });

    // Click Start Quiz button
    const startQuizButton = screen.getByText(/Start Quiz/);
    fireEvent.click(startQuizButton);

    // Should show quiz interface
    await waitFor(() => {
      expect(screen.getByText("Question 1 of 2")).not.toBeNull();
    });
  });

  it("should handle domain selection and start quiz with filtered questions", async () => {
    render(<App />);

    // Navigate to domain selection
    await waitFor(() => {
      expect(screen.getByText("AWS Exam Practice")).not.toBeNull();
    });

    const examRadio = screen.getByRole("radio");
    fireEvent.click(examRadio);

    const startExamButton = screen.getByText("Start Exam");
    fireEvent.click(startExamButton);

    await waitFor(() => {
      expect(screen.getByText("Select Difficulty Level")).not.toBeNull();
    });

    const difficultyButton = screen.getByText(
      "AWS Certified Solutions Architect – Associate (SAA-C03) - Basic"
    );
    fireEvent.click(difficultyButton);

    await waitFor(() => {
      expect(
        screen.getByText(
          "Select Domains for AWS Certified Solutions Architect – Associate (SAA-C03)"
        )
      ).not.toBeNull();
    });

    // Toggle a domain off
    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[0]); // Click the first checkbox

    // Click Start Quiz button
    const startQuizButton = screen.getByText(/Start Quiz/);
    fireEvent.click(startQuizButton);

    // Should show quiz interface with filtered questions
    await waitFor(() => {
      expect(screen.getByText("Question 1 of 1")).not.toBeNull();
    });
  });

  it("should disable start button when no domains are selected", async () => {
    render(<App />);

    // Navigate to domain selection
    await waitFor(() => {
      expect(screen.getByText("AWS Exam Practice")).not.toBeNull();
    });

    const examRadio = screen.getByRole("radio");
    fireEvent.click(examRadio);

    const startExamButton = screen.getByText("Start Exam");
    fireEvent.click(startExamButton);

    await waitFor(() => {
      expect(screen.getByText("Select Difficulty Level")).not.toBeNull();
    });

    const difficultyButton = screen.getByText(
      "AWS Certified Solutions Architect – Associate (SAA-C03) - Basic"
    );
    fireEvent.click(difficultyButton);

    await waitFor(() => {
      expect(
        screen.getByText(
          "Select Domains for AWS Certified Solutions Architect – Associate (SAA-C03)"
        )
      ).not.toBeNull();
    });

    // Deselect all domains
    const checkboxes = screen.getAllByRole("checkbox");
    checkboxes.forEach((checkbox) => {
      if ((checkbox as HTMLInputElement).checked) {
        fireEvent.click(checkbox);
      }
    });

    // Start button should be disabled
    const startQuizButton = screen.getByText(/Start Quiz/);
    expect(startQuizButton).toHaveProperty("disabled", true);
  });
});
