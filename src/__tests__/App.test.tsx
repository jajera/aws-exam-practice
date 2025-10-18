import App from "@/App";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { screen } from "@testing-library/dom";
import "@testing-library/jest-dom";
import { render, waitFor } from "@testing-library/react";

// Mock the exam data loading
jest.mock("@/config/examConfig", () => ({
  getAvailableExamFiles: jest
    .fn<() => Promise<string[]>>()
    .mockResolvedValue(["saa-c03", "saa-c03-advanced"]),
  getExamConfig: jest.fn().mockImplementation((examId: unknown) => {
    const mockConfigs = {
      "saa-c03": {
        examId: "saa-c03",
        displayName: "Basic",
        description: "Basic level questions",
        difficulty: "Basic",
        colorScheme: {
          questionTag: "bg-green-100 text-green-800",
          domainTag: "bg-blue-100 text-blue-800",
        },
        icon: "📚",
        order: 2,
      },
      "saa-c03-advanced": {
        examId: "saa-c03-advanced",
        displayName: "Advanced & Expert",
        description: "Advanced and expert level questions",
        difficulty: "Expert",
        colorScheme: {
          questionTag: "bg-red-100 text-red-800",
          domainTag: "bg-purple-100 text-purple-800",
        },
        icon: "🚀",
        order: 5,
      },
    };
    return Promise.resolve(mockConfigs[examId as keyof typeof mockConfigs]);
  }),
}));

// Mock fetch for exam data
global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>;
(global.fetch as jest.MockedFunction<typeof fetch>).mockImplementation(
  (input: RequestInfo | URL) => {
    const url = input.toString();
    if (url.includes("saa-c03.json")) {
      return Promise.resolve({
        ok: true,
        status: 200,
        statusText: "OK",
        headers: new Headers(),
        redirected: false,
        type: "basic",
        url: url,
        clone: () => ({} as Response),
        body: null,
        bodyUsed: false,
        bytes: () => Promise.resolve(new Uint8Array(0)),
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
        blob: () => Promise.resolve(new Blob()),
        formData: () => Promise.resolve(new FormData()),
        text: () => Promise.resolve(""),
        json: () =>
          Promise.resolve({
            examId: "saa-c03",
            title: "AWS Certified Solutions Architect – Associate (SAA-C03)",
            summary: {
              difficulty: "Basic",
              description: "Basic level questions",
              domains: [
                {
                  name: "Design Secure Architectures",
                  percentage: 30,
                  subcategories: ["Identity and access management"],
                },
                {
                  name: "Design Resilient Architectures",
                  percentage: 26,
                  subcategories: ["Multi-tier design"],
                },
              ],
            },
            questions: [
              {
                id: 1,
                question:
                  "What is the best practice for securing AWS resources?",
                type: "single-choice" as const,
                domain: "Design Secure Architectures",
                subcategory: "Identity and access management",
                choices: [
                  {
                    label: "A",
                    text: "Use root account for all operations",
                    explanation: "Incorrect - root account should be avoided",
                    is_correct: false,
                  },
                  {
                    label: "B",
                    text: "Implement least privilege access",
                    explanation:
                      "Correct - least privilege is a security best practice",
                    is_correct: true,
                  },
                ],
              },
            ],
          }),
      });
    }
    return Promise.resolve({
      ok: false,
      status: 404,
      statusText: "Not Found",
      headers: new Headers(),
      redirected: false,
      type: "basic",
      url: url,
      clone: () => ({} as Response),
      body: null,
      bodyUsed: false,
      bytes: () => Promise.resolve(new Uint8Array(0)),
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
      blob: () => Promise.resolve(new Blob()),
      formData: () => Promise.resolve(new FormData()),
      text: () => Promise.resolve(""),
      json: () => Promise.resolve({}),
    } as Response);
  }
);

describe("App Integration Tests", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe("Basic App Rendering", () => {
    it("should display exam selection screen initially", async () => {
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText("AWS Exam Practice")).not.toBeNull();
        expect(
          screen.getByText(
            "Test your knowledge with practice questions for AWS certifications"
          )
        ).not.toBeNull();
      });
    });

    it("should show exam selection options", async () => {
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText("Select an Exam")).not.toBeNull();
        expect(
          screen.getByText(
            "AWS Certified Solutions Architect – Associate (SAA-C03)"
          )
        ).not.toBeNull();
      });
    });
  });

  describe("Error Handling", () => {
    it("should handle exam loading errors gracefully", async () => {
      // Mock fetch to return error
      (global.fetch as jest.MockedFunction<typeof fetch>).mockRejectedValue(
        new Error("Network error")
      );

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText("AWS Exam Practice")).not.toBeNull();
      });
    });

    it("should handle clearAllSavedExams", () => {
      // This test verifies that clearAllSavedExams removes items from localStorage
      const {
        clearAllSavedExams,
        getSavedExams,
        saveExamProgress,
      } = require("@/utils/examStorage");

      // Setup: Save an exam
      const mockExamData = {
        examId: "test-exam",
        title: "Test Exam",
        summary: { difficulty: "Test", description: "Test", domains: [] },
        questions: [],
      };
      const mockQuizState = {
        currentQuestionIndex: 0,
        answers: {},
        isCompleted: false,
        startTime: Date.now(),
      };

      saveExamProgress(mockExamData, mockQuizState);

      // Verify exam was saved
      const savedBefore = getSavedExams();
      expect(savedBefore.length).toBeGreaterThan(0);

      // Call clearAllSavedExams
      clearAllSavedExams();

      // Verify all exams were cleared
      const savedAfter = getSavedExams();
      expect(savedAfter).toHaveLength(0);
    });
  });
});
