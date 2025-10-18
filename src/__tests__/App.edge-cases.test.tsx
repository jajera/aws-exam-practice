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
  saveExamProgress: jest.fn(),
}));

// Mock theme utilities
jest.mock("../utils/themeUtils", () => ({
  getInitialSettings: jest.fn(),
  applyTheme: jest.fn(),
  saveSettings: jest.fn(),
}));

// Mock exam config
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

describe("App Component - Edge Cases", () => {
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
    (examStorage.saveExamProgress as jest.Mock).mockImplementation(() => {});
  });

  it("should handle settings change with system theme", async () => {
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

    // Change theme to system
    const systemThemeRadio = screen.getByDisplayValue("system");
    await userEvent.click(systemThemeRadio);

    // Click done button
    const doneButton = screen.getByText("Done");
    await userEvent.click(doneButton);

    // Settings should be saved
    expect(themeUtils.saveSettings).toHaveBeenCalledWith({
      theme: "system",
      randomizeQuestions: false,
      randomizeChoices: false,
      narratorEnabled: true,
      narratorVoice: "",
      narratorRate: 1.0,
      narratorPitch: 1.0,
    });
  });

  it("should handle answer choices randomization change", async () => {
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

    // Change answer choices randomization
    const choiceOrderRadios = screen.getAllByRole("radio");
    const randomizeChoicesRadio = choiceOrderRadios.find(
      (radio) =>
        radio.getAttribute("name") === "choiceOrder" &&
        !radio.hasAttribute("checked")
    );
    await userEvent.click(randomizeChoicesRadio!);

    // Click done button
    const doneButton = screen.getByText("Done");
    await userEvent.click(doneButton);

    // Settings should be saved
    expect(themeUtils.saveSettings).toHaveBeenCalledWith({
      theme: "light",
      randomizeQuestions: false,
      randomizeChoices: true,
      narratorEnabled: true,
      narratorVoice: "",
      narratorRate: 1.0,
      narratorPitch: 1.0,
    });
  });

  it("should handle both randomization settings change", async () => {
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

    // Change both randomization settings
    const allRadios = screen.getAllByRole("radio");
    const randomizeQuestionsRadio = allRadios.find(
      (radio) =>
        radio.getAttribute("name") === "questionOrder" &&
        !radio.hasAttribute("checked")
    );
    const randomizeChoicesRadio = allRadios.find(
      (radio) =>
        radio.getAttribute("name") === "choiceOrder" &&
        !radio.hasAttribute("checked")
    );

    await userEvent.click(randomizeQuestionsRadio!);
    await userEvent.click(randomizeChoicesRadio!);

    // Click done button
    const doneButton = screen.getByText("Done");
    await userEvent.click(doneButton);

    // Settings should be saved
    expect(themeUtils.saveSettings).toHaveBeenCalledWith({
      theme: "light",
      randomizeQuestions: true,
      randomizeChoices: true,
      narratorEnabled: true,
      narratorVoice: "",
      narratorRate: 1.0,
      narratorPitch: 1.0,
    });
  });

  it("should handle clear all exams cancellation", async () => {
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

    // Mock window.confirm to return false (user cancels)
    const confirmSpy = jest.spyOn(window, "confirm").mockReturnValue(false);

    await userEvent.click(clearButton);

    // Should not call clear all function
    expect(examStorage.clearAllSavedExams).not.toHaveBeenCalled();

    confirmSpy.mockRestore();
  });

  it("should handle multiple saved exams display", async () => {
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
      {
        id: "exam-2",
        examId: "saa-c03",
        difficulty: "Advanced",
        title: "AWS Certified Solutions Architect – Associate",
        startTime: Date.now() - 7200000,
        lastSaved: Date.now() - 3600000,
        progress: {
          answered: 8,
          total: 10,
          percentage: 80,
        },
      },
    ];

    (examStorage.getSavedExams as jest.Mock).mockReturnValue(mockSavedExams);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("AWS Exam Practice")).not.toBeNull();
    });

    // Should show saved exams section
    expect(screen.getByText("Saved Exams")).not.toBeNull();
    expect(
      screen.getByText("You have 2 saved exams in progress.")
    ).not.toBeNull();

    // Should show both exam titles
    const examTitles = screen.getAllByText(
      "AWS Certified Solutions Architect – Associate"
    );
    expect(examTitles).toHaveLength(2);

    // Should show progress percentages
    expect(screen.getByText(/questions \(50%\)/)).not.toBeNull();
    expect(screen.getByText(/questions \(80%\)/)).not.toBeNull();
  });

  it("should handle empty saved exams array", async () => {
    (examStorage.getSavedExams as jest.Mock).mockReturnValue([]);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("AWS Exam Practice")).not.toBeNull();
    });

    // Should not show saved exams section
    expect(screen.queryByText("Saved Exams")).toBeNull();
    expect(screen.queryByText("Clear All")).toBeNull();
  });

  it("should handle exam selection with keyboard navigation", async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("AWS Exam Practice")).not.toBeNull();
    });

    // Focus on the radio button and press space
    const examRadio = screen.getByRole("radio");
    examRadio.focus();
    await userEvent.keyboard(" ");

    // Should be selected
    expect(examRadio).toHaveProperty("checked", true);

    // Start button should be enabled
    const startButton = screen.getByText("Start Exam");
    expect(startButton).toHaveProperty("disabled", false);
  });

  it("should handle settings form submission with enter key", async () => {
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

    // Press enter on the done button
    const doneButton = screen.getByText("Done");
    doneButton.focus();
    await userEvent.keyboard("{Enter}");

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
});
