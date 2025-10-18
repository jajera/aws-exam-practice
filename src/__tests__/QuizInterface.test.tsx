import QuizInterface from "@/components/QuizInterface";
import { ExamData, QuizState } from "@/types/exam";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mockExamData: ExamData = {
  examId: "saa-c03",
  title: "Test Exam",
  summary: {
    description: "Test exam description",
    difficulty: "Basic",
    domains: [
      {
        name: "Test Domain",
        percentage: 100,
        subcategories: ["Test Subcategory"],
      },
    ],
  },
  questions: [
    {
      id: 1,
      question: "What is the correct answer?",
      type: "single-choice" as const,
      domain: "Test Domain",
      subcategory: "Test Subcategory",
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
        {
          label: "C",
          text: "Option C",
          explanation: "Explanation C",
          is_correct: false,
        },
      ],
    },
    {
      id: 2,
      question: "What is the second question?",
      type: "single-choice" as const,
      domain: "Test Domain",
      subcategory: "Test Subcategory",
      choices: [
        {
          label: "A",
          text: "Option A2",
          explanation: "Explanation A2",
          is_correct: true,
        },
        {
          label: "B",
          text: "Option B2",
          explanation: "Explanation B2",
          is_correct: false,
        },
      ],
    },
  ],
};

const mockQuizState: QuizState = {
  currentQuestionIndex: 0,
  answers: {},
  isCompleted: false,
  startTime: Date.now(),
};

const mockHandlers = {
  onAnswerSelect: jest.fn(),
  onNextQuestion: jest.fn(),
  onPreviousQuestion: jest.fn(),
  onComplete: jest.fn(),
  onExitExam: jest.fn(),
  onEndExam: jest.fn(),
};

