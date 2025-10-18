import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import App from "../App";
import * as examStorage from "../utils/examStorage";
import * as themeUtils from "../utils/themeUtils";

// Mock the exam storage utilities
jest.mock("../utils/examStorage", () => ({
  getSavedExams: jest.fn(),
  cleanupDuplicateExams: jest.fn(),
  removeCompletedExams: jest.fn(),
  clearAllSavedExams: jest.fn(),
}));

// Mock theme utilities
jest.mock("../utils/themeUtils", () => ({
  getInitialSettings: jest.fn(),
  applyTheme: jest.fn(),
  saveSettings: jest.fn(),
}));

// Mock exam config with actual exam data
jest.mock("../config/examConfig", () => ({
  availableExams: [
    {
      id: "saa-c03",
      title: "AWS Certified Solutions Architect – Associate (SAA-C03)",
      description:
        "Design resilient, high-performing, secure, and cost-optimized AWS solutions",
      difficulty: "Basic",
      duration: "130 minutes",
      questions: 65,
      passingScore: 720,
      domains: [
        { name: "Design Secure Architectures", percentage: 30 },
        { name: "Design Resilient Architectures", percentage: 26 },
        { name: "Design High-Performing Architectures", percentage: 24 },
        { name: "Design Cost-Optimized Architectures", percentage: 20 },
      ],
    },
  ],
}));

describe("App Component - Basic Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Setup default mock returns
    (examStorage.getSavedExams as jest.Mock).mockReturnValue([]);
    (themeUtils.getInitialSettings as jest.Mock).mockReturnValue({
      theme: "light",
      randomizeQuestions: false,
      randomizeChoices: false,
      narratorEnabled: true,
      narratorVoice: "",
      narratorRate: 1.0,
      narratorPitch: 1.0,
    });
    (themeUtils.applyTheme as jest.Mock).mockImplementation(() => {});
    (themeUtils.saveSettings as jest.Mock).mockImplementation(() => {});
    (examStorage.cleanupDuplicateExams as jest.Mock).mockImplementation(
      () => []
    );
    (examStorage.removeCompletedExams as jest.Mock).mockImplementation(
      () => []
    );
    (examStorage.clearAllSavedExams as jest.Mock).mockImplementation(() => {});
  });

  it("should render the main app interface", async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("AWS Exam Practice")).not.toBeNull();
    });

    expect(screen.getByText("Select an Exam")).not.toBeNull();
  });

  it("should initialize with default settings", async () => {
    render(<App />);

    await waitFor(() => {
      expect(themeUtils.getInitialSettings).toHaveBeenCalled();
      expect(themeUtils.applyTheme).toHaveBeenCalledWith("light");
    });
  });

  it("should load and cleanup saved exams on mount", async () => {
    render(<App />);

    await waitFor(() => {
      expect(examStorage.getSavedExams).toHaveBeenCalled();
      expect(examStorage.cleanupDuplicateExams).toHaveBeenCalled();
      expect(examStorage.removeCompletedExams).toHaveBeenCalled();
    });
  });

  it("should handle settings panel toggle", async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("AWS Exam Practice")).not.toBeNull();
    });

    // Click settings button
    const settingsButton = screen.getByTitle("Settings");
    await userEvent.click(settingsButton);

    // Should show settings panel
    await waitFor(() => {
      expect(screen.getByText("Settings")).not.toBeNull();
    });

    // Close settings panel
    const closeButton = screen.getByRole("button", { name: "" });
    await userEvent.click(closeButton);

    // Settings panel should be hidden
    await waitFor(() => {
      expect(screen.queryByText("Settings")).toBeNull();
    });
  });

  it("should handle theme change in settings", async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("AWS Exam Practice")).not.toBeNull();
    });

    // Open settings
    const settingsButton = screen.getByTitle("Settings");
    await userEvent.click(settingsButton);

    await waitFor(() => {
      expect(screen.getByText("Settings")).not.toBeNull();
    });

    // Change theme to dark
    const darkThemeRadio = screen.getByDisplayValue("dark");
    await userEvent.click(darkThemeRadio);

    // Settings should be saved
    expect(themeUtils.saveSettings).toHaveBeenCalledWith({
      theme: "dark",
      randomizeQuestions: false,
      randomizeChoices: false,
      narratorEnabled: true,
      narratorVoice: "",
      narratorRate: 1.0,
      narratorPitch: 1.0,
    });
  });

  it("should handle randomization settings change", async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("AWS Exam Practice")).not.toBeNull();
    });

    // Open settings
    const settingsButton = screen.getByTitle("Settings");
    await userEvent.click(settingsButton);

    await waitFor(() => {
      expect(screen.getByText("Settings")).not.toBeNull();
    });

    // Change question randomization - find the second radio button for question order
    const questionOrderRadios = screen.getAllByRole("radio");
    const randomizeQuestionsRadio = questionOrderRadios.find(
      (radio) =>
        radio.getAttribute("name") === "questionOrder" &&
        !radio.hasAttribute("checked")
    );
    await userEvent.click(randomizeQuestionsRadio!);

    // Settings should be saved
    expect(themeUtils.saveSettings).toHaveBeenCalledWith({
      theme: "light",
      randomizeQuestions: true,
      randomizeChoices: false,
      narratorEnabled: true,
      narratorVoice: "",
      narratorRate: 1.0,
      narratorPitch: 1.0,
    });
  });

  it("should handle clear all exams", async () => {
    const mockSavedExams = [
      {
        id: "exam-1",
        examId: "saa-c03",
        difficulty: "Basic",
        title: "AWS Certified Solutions Architect – Associate",
        startTime: Date.now() - 3600000,
        lastSaved: Date.now() - 1800000,
        progress: {
          answered: 5,
          total: 10,
          percentage: 50,
        },
      },
    ];

    (examStorage.getSavedExams as jest.Mock).mockReturnValue(mockSavedExams);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("AWS Exam Practice")).not.toBeNull();
    });

    // Should show saved exams
    expect(screen.getByText("Saved Exams")).not.toBeNull();

    // Click clear all button
    const clearButton = screen.getByText("Clear All");

    // Mock window.confirm to return true
    const confirmSpy = jest.spyOn(window, "confirm").mockReturnValue(true);

    await userEvent.click(clearButton);

    // Should call clear all function
    expect(examStorage.clearAllSavedExams).toHaveBeenCalled();

    confirmSpy.mockRestore();
  });

  it("should show exam selection interface", async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("AWS Exam Practice")).not.toBeNull();
    });

    expect(
      screen.getByText(
        "AWS Certified Solutions Architect – Associate (SAA-C03)"
      )
    ).not.toBeNull();
    expect(
      screen.getByText(
        "Design resilient, high-performing, secure, and cost-optimized AWS solutions"
      )
    ).not.toBeNull();
  });

  it("should disable start button when no exam is selected", async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("AWS Exam Practice")).not.toBeNull();
    });

    const startButton = screen.getByText("Start Exam");
    expect(startButton).toHaveProperty("disabled", true);
  });

  it("should enable start button when exam is selected", async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("AWS Exam Practice")).not.toBeNull();
    });

    // Select an exam
    const examRadio = screen.getByRole("radio");
    await userEvent.click(examRadio);

    const startButton = screen.getByText("Start Exam");
    expect(startButton).toHaveProperty("disabled", false);
  });
});
