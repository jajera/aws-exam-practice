import {
  calculateQuestionScore,
  filterQuestionsByDomains,
  getSelectedDomains,
  getSelectedDomainsCount,
  processQuestions,
} from "@/utils/examUtils";
import { describe, expect, it, jest } from "@jest/globals";

// Mock shuffle functions
jest.mock("@/utils/arrayUtils", () => ({
  shuffleQuestions: (questions: any[]) => [...questions].reverse(),
  shuffleChoices: (choices: any[]) => [...choices].reverse(),
}));

const mockQuestions = [
  {
    id: 1,
    question: "Q1",
    type: "single-choice" as const,
    domain: "Domain A",
    subcategory: "Sub1",
    choices: [],
  },
  {
    id: 2,
    question: "Q2",
    type: "single-choice" as const,
    domain: "Domain B",
    subcategory: "Sub2",
    choices: [],
  },
  {
    id: 3,
    question: "Q3",
    type: "single-choice" as const,
    domain: "Domain A",
    subcategory: "Sub3",
    choices: [],
  },
  {
    id: 4,
    question: "Q4",
    type: "single-choice" as const,
    domain: "Domain C",
    subcategory: "Sub4",
    choices: [],
  },
];

const mockDomainOptions = [
  {
    name: "Domain A",
    percentage: 50,
    subcategories: ["Sub1", "Sub3"],
    selected: true,
  },
  {
    name: "Domain B",
    percentage: 30,
    subcategories: ["Sub2"],
    selected: false,
  },
  { name: "Domain C", percentage: 20, subcategories: ["Sub4"], selected: true },
];