describe("QuizInterface", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock window.confirm
    window.confirm = jest.fn(() => true) as jest.MockedFunction<
      typeof window.confirm
    >;
  });

  it("should render question and choices", () => {
    render(
      <QuizInterface
        examData={mockExamData}
        quizState={mockQuizState}
        {...mockHandlers}
      />
    );

    // use alternative assertion if toBeInTheDocument is not available
    expect(screen.getByText("What is the correct answer?")).not.toBeNull();
    expect(screen.getByText("Option A")).not.toBeNull();
    expect(screen.getByText("Option B")).not.toBeNull();
    expect(screen.getByText("Option C")).not.toBeNull();
  });

  it("should show progress information", () => {
    render(
      <QuizInterface
        examData={mockExamData}
        quizState={mockQuizState}
        {...mockHandlers}
      />
    );

    expect(screen.getByText("Question 1 of 2")).not.toBeNull();
    expect(screen.getByText("0 answered")).not.toBeNull();
    expect(screen.getByText("2 remaining")).not.toBeNull();
  });

  it("should call onAnswerSelect when choice is clicked", async () => {
    render(
      <QuizInterface
        examData={mockExamData}
        quizState={mockQuizState}
        {...mockHandlers}
      />
    );

    await userEvent.click(screen.getByText("Option A"));
    expect(mockHandlers.onAnswerSelect).toHaveBeenCalledWith(1, "A");
  });

  it("should show Next Question button when answer is selected", () => {
    const quizStateWithAnswer = {
      ...mockQuizState,
      answers: { 1: "A" },
    };

    render(
      <QuizInterface
        examData={mockExamData}
        quizState={quizStateWithAnswer}
        {...mockHandlers}
      />
    );

    expect(screen.getByText("Next Question")).not.toBeNull();
  });

  it("should show Complete Exam button on last question", () => {
    const lastQuestionState = {
      ...mockQuizState,
      currentQuestionIndex: 1,
      answers: { 2: "A" },
    };

    render(
      <QuizInterface
        examData={mockExamData}
        quizState={lastQuestionState}
        {...mockHandlers}
      />
    );

    expect(screen.getByText("Complete Exam")).not.toBeNull();
  });

  it("should show Show Answer button when answer is selected", () => {
    const quizStateWithAnswer = {
      ...mockQuizState,
      answers: { 1: "A" },
    };

    render(
      <QuizInterface
        examData={mockExamData}
        quizState={quizStateWithAnswer}
        {...mockHandlers}
      />
    );

    expect(screen.getByText("Show Answer")).not.toBeNull();
  });

  it("should call onNextQuestion when Next Question is clicked", async () => {
    const quizStateWithAnswer = {
      ...mockQuizState,
      answers: { 1: "A" },
    };

    render(
      <QuizInterface
        examData={mockExamData}
        quizState={quizStateWithAnswer}
        {...mockHandlers}
      />
    );

    await userEvent.click(screen.getByText("Next Question"));
    expect(mockHandlers.onNextQuestion).toHaveBeenCalled();
  });

  it("should call onComplete when Complete Exam is clicked", async () => {
    const lastQuestionState = {
      ...mockQuizState,
      currentQuestionIndex: 1,
      answers: { 2: "A" },
    };

    render(
      <QuizInterface
        examData={mockExamData}
        quizState={lastQuestionState}
        {...mockHandlers}
      />
    );

    await userEvent.click(screen.getByText("Complete Exam"));
    expect(mockHandlers.onComplete).toHaveBeenCalled();
  });

  it("should call onPreviousQuestion when Previous is clicked", async () => {
    const secondQuestionState = {
      ...mockQuizState,
      currentQuestionIndex: 1,
    };

    render(
      <QuizInterface
        examData={mockExamData}
        quizState={secondQuestionState}
        {...mockHandlers}
      />
    );

    await userEvent.click(screen.getByText("Previous"));
    expect(mockHandlers.onPreviousQuestion).toHaveBeenCalled();
  });

  it("should disable Previous button on first question", () => {
    render(
      <QuizInterface
        examData={mockExamData}
        quizState={mockQuizState}
        {...mockHandlers}
      />
    );

    const previousButton = screen.getByText("Previous");
    expect(previousButton.hasAttribute("disabled")).toBe(true);
  });

  it("should call onExitExam when Exit Exam is clicked", async () => {
    render(
      <QuizInterface
        examData={mockExamData}
        quizState={mockQuizState}
        {...mockHandlers}
      />
    );

    await userEvent.click(screen.getByText("Exit Exam"));
    expect(mockHandlers.onExitExam).toHaveBeenCalled();
  });

  it("should call onEndExam when End Exam is clicked", async () => {
    render(
      <QuizInterface
        examData={mockExamData}
        quizState={mockQuizState}
        {...mockHandlers}
      />
    );

    await userEvent.click(screen.getByText("End Exam"));
    expect(mockHandlers.onEndExam).toHaveBeenCalled();
  });

  it("should show explanations when Show Answer is clicked", async () => {
    const quizStateWithAnswer = {
      ...mockQuizState,
      answers: { 1: "A" },
    };

    render(
      <QuizInterface
        examData={mockExamData}
        quizState={quizStateWithAnswer}
        {...mockHandlers}
      />
    );

    await userEvent.click(screen.getByText("Show Answer"));

    // After clicking Show Answer, explanations should be visible
    expect(screen.getByText("Explanation A")).not.toBeNull();
    expect(screen.getByText("Explanation B")).not.toBeNull();
    expect(screen.getByText("Explanation C")).not.toBeNull();
  });

  it("should show domain information", () => {
    render(
      <QuizInterface
        examData={mockExamData}
        quizState={mockQuizState}
        {...mockHandlers}
      />
    );

    expect(screen.getByText("Exam Domain")).not.toBeNull();
    expect(screen.getAllByText("Test Domain")).toHaveLength(2); // Appears in question header and domain section
    expect(screen.getByText("(100%)")).not.toBeNull();
  });

  it("should show correct progress percentage", () => {
    const quizStateWithAnswer = {
      ...mockQuizState,
      answers: { 1: "A" },
    };

    render(
      <QuizInterface
        examData={mockExamData}
        quizState={quizStateWithAnswer}
        {...mockHandlers}
      />
    );

    expect(screen.getByText("1 answered")).not.toBeNull();
    expect(screen.getByText("1 remaining")).not.toBeNull();
  });

  it("should handle end exam confirmation", () => {
    const mockOnEndExam = jest.fn();
    const mockConfirm = jest.spyOn(window, "confirm").mockReturnValue(true);

    render(
      <QuizInterface
        examData={mockExamData}
        quizState={mockQuizState}
        onAnswerSelect={jest.fn()}
        onNextQuestion={jest.fn()}
        onPreviousQuestion={jest.fn()}
        onComplete={jest.fn()}
        onExitExam={jest.fn()}
        onEndExam={mockOnEndExam}
      />
    );

    const endExamButton = screen.getByText("End Exam");
    endExamButton.click();

    expect(mockConfirm).toHaveBeenCalledWith(
      "Are you sure you want to end the exam and view your results? Any unanswered questions will be marked as incorrect."
    );
    expect(mockOnEndExam).toHaveBeenCalled();

    mockConfirm.mockRestore();
  });

  it("should not end exam when confirmation is cancelled", () => {
    const mockOnEndExam = jest.fn();
    const mockConfirm = jest.spyOn(window, "confirm").mockReturnValue(false);

    render(
      <QuizInterface
        examData={mockExamData}
        quizState={mockQuizState}
        onAnswerSelect={jest.fn()}
        onNextQuestion={jest.fn()}
        onPreviousQuestion={jest.fn()}
        onComplete={jest.fn()}
        onExitExam={jest.fn()}
        onEndExam={mockOnEndExam}
      />
    );

    const endExamButton = screen.getByText("End Exam");
    endExamButton.click();

    expect(mockConfirm).toHaveBeenCalled();
    expect(mockOnEndExam).not.toHaveBeenCalled();

    mockConfirm.mockRestore();
  });

  it("should display single domain correctly", () => {
    const singleDomainExamData = {
      ...mockExamData,
      summary: {
        ...mockExamData.summary,
        domains: [
          {
            name: "Single Domain",
            percentage: 100,
            subcategories: ["Subcategory 1"],
          },
        ],
      },
    };

    render(
      <QuizInterface
        examData={singleDomainExamData}
        quizState={mockQuizState}
        onAnswerSelect={jest.fn()}
        onNextQuestion={jest.fn()}
        onPreviousQuestion={jest.fn()}
        onComplete={jest.fn()}
        onExitExam={jest.fn()}
        onEndExam={jest.fn()}
      />
    );

    expect(screen.getByText("Exam Domains")).toBeInTheDocument();
  });

  it("should display multiple domains correctly", () => {
    const multiDomainExamData = {
      ...mockExamData,
      summary: {
        ...mockExamData.summary,
        domains: [
          {
            name: "Domain 1",
            percentage: 50,
            subcategories: ["Subcategory 1"],
          },
          {
            name: "Domain 2",
            percentage: 50,
            subcategories: ["Subcategory 2"],
          },
        ],
      },
    };

    render(
      <QuizInterface
        examData={multiDomainExamData}
        quizState={mockQuizState}
        onAnswerSelect={jest.fn()}
        onNextQuestion={jest.fn()}
        onPreviousQuestion={jest.fn()}
        onEndExam={jest.fn()}
      />
    );

    expect(screen.getByText("Exam Domains")).toBeInTheDocument();
  });
});
