import SettingsPanel from "@/components/SettingsPanel";
import { AppSettings } from "@/types/exam";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";

// Mock the theme utils
jest.mock("@/utils/themeUtils", () => ({
  saveSettings: jest.fn(),
}));

const mockSettings: AppSettings = {
  theme: "light",
  randomizeQuestions: false,
  randomizeChoices: false,
};

const mockOnClose = jest.fn();
const mockOnSettingsChange = jest.fn();

describe("SettingsPanel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render settings panel", () => {
    render(
      <SettingsPanel
        settings={mockSettings}
        onClose={mockOnClose}
        onSettingsChange={mockOnSettingsChange}
        isOpen={true}
      />
    );

    expect(screen.getByText("Settings")).not.toBeNull();
    expect(screen.getByText("Theme")).not.toBeNull();
    expect(screen.getByText("Question Order")).not.toBeNull();
    expect(screen.getByText("Answer Choices Order")).not.toBeNull();
  });

  it("should display current settings", () => {
    render(
      <SettingsPanel
        settings={mockSettings}
        onClose={mockOnClose}
        onSettingsChange={mockOnSettingsChange}
        isOpen={true}
      />
    );

    // Check that the current theme is selected
    const lightThemeRadio = screen.getByDisplayValue("light");
    expect(lightThemeRadio).toHaveProperty("checked", true);

    // Check that sequential options are selected (default)
    const sequentialQuestionRadio = screen.getByRole("radio", {
      name: /sequential questions appear in the order listed/i,
    });
    const sequentialChoiceRadio = screen.getByRole("radio", {
      name: /sequential answer choices appear in the order listed/i,
    });

    expect(sequentialQuestionRadio).toHaveProperty("checked", true);
    expect(sequentialChoiceRadio).toHaveProperty("checked", true);
  });

  it("should call onClose when close button is clicked", () => {
    render(
      <SettingsPanel
        settings={mockSettings}
        onClose={mockOnClose}
        onSettingsChange={mockOnSettingsChange}
        isOpen={true}
      />
    );

    const closeButton = screen.getByRole("button", { name: "" }); // The close button has no accessible name
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("should call onSettingsChange when theme is changed", () => {
    render(
      <SettingsPanel
        settings={mockSettings}
        onClose={mockOnClose}
        onSettingsChange={mockOnSettingsChange}
        isOpen={true}
      />
    );

    const darkThemeRadio = screen.getByDisplayValue("dark");
    fireEvent.click(darkThemeRadio);

    expect(mockOnSettingsChange).toHaveBeenCalledWith({
      ...mockSettings,
      theme: "dark",
    });
  });

  it("should call onSettingsChange when question order is changed", () => {
    render(
      <SettingsPanel
        settings={mockSettings}
        onClose={mockOnClose}
        onSettingsChange={mockOnSettingsChange}
        isOpen={true}
      />
    );

    const randomQuestionRadio = screen.getByRole("radio", {
      name: /random questions appear in random order/i,
    });
    fireEvent.click(randomQuestionRadio);

    expect(mockOnSettingsChange).toHaveBeenCalledWith({
      ...mockSettings,
      randomizeQuestions: true,
    });
  });

  it("should call onSettingsChange when choice order is changed", () => {
    render(
      <SettingsPanel
        settings={mockSettings}
        onClose={mockOnClose}
        onSettingsChange={mockOnSettingsChange}
        isOpen={true}
      />
    );

    const randomChoiceRadio = screen.getByRole("radio", {
      name: /random answer choices appear in random order/i,
    });
    fireEvent.click(randomChoiceRadio);

    expect(mockOnSettingsChange).toHaveBeenCalledWith({
      ...mockSettings,
      randomizeChoices: true,
    });
  });

  it("should display all theme options", () => {
    render(
      <SettingsPanel
        settings={mockSettings}
        onClose={mockOnClose}
        onSettingsChange={mockOnSettingsChange}
        isOpen={true}
      />
    );

    expect(screen.getByDisplayValue("light")).not.toBeNull();
    expect(screen.getByDisplayValue("dark")).not.toBeNull();
    expect(screen.getByDisplayValue("system")).not.toBeNull();
  });
});