describe("Exam Utils", () => {
  describe("filterQuestionsByDomains", () => {
    it("should return all questions when no domains selected", () => {
      const result = filterQuestionsByDomains(mockQuestions, []);
      expect(result).toEqual(mockQuestions);
    });

    it("should filter questions by selected domains", () => {
      const result = filterQuestionsByDomains(mockQuestions, [
        "Domain A",
        "Domain C",
      ]);
      expect(result).toHaveLength(3);
      expect(result.map((q) => q.domain)).toEqual([
        "Domain A",
        "Domain A",
        "Domain C",
      ]);
    });

    it("should return empty array when no questions match selected domains", () => {
      const result = filterQuestionsByDomains(mockQuestions, [
        "Non-existent Domain",
      ]);
      expect(result).toEqual([]);
    });
  });

  describe("processQuestions", () => {
    it("should return questions unchanged when no randomization", () => {
      const result = processQuestions(mockQuestions, false, false);
      expect(result).toEqual(mockQuestions);
    });

    it("should shuffle questions when randomizeQuestions is true", () => {
      const result = processQuestions(mockQuestions, true, false);
      expect(result).toEqual([...mockQuestions].reverse());
    });

    it("should shuffle choices when randomizeChoices is true", () => {
      const questionsWithChoices = [
        {
          ...mockQuestions[0],
          choices: [
            {
              label: "A",
              text: "Choice A",
              explanation: "Exp A",
              is_correct: true,
            },
            {
              label: "B",
              text: "Choice B",
              explanation: "Exp B",
              is_correct: false,
            },
          ],
        },
      ];

      const result = processQuestions(questionsWithChoices, false, true);
      expect(result[0].choices).toEqual(
        [...questionsWithChoices[0].choices].reverse()
      );
    });

    it("should apply both randomizations when both are true", () => {
      const result = processQuestions(mockQuestions, true, true);
      expect(result).toEqual([...mockQuestions].reverse());
    });
  });

  describe("getSelectedDomains", () => {
    it("should return names of selected domains", () => {
      const result = getSelectedDomains(mockDomainOptions);
      expect(result).toEqual(["Domain A", "Domain C"]);
    });

    it("should return empty array when no domains selected", () => {
      const unselectedOptions = mockDomainOptions.map((domain) => ({
        ...domain,
        selected: false,
      }));
      const result = getSelectedDomains(unselectedOptions);
      expect(result).toEqual([]);
    });
  });

  describe("getSelectedDomainsCount", () => {
    it("should return count of selected domains", () => {
      const result = getSelectedDomainsCount(mockDomainOptions);
      expect(result).toBe(2);
    });

    it("should return 0 when no domains selected", () => {
      const unselectedOptions = mockDomainOptions.map((domain) => ({
        ...domain,
        selected: false,
      }));
      const result = getSelectedDomainsCount(unselectedOptions);
      expect(result).toBe(0);
    });
  });

  describe("calculateQuestionScore", () => {
    const singleChoiceQuestion = {
      id: 1,
      question: "What is AWS S3?",
      type: "single-choice" as const,
      domain: "Storage",
      subcategory: "Object Storage",
      choices: [
        {
          label: "A",
          text: "Object Storage",
          explanation: "Correct",
          is_correct: true,
        },
        {
          label: "B",
          text: "Block Storage",
          explanation: "Incorrect",
          is_correct: false,
        },
        {
          label: "C",
          text: "File Storage",
          explanation: "Incorrect",
          is_correct: false,
        },
        {
          label: "D",
          text: "Database",
          explanation: "Incorrect",
          is_correct: false,
        },
      ],
    };

    const multipleChoiceQuestion = {
      id: 2,
      question: "Which are AWS compute services? (Select TWO)",
      type: "multiple-choice" as const,
      domain: "Compute",
      subcategory: "EC2",
      choices: [
        { label: "A", text: "EC2", explanation: "Correct", is_correct: true },
        {
          label: "B",
          text: "Lambda",
          explanation: "Correct",
          is_correct: true,
        },
        { label: "C", text: "S3", explanation: "Incorrect", is_correct: false },
        {
          label: "D",
          text: "RDS",
          explanation: "Incorrect",
          is_correct: false,
        },
      ],
    };

    describe("Single Choice Questions", () => {
      it("should return true for correct single answer", () => {
        const result = calculateQuestionScore(singleChoiceQuestion, "A");
        expect(result).toBe(true);
      });

      it("should return false for incorrect single answer", () => {
        const result = calculateQuestionScore(singleChoiceQuestion, "B");
        expect(result).toBe(false);
      });

      it("should handle array answer for single choice question", () => {
        const result = calculateQuestionScore(singleChoiceQuestion, ["A"]);
        expect(result).toBe(false); // Array answer for single choice should be false
      });
    });

    describe("Multiple Choice Questions", () => {
      it("should return true for correct multiple answers in correct order", () => {
        const result = calculateQuestionScore(multipleChoiceQuestion, [
          "A",
          "B",
        ]);
        expect(result).toBe(true);
      });

      it("should return true for correct multiple answers in different order", () => {
        const result = calculateQuestionScore(multipleChoiceQuestion, [
          "B",
          "A",
        ]);
        expect(result).toBe(true);
      });

      it("should return false for incorrect multiple answers", () => {
        const result = calculateQuestionScore(multipleChoiceQuestion, [
          "C",
          "D",
        ]);
        expect(result).toBe(false);
      });

      it("should return false for partial multiple answers", () => {
        const result = calculateQuestionScore(multipleChoiceQuestion, ["A"]);
        expect(result).toBe(false);
      });

      it("should return false for too many multiple answers", () => {
        const result = calculateQuestionScore(multipleChoiceQuestion, [
          "A",
          "B",
          "C",
        ]);
        expect(result).toBe(false);
      });

      it("should handle string answer for multiple choice question", () => {
        const result = calculateQuestionScore(multipleChoiceQuestion, "A");
        expect(result).toBe(false);
      });

      it("should handle mixed correct and incorrect answers", () => {
        const result = calculateQuestionScore(multipleChoiceQuestion, [
          "A",
          "C",
        ]);
        expect(result).toBe(false);
      });

      it("should handle empty array answer", () => {
        const result = calculateQuestionScore(multipleChoiceQuestion, []);
        expect(result).toBe(false);
      });
    });

    describe("Edge Cases", () => {
      it("should handle question with no correct answers", () => {
        const questionWithNoCorrect = {
          ...singleChoiceQuestion,
          choices: singleChoiceQuestion.choices.map((choice) => ({
            ...choice,
            is_correct: false,
          })),
        };
        const result = calculateQuestionScore(questionWithNoCorrect, "A");
        expect(result).toBe(false);
      });

      it("should handle question with all correct answers", () => {
        const questionWithAllCorrect = {
          ...multipleChoiceQuestion,
          choices: multipleChoiceQuestion.choices.map((choice) => ({
            ...choice,
            is_correct: true,
          })),
        };
        const result = calculateQuestionScore(questionWithAllCorrect, [
          "A",
          "B",
          "C",
          "D",
        ]);
        expect(result).toBe(true);
      });

      it("should handle undefined user answer", () => {
        const result = calculateQuestionScore(
          singleChoiceQuestion,
          undefined as any
        );
        expect(result).toBe(false);
      });

      it("should handle null user answer", () => {
        const result = calculateQuestionScore(
          singleChoiceQuestion,
          null as any
        );
        expect(result).toBe(false);
      });
    });
  });
});
