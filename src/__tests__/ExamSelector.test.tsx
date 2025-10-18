import ExamSelector from "@/components/ExamSelector";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mockOnExamSelect = jest.fn();
const mockOnResumeExam = jest.fn();
const mockOnClearAllExams = jest.fn();

describe("ExamSelector", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render exam selection interface", () => {
    render(
      <ExamSelector
        onExamSelect={mockOnExamSelect}
        onResumeExam={mockOnResumeExam}
        onClearAllExams={mockOnClearAllExams}
        savedExams={[]}
      />
    );

    expect(screen.getByText("Select an Exam")).toBeInTheDocument();
    expect(
      screen.getByText(
        "AWS Certified Solutions Architect – Associate (SAA-C03)"
      )
    ).toBeInTheDocument();
  });

  it("should show saved exams when available", () => {
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

    render(
      <ExamSelector
        onExamSelect={mockOnExamSelect}
        onResumeExam={mockOnResumeExam}
        onClearAllExams={mockOnClearAllExams}
        savedExams={mockSavedExams}
      />
    );

    expect(screen.getByText("Saved Exams")).toBeInTheDocument();
    expect(
      screen.getByText("AWS Certified Solutions Architect – Associate")
    ).toBeInTheDocument();
  });

  it("should not show saved exams section when no saved exams", () => {
    render(
      <ExamSelector
        onExamSelect={mockOnExamSelect}
        onResumeExam={mockOnResumeExam}
        onClearAllExams={mockOnClearAllExams}
        savedExams={[]}
      />
    );

    expect(screen.queryByText("Saved Exams")).not.toBeInTheDocument();
  });

  it("should handle exam selection", async () => {
    render(
      <ExamSelector
        onExamSelect={mockOnExamSelect}
        onResumeExam={mockOnResumeExam}
        onClearAllExams={mockOnClearAllExams}
        savedExams={[]}
      />
    );

    const examRadio = screen.getByRole("radio");
    await userEvent.click(examRadio);

    const startButton = screen.getByText("Start Exam");
    await userEvent.click(startButton);

    expect(mockOnExamSelect).toHaveBeenCalledWith("saa-c03");
  });

  it("should disable start button when no exam is selected", () => {
    render(
      <ExamSelector
        onExamSelect={mockOnExamSelect}
        onResumeExam={mockOnResumeExam}
        onClearAllExams={mockOnClearAllExams}
        savedExams={[]}
      />
    );

    const startButton = screen.getByText("Start Exam");
    expect(startButton).toBeDisabled();
  });

  it("should handle resume exam", async () => {
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

    render(
      <ExamSelector
        onExamSelect={mockOnExamSelect}
        onResumeExam={mockOnResumeExam}
        onClearAllExams={mockOnClearAllExams}
        savedExams={mockSavedExams}
      />
    );

    const resumeButton = screen.getByText("Resume");
    await userEvent.click(resumeButton);

    expect(mockOnResumeExam).toHaveBeenCalledWith("exam-1");
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

    render(
      <ExamSelector
        onExamSelect={mockOnExamSelect}
        onResumeExam={mockOnResumeExam}
        onClearAllExams={mockOnClearAllExams}
        savedExams={mockSavedExams}
      />
    );

    const clearButton = screen.getByText("Clear All");
    await userEvent.click(clearButton);

    expect(mockOnClearAllExams).toHaveBeenCalled();
  });

  it("should show loading state when starting exam", async () => {
    mockOnExamSelect.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(
      <ExamSelector
        onExamSelect={mockOnExamSelect}
        onResumeExam={mockOnResumeExam}
        onClearAllExams={mockOnClearAllExams}
        savedExams={[]}
      />
    );

    const examRadio = screen.getByRole("radio");
    await userEvent.click(examRadio);

    const startButton = screen.getByText("Start Exam");
    await userEvent.click(startButton);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should handle error when starting exam fails", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    mockOnExamSelect.mockImplementation(() => {
      throw new Error("Network error");
    });

    render(
      <ExamSelector
        onExamSelect={mockOnExamSelect}
        onResumeExam={mockOnResumeExam}
        onClearAllExams={mockOnClearAllExams}
        savedExams={[]}
      />
    );

    const examRadio = screen.getByRole("radio");
    await userEvent.click(examRadio);

    const startButton = screen.getByText("Start Exam");
    await userEvent.click(startButton);

    // Wait for the error to be logged
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error starting exam:",
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });

  it("should format time correctly for saved exams", () => {
    const recentExam = {
      id: "exam-1",
      examId: "saa-c03",
      difficulty: "Basic",
      title: "AWS Certified Solutions Architect – Associate",
      startTime: Date.now() - 300000, // 5 minutes ago
      lastSaved: Date.now() - 1800000,
      progress: {
        answered: 5,
        total: 10,
        percentage: 50,
      },
    };

    render(
      <ExamSelector
        onExamSelect={mockOnExamSelect}
        onResumeExam={mockOnResumeExam}
        onClearAllExams={mockOnClearAllExams}
        savedExams={[recentExam]}
      />
    );

    // The component shows "Last saved: [date]" format
    expect(screen.getByText(/Last saved:/)).toBeInTheDocument();
  });

  it("should show progress percentage for saved exams", () => {
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

    render(
      <ExamSelector
        onExamSelect={mockOnExamSelect}
        onResumeExam={mockOnResumeExam}
        onClearAllExams={mockOnClearAllExams}
        savedExams={mockSavedExams}
      />
    );

    // The component shows percentage in format "questions (50%)"
    expect(screen.getByText(/questions \(50%\)/)).toBeInTheDocument();
    expect(screen.getByText(/questions \(80%\)/)).toBeInTheDocument();
  });

  it("should handle multiple saved exams with same exam ID", () => {
    const duplicateExams = [
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

    render(
      <ExamSelector
        onExamSelect={mockOnExamSelect}
        onResumeExam={mockOnResumeExam}
        onClearAllExams={mockOnClearAllExams}
        savedExams={duplicateExams}
      />
    );

    expect(
      screen.getAllByText("AWS Certified Solutions Architect – Associate")
    ).toHaveLength(2);
  });

  it("should not show clear all button when no saved exams", () => {
    render(
      <ExamSelector
        onExamSelect={mockOnExamSelect}
        onResumeExam={mockOnResumeExam}
        onClearAllExams={mockOnClearAllExams}
        savedExams={[]}
      />
    );

    expect(screen.queryByText("Clear All")).not.toBeInTheDocument();
  });
});
