import { shuffleChoices, shuffleQuestions } from "@/utils/arrayUtils";
import { describe, expect, it } from "@jest/globals";

describe("Array Utils", () => {
  const mockQuestions = [
    {
      id: 1,
      question: "Question 1",
      type: "single-choice",
      domain: "Domain A",
      subcategory: "Sub1",
      choices: [],
    },
    {
      id: 2,
      question: "Question 2",
      type: "single-choice",
      domain: "Domain B",
      subcategory: "Sub2",
      choices: [],
    },
    {
      id: 3,
      question: "Question 3",
      type: "single-choice",
      domain: "Domain C",
      subcategory: "Sub3",
      choices: [],
    },
  ];

  const mockChoices = [
    {
      label: "A",
      text: "Choice A",
      explanation: "Explanation A",
      is_correct: true,
    },
    {
      label: "B",
      text: "Choice B",
      explanation: "Explanation B",
      is_correct: false,
    },
    {
      label: "C",
      text: "Choice C",
      explanation: "Explanation C",
      is_correct: false,
    },
  ];

  describe("shuffleQuestions", () => {
    it("should return array with same length", () => {
      const shuffled = shuffleQuestions(mockQuestions);
      expect(shuffled).toHaveLength(mockQuestions.length);
    });

    it("should contain all original questions", () => {
      const shuffled = shuffleQuestions(mockQuestions);
      expect(shuffled).toEqual(expect.arrayContaining(mockQuestions));
    });

    it("should not mutate original array", () => {
      const original = [...mockQuestions];
      shuffleQuestions(mockQuestions);
      expect(mockQuestions).toEqual(original);
    });

    it("should handle empty array", () => {
      const shuffled = shuffleQuestions([]);
      expect(shuffled).toEqual([]);
    });

    it("should handle single item array", () => {
      const singleItem = [mockQuestions[0]];
      const shuffled = shuffleQuestions(singleItem);
      expect(shuffled).toEqual(singleItem);
    });
  });

  describe("shuffleChoices", () => {
    it("should return array with same length", () => {
      const shuffled = shuffleChoices(mockChoices);
      expect(shuffled).toHaveLength(mockChoices.length);
    });

    it("should contain all original choices", () => {
      const shuffled = shuffleChoices(mockChoices);
      expect(shuffled).toEqual(expect.arrayContaining(mockChoices));
    });

    it("should not mutate original array", () => {
      const original = [...mockChoices];
      shuffleChoices(mockChoices);
      expect(mockChoices).toEqual(original);
    });

    it("should handle empty array", () => {
      const shuffled = shuffleChoices([]);
      expect(shuffled).toEqual([]);
    });

    it("should handle single item array", () => {
      const singleItem = [mockChoices[0]];
      const shuffled = shuffleChoices(singleItem);
      expect(shuffled).toEqual(singleItem);
    });

    it("should preserve choice properties", () => {
      const shuffled = shuffleChoices(mockChoices);
      shuffled.forEach((choice) => {
        expect(choice).toHaveProperty("label");
        expect(choice).toHaveProperty("text");
        expect(choice).toHaveProperty("explanation");
        expect(choice).toHaveProperty("is_correct");
      });
    });
  });
});
