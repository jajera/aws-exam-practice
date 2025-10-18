import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { AppSettings, Question } from "../../types/exam";
import {
  formatQuestionForNarration,
  getAvailableVoices,
  getNarratorSettings,
  stopSpeaking,
} from "../narratorUtils";

// Mock Web Speech API
const mockSpeechSynthesis = {
  getVoices: jest.fn(),
  speak: jest.fn(),
  cancel: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
};

const mockUtterance = {
  voice: null,
  rate: 1,
  pitch: 1,
  volume: 1,
  onend: null,
  onerror: null,
};

// Mock SpeechSynthesisUtterance constructor
global.SpeechSynthesisUtterance = jest
  .fn()
  .mockImplementation(() => mockUtterance) as any;

// Mock window.speechSynthesis
Object.defineProperty(window, "speechSynthesis", {
  value: mockSpeechSynthesis,
  writable: true,
});

describe("narratorUtils", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSpeechSynthesis.getVoices.mockReturnValue([]);
  });

  describe("formatQuestionForNarration", () => {
    const singleChoiceQuestion: Question = {
      id: 1,
      question: "What is AWS?",
      type: "single-choice",
      domain: "Cloud Concepts",
      subcategory: "AWS Overview",
      choices: [
        {
          label: "A",
          text: "Amazon Web Services",
          explanation: "Correct",
          is_correct: true,
        },
        {
          label: "B",
          text: "Amazon Work Services",
          explanation: "Incorrect",
          is_correct: false,
        },
      ],
    };

    const multipleChoiceQuestion: Question = {
      id: 2,
      question: "Which services are compute services?",
      type: "multiple-choice",
      domain: "Compute",
      subcategory: "EC2",
      choices: [
        { label: "A", text: "EC2", explanation: "Correct", is_correct: true },
        { label: "B", text: "S3", explanation: "Incorrect", is_correct: false },
        {
          label: "C",
          text: "Lambda",
          explanation: "Correct",
          is_correct: true,
        },
        {
          label: "D",
          text: "RDS",
          explanation: "Incorrect",
          is_correct: false,
        },
      ],
    };

    it("formats single choice question correctly", () => {
      const result = formatQuestionForNarration(singleChoiceQuestion);

      expect(result).toContain("This is a single choice question");
      expect(result).toContain("What is AWS?");
      expect(result).toContain("Option A: Amazon Web Services");
      expect(result).toContain("Option B: Amazon Work Services");
    });

    it("formats multiple choice question correctly", () => {
      const result = formatQuestionForNarration(multipleChoiceQuestion);

      expect(result).toContain("This is a multiple choice question");
      expect(result).toContain("Select 2 answers");
      expect(result).toContain("Which services are compute services?");
      expect(result).toContain("Option A: EC2");
      expect(result).toContain("Option B: S3");
      expect(result).toContain("Option C: Lambda");
      expect(result).toContain("Option D: RDS");
    });
  });

  describe("getAvailableVoices", () => {
    it("returns empty array when speechSynthesis is not available", async () => {
      // @ts-ignore
      delete window.speechSynthesis;

      const voices = await getAvailableVoices();
      expect(voices).toEqual([]);
    });

    it("returns voices when available", async () => {
      const mockVoices = [
        { name: "Google US English", lang: "en-US", default: true },
        { name: "Microsoft David", lang: "en-US", default: false },
      ];

      mockSpeechSynthesis.getVoices.mockReturnValue(mockVoices);

      const voices = await getAvailableVoices();

      expect(voices).toEqual([
        { name: "Google US English", lang: "en-US", default: true },
        { name: "Microsoft David", lang: "en-US", default: false },
      ]);
    });

    it("handles voiceschanged event when voices not immediately available", async () => {
      let voicesChangedCallback: () => void;

      mockSpeechSynthesis.getVoices.mockReturnValue([]);
      mockSpeechSynthesis.addEventListener.mockImplementation(
        (event: any, callback: any) => {
          if (event === "voiceschanged") {
            voicesChangedCallback = callback;
          }
        }
      );

      const promise = getAvailableVoices();

      // Simulate voices becoming available
      const mockVoices = [
        { name: "Test Voice", lang: "en-US", default: false },
      ];
      mockSpeechSynthesis.getVoices.mockReturnValue(mockVoices);

      // Trigger the voiceschanged event
      voicesChangedCallback!();

      const voices = await promise;
      expect(voices).toEqual([
        { name: "Test Voice", lang: "en-US", default: false },
      ]);
    });
  });

  describe("stopSpeaking", () => {
    it("calls speechSynthesis.cancel when available", () => {
      stopSpeaking();
      expect(mockSpeechSynthesis.cancel).toHaveBeenCalled();
    });

    it("handles missing speechSynthesis gracefully", () => {
      // @ts-ignore
      delete window.speechSynthesis;

      expect(() => stopSpeaking()).not.toThrow();
    });
  });

  describe("getNarratorSettings", () => {
    it("converts AppSettings to NarratorSettings correctly", () => {
      const appSettings: AppSettings = {
        theme: "dark",
        randomizeQuestions: true,
        randomizeChoices: false,
        narratorEnabled: true,
        narratorVoice: "Test Voice",
        narratorRate: 1.5,
        narratorPitch: 0.8,
      };

      const result = getNarratorSettings(appSettings);

      expect(result).toEqual({
        enabled: true,
        voice: "Test Voice",
        rate: 1.5,
        pitch: 0.8,
      });
    });
  });
});
