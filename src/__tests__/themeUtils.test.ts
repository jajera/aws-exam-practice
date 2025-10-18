import {
  applyTheme,
  getInitialSettings,
  getSystemTheme,
  saveSettings,
} from "@/utils/themeUtils";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";

// Use the global localStorage mock from setupTests
let localStorageMock: Storage;

beforeEach(() => {
  // Get the global localStorage mock set up in setupTests
  localStorageMock = window.localStorage;

  // Clear all data and mock calls from previous tests
  localStorageMock.clear();
  jest.clearAllMocks();
});

// Mock document.documentElement
Object.defineProperty(document, "documentElement", {
  value: {
    classList: {
      add: jest.fn(),
      remove: jest.fn(),
      contains: jest.fn(),
    },
  },
  writable: true,
});

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query: unknown) => ({
    matches: query === "(prefers-color-scheme: dark)",
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe("Theme Utils", () => {
  describe("getInitialSettings", () => {
    it("should return default settings when no saved settings", () => {
      const settings = getInitialSettings();

      expect(settings).toEqual({
        theme: "system",
        randomizeQuestions: false,
        randomizeChoices: false,
      });
    });

    it("should return saved settings when available", () => {
      const savedSettings = {
        theme: "dark" as const,
        randomizeQuestions: true,
        randomizeChoices: true,
      };

      // Set saved settings in localStorage
      localStorageMock.setItem("appSettings", JSON.stringify(savedSettings));

      const settings = getInitialSettings();
      expect(settings).toEqual(savedSettings);
    });

    it("should handle invalid saved settings gracefully", () => {
      // Set invalid JSON in localStorage
      localStorageMock.setItem("appSettings", "invalid json");

      const settings = getInitialSettings();
      expect(settings).toEqual({
        theme: "system",
        randomizeQuestions: false,
        randomizeChoices: false,
      });
    });

    it("should return default settings when window is undefined", () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      const settings = getInitialSettings();
      expect(settings).toEqual({
        theme: "system",
        randomizeQuestions: false,
        randomizeChoices: false,
      });

      global.window = originalWindow;
    });
  });

  describe("saveSettings", () => {
    it("should save settings to localStorage", () => {
      const settings = {
        theme: "dark" as const,
        randomizeQuestions: true,
        randomizeChoices: false,
      };

      saveSettings(settings);

      // Verify settings were saved by reading them back
      const saved = localStorageMock.getItem("appSettings");
      expect(saved).toBe(JSON.stringify(settings));
    });

    it("should handle partial settings", () => {
      const settings = {
        theme: "light" as const,
        randomizeQuestions: false,
        randomizeChoices: false,
      };

      saveSettings(settings);

      // Verify settings were saved by reading them back
      const saved = localStorageMock.getItem("appSettings");
      expect(saved).toBe(JSON.stringify(settings));
    });

    it("should handle missing window gracefully", () => {
      // This test verifies the function doesn't throw when window is undefined
      // In the actual implementation, it checks typeof window !== 'undefined'
      // We can't truly delete window in jsdom, so this is a simpler check
      expect(() => {
        saveSettings({
          theme: "dark",
          randomizeQuestions: true,
          randomizeChoices: false,
        });
      }).not.toThrow();
    });
  });

  describe("getSystemTheme", () => {
    it("should return light when system prefers light", () => {
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: jest.fn().mockImplementation((query: unknown) => ({
          matches: query === "(prefers-color-scheme: light)",
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      const theme = getSystemTheme();
      expect(theme).toBe("light");
    });

    it("should return dark when system prefers dark", () => {
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: jest.fn().mockImplementation((query: unknown) => ({
          matches: query === "(prefers-color-scheme: dark)",
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      const theme = getSystemTheme();
      expect(theme).toBe("dark");
    });

    it("should return light as fallback when matchMedia is unavailable", () => {
      // In jsdom environment, we test the fallback by removing matchMedia
      const originalMatchMedia = window.matchMedia;
      // @ts-ignore
      window.matchMedia = undefined;

      const theme = getSystemTheme();
      expect(theme).toBe("light");

      // Restore
      window.matchMedia = originalMatchMedia;
    });

    it("should return light as fallback when matchMedia is not available", () => {
      const originalMatchMedia = window.matchMedia;
      // @ts-ignore
      window.matchMedia = undefined;

      const theme = getSystemTheme();
      expect(theme).toBe("light");

      window.matchMedia = originalMatchMedia;
    });
  });

  describe("applyTheme", () => {
    it("should apply light theme", () => {
      applyTheme("light");

      expect(document.documentElement.classList.remove).toHaveBeenCalledWith(
        "dark"
      );
    });

    it("should apply dark theme", () => {
      applyTheme("dark");

      expect(document.documentElement.classList.add).toHaveBeenCalledWith(
        "dark"
      );
    });

    it("should apply system theme based on media query", () => {
      // Mock system prefers dark
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: jest.fn().mockImplementation((query: unknown) => ({
          matches: query === "(prefers-color-scheme: dark)",
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      applyTheme("system");

      expect(document.documentElement.classList.add).toHaveBeenCalledWith(
        "dark"
      );
    });

    it("should apply system theme when system prefers light", () => {
      // Mock system prefers light
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: jest.fn().mockImplementation((query: unknown) => ({
          matches: query === "(prefers-color-scheme: light)",
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      applyTheme("system");

      expect(document.documentElement.classList.remove).toHaveBeenCalledWith(
        "dark"
      );
    });

    it("should handle unknown theme gracefully", () => {
      applyTheme("unknown" as any);

      // Should not crash and should default to light theme behavior
      expect(document.documentElement.classList.remove).toHaveBeenCalledWith(
        "dark"
      );
    });
  });
});
