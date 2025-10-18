import { AppSettings, Question } from "../types/exam";

export interface NarratorSettings {
  enabled: boolean;
  voice: string;
  rate: number;
  pitch: number;
}

export interface Voice {
  name: string;
  lang: string;
  default?: boolean;
}

/**
 * Get available voices from the browser's speech synthesis API
 */
export function getAvailableVoices(): Promise<Voice[]> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      resolve([]);
      return;
    }

    const voices = window.speechSynthesis.getVoices();

    if (voices.length > 0) {
      resolve(
        voices.map((voice) => ({
          name: voice.name,
          lang: voice.lang,
          default: voice.default,
        }))
      );
    } else {
      // Voices might not be loaded yet, wait for voiceschanged event
      const handleVoicesChanged = () => {
        window.speechSynthesis.removeEventListener(
          "voiceschanged",
          handleVoicesChanged
        );
        const loadedVoices = window.speechSynthesis.getVoices();
        resolve(
          loadedVoices.map((voice) => ({
            name: voice.name,
            lang: voice.lang,
            default: voice.default,
          }))
        );
      };

      window.speechSynthesis.addEventListener(
        "voiceschanged",
        handleVoicesChanged
      );

      // Fallback timeout in case voiceschanged doesn't fire
      setTimeout(() => {
        window.speechSynthesis.removeEventListener(
          "voiceschanged",
          handleVoicesChanged
        );
        resolve([]);
      }, 1000);
    }
  });
}

/**
 * Format a question for narration, including type announcement and all choices
 */
export function formatQuestionForNarration(question: Question): string {
  const correctAnswersCount = question.choices.filter(
    (choice) => choice.is_correct
  ).length;
  const isMultipleChoice = correctAnswersCount > 1;

  let narration = "";

  // Announce question type
  if (isMultipleChoice) {
    narration += `This is a multiple choice question. Select ${correctAnswersCount} answers. `;
  } else {
    narration += "This is a single choice question. ";
  }

  // Add question text
  narration += question.question + ". ";

  // Add all choices
  question.choices.forEach((choice) => {
    narration += `Option ${choice.label}: ${choice.text}. `;
  });

  return narration;
}

/**
 * Speak text using the Web Speech API
 */
export function speakText(
  text: string,
  settings: NarratorSettings
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      reject(new Error("Speech synthesis not supported"));
      return;
    }

    if (!settings.enabled) {
      resolve();
      return;
    }

    // Stop any current speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Set voice if specified
    if (settings.voice) {
      const voices = window.speechSynthesis.getVoices();
      const selectedVoice = voices.find(
        (voice) => voice.name === settings.voice
      );
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }

    // Set speech parameters
    utterance.rate = settings.rate;
    utterance.pitch = settings.pitch;
    utterance.volume = 1.0;

    utterance.onend = () => resolve();
    utterance.onerror = (event) =>
      reject(new Error(`Speech synthesis error: ${event.error}`));

    window.speechSynthesis.speak(utterance);
  });
}

/**
 * Stop any current speech synthesis
 */
export function stopSpeaking(): void {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Convert AppSettings to NarratorSettings
 */
export function getNarratorSettings(
  appSettings: AppSettings
): NarratorSettings {
  return {
    enabled: appSettings.narratorEnabled,
    voice: appSettings.narratorVoice,
    rate: appSettings.narratorRate,
    pitch: appSettings.narratorPitch,
  };
}
