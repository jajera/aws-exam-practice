import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import {
  generateExamConfig,
  getAvailableExamFiles,
  getExamConfig,
} from "../config/examConfig";

// Mock fetch
global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>;

const mockExamData = {
  examId: "saa-c03",
  title: "AWS Certified Solutions Architect – Associate (SAA-C03)",
  summary: {
    difficulty: "Basic",
    description: "Test exam description",
    domains: [],
  },
  questions: [],
};

const mockAdvancedExamData = {
  examId: "saa-c03-advanced",
  title: "AWS Certified Solutions Architect – Associate (SAA-C03) - Advanced",
  summary: {
    difficulty: "Expert",
    description: "Advanced test exam description",
    domains: [],
  },
  questions: [],
};

describe("Exam Config", () => {
  describe("generateExamConfig", () => {
    it("should generate config for Basic difficulty", () => {
      const config = generateExamConfig(mockExamData);

      expect(config.examId).toBe("saa-c03");
      expect(config.displayName).toBe("Basic");
      expect(config.description).toBe("Test exam description");
      expect(config.difficulty).toBe("Basic");
      expect(config.icon).toBe("📖");
      expect(config.order).toBe(2);
      expect(config.colorScheme.questionTag).toContain("blue");
      expect(config.colorScheme.domainTag).toContain("indigo");
    });

    it("should generate config for Expert difficulty", () => {
      const config = generateExamConfig(mockAdvancedExamData);

      expect(config.examId).toBe("saa-c03-advanced");
      expect(config.displayName).toBe("Expert");
      expect(config.description).toBe("Advanced test exam description");
      expect(config.difficulty).toBe("Expert");
      expect(config.icon).toBe("🚀");
      expect(config.order).toBe(5);
      expect(config.colorScheme.questionTag).toContain("red");
      expect(config.colorScheme.domainTag).toContain("purple");
    });

    it("should handle unknown difficulty with fallbacks", () => {
      const unknownExamData = {
        ...mockExamData,
        summary: {
          difficulty: "Unknown Level",
          description: "Unknown exam",
          domains: [],
        },
      };

      const config = generateExamConfig(unknownExamData);

      expect(config.difficulty).toBe("Unknown Level");
      expect(config.icon).toBe("📝");
      expect(config.order).toBe(99);
      expect(config.colorScheme.questionTag).toContain("slate");
    });

    it("should handle missing difficulty field", () => {
      const noDifficultyData = {
        ...mockExamData,
        summary: {
          description: "No difficulty exam",
          domains: [],
        },
      };

      const config = generateExamConfig(noDifficultyData);

      expect(config.difficulty).toBe("Unknown");
      expect(config.displayName).toBe(
        "AWS Certified Solutions Architect – Associate (SAA-C03)"
      );
    });

    it("should handle missing description", () => {
      const noDescriptionData = {
        ...mockExamData,
        summary: {
          difficulty: "Test Level",
          domains: [],
        },
      };

      const config = generateExamConfig(noDescriptionData);

      expect(config.description).toBe("Practice exam questions");
    });
  });

  describe("getAvailableExamFiles", () => {
    it("should return array of exam file names", async () => {
      const files = await getAvailableExamFiles();

      expect(Array.isArray(files)).toBe(true);
      expect(files).toContain("saa-c03-basic");
      expect(files).toContain("saa-c03-advanced");
    });
  });

  describe("getExamConfig", () => {
    beforeEach(() => {
      (global.fetch as jest.MockedFunction<typeof fetch>).mockClear();
    });

    it("should fetch and generate config for valid exam", async () => {
      (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
        {
          ok: true,
          json: async () => mockExamData,
        } as Response
      );

      const config = await getExamConfig("saa-c03");

      expect(fetch).toHaveBeenCalledWith("./data/saa-c03.json");
      expect(config).toBeTruthy();
      expect(config?.examId).toBe("saa-c03");
    });

    it("should return undefined for non-existent exam", async () => {
      (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
        {
          ok: false,
        } as Response
      );

      const config = await getExamConfig("non-existent");

      expect(config).toBeUndefined();
    });

    it("should handle fetch errors", async () => {
      (global.fetch as jest.MockedFunction<typeof fetch>).mockRejectedValueOnce(
        new Error("Network error")
      );

      const config = await getExamConfig("saa-c03");

      expect(config).toBeUndefined();
    });
  });

  describe("difficulty pattern matching", () => {
    it('should match "expert" in difficulty string', () => {
      const expertData = {
        ...mockExamData,
        summary: { ...mockExamData.summary, difficulty: "Expert Level" },
      };
      const config = generateExamConfig(expertData);
      expect(config.icon).toBe("🚀");
      expect(config.order).toBe(5);
    });

    it('should match "advanced" in difficulty string', () => {
      const advancedData = {
        ...mockExamData,
        summary: { ...mockExamData.summary, difficulty: "Advanced Concepts" },
      };
      const config = generateExamConfig(advancedData);
      expect(config.icon).toBe("⚡");
      expect(config.order).toBe(4);
    });

    it('should match "intermediate" in difficulty string', () => {
      const intermediateData = {
        ...mockExamData,
        summary: { ...mockExamData.summary, difficulty: "Intermediate Skills" },
      };
      const config = generateExamConfig(intermediateData);
      expect(config.icon).toBe("📚");
      expect(config.order).toBe(3);
    });

    it('should match "basic" in difficulty string', () => {
      const basicData = {
        ...mockExamData,
        summary: { ...mockExamData.summary, difficulty: "Basic Concepts" },
      };
      const config = generateExamConfig(basicData);
      expect(config.icon).toBe("📖");
      expect(config.order).toBe(2);
    });

    it('should match "beginner" in difficulty string', () => {
      const beginnerData = {
        ...mockExamData,
        summary: { ...mockExamData.summary, difficulty: "Beginner Level" },
      };
      const config = generateExamConfig(beginnerData);
      expect(config.icon).toBe("🌱");
      expect(config.order).toBe(1);
    });
  });
});
