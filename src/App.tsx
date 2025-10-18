import { useEffect, useState } from "react";
import DifficultySelection from "./components/DifficultySelection";
import DomainSelection from "./components/DomainSelection";
import ExamSelector from "./components/ExamSelector";
import QuizFlow from "./components/QuizFlow";
import SettingsPanel from "./components/SettingsPanel";
import { getAvailableExamFiles } from "./config/examConfig";
import { AppSettings, DomainOption, ExamData } from "./types/exam";
import {
  cleanupDuplicateExams,
  clearAllSavedExams,
  getCurrentExamId,
  getSavedExam,
  getSavedExams,
  removeCompletedExams,
  SavedExam,
  saveExamProgress,
} from "./utils/examStorage";
import {
  filterQuestionsByDomains,
  getSelectedDomains,
  processQuestions,
} from "./utils/examUtils";
import {
  applyTheme,
  getInitialSettings,
  saveSettings,
} from "./utils/themeUtils";

type AppState = "select" | "quiz" | "results";

function App() {
  const [currentState, setCurrentState] = useState<AppState>("select");
  const [isInitialized, setIsInitialized] = useState(false);
  const [examData, setExamData] = useState<ExamData | null>(null);
  const [settings, setSettings] = useState<AppSettings>(getInitialSettings);
  const [showSettings, setShowSettings] = useState(false);
  const [savedExams, setSavedExams] = useState<SavedExam[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [domainOptions, setDomainOptions] = useState<DomainOption[]>([]);
  const [showDomainSelection, setShowDomainSelection] = useState(false);
  const [showDifficultySelection, setShowDifficultySelection] = useState(false);
  const [availableExams, setAvailableExams] = useState<ExamData[]>([]);

  // Apply theme on mount and when settings change
  useEffect(() => {
    applyTheme(settings.theme);
  }, [settings.theme]);

  // Listen for system theme changes when using system theme
  useEffect(() => {
    if (settings.theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyTheme("system");
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [settings.theme]);

  // Load saved exams from localStorage on mount
  useEffect(() => {
    // Clean up any duplicate exams first
    cleanupDuplicateExams();
    // Remove any completed exams
    removeCompletedExams();

    const saved = getSavedExams();
    setSavedExams(saved);

    // Always start with exam selection by default
    setCurrentState("select");
    setIsInitialized(true);
  }, []);

  const loadExamData = async (examId: string) => {
    try {
      const response = await fetch(`/data/${examId}.json`);
      if (!response.ok) {
        throw new Error("Failed to load exam data");
      }
      const data: ExamData = await response.json();
      setExamData(data);

      // Initialize domain options
      const domains = data.summary.domains.map((domain) => ({
        name: domain.name,
        percentage: domain.percentage,
        subcategories: domain.subcategories,
        selected: true, // Default to all selected
      }));
      setDomainOptions(domains);
    } catch (error) {
      console.error("Error loading exam:", error);
      alert("Failed to load exam data. Please try again.");
    }
  };

  const handleExamSelect = async (examId: string) => {
    setSelectedExamId(examId);

    // Load all available exam files dynamically
    try {
      const examFiles = await getAvailableExamFiles();
      const responses = await Promise.all(
        examFiles.map((file) => fetch(`/data/${file}.json`))
      );

      const examData = await Promise.all(
        responses.map((response) => response.json())
      );

      setAvailableExams(examData);
      setShowDifficultySelection(true);
    } catch (error) {
      console.error("Error loading exam data:", error);
      alert("Failed to load exam data. Please try again.");
    }
  };

  const handleDifficultySelect = async (examId: string) => {
    if (!selectedExamId) return;

    await loadExamData(examId);
    setShowDifficultySelection(false);
    setShowDomainSelection(true);
  };

  const handleDomainToggle = (domainName: string) => {
    setDomainOptions((prev) =>
      prev.map((domain) =>
        domain.name === domainName
          ? { ...domain, selected: !domain.selected }
          : domain
      )
    );
  };

  const handleStartQuiz = () => {
    if (!examData) return;

    // Filter and process questions using utility functions
    const selectedDomains = getSelectedDomains(domainOptions);
    const filteredQuestions = filterQuestionsByDomains(
      examData.questions,
      selectedDomains
    );
    const processedQuestions = processQuestions(
      filteredQuestions,
      settings.randomizeQuestions,
      settings.randomizeChoices
    );

    const newExamData = {
      ...examData,
      questions: processedQuestions,
    };

    setExamData(newExamData);
    setCurrentState("quiz");
    setShowDomainSelection(false);

    // Save initial exam state
    saveExamProgress(newExamData, {
      currentQuestionIndex: 0,
      answers: {},
      isCompleted: false,
      startTime: Date.now(),
    });
  };

  const handleBackToExamSelection = () => {
    setShowDomainSelection(false);
    setShowDifficultySelection(false);
    setSelectedExamId(null);
    setDomainOptions([]);
    setExamData(null);
  };

  const handleBackToDifficultySelection = () => {
    setShowDomainSelection(false);
    setShowDifficultySelection(true);
    setDomainOptions([]);
    setExamData(null);
  };

  const handleNewExam = () => {
    setExamData(null);
    setCurrentState("select");
    setShowDomainSelection(false);
    setShowDifficultySelection(false);
    setSelectedExamId(null);
    setDomainOptions([]);
  };

  const handleResumeExam = async (examSessionId?: string) => {
    try {
      // If no specific exam ID provided, get the most recent one
      const targetExamId = examSessionId || getCurrentExamId();
      if (!targetExamId) return;

      const savedExam = getSavedExam(targetExamId);
      if (!savedExam) return;

      // Load the exam data
      const response = await fetch(`/data/${savedExam.examId}.json`);
      if (!response.ok) {
        throw new Error("Failed to load exam data");
      }
      const data: ExamData = await response.json();

      // Apply randomization based on settings
      const processedQuestions = processQuestions(
        data.questions,
        settings.randomizeQuestions,
        settings.randomizeChoices
      );

      const processedData = {
        ...data,
        questions: processedQuestions,
      };

      setExamData(processedData);
      setCurrentState("quiz");

      // Update saved exams list
      setSavedExams(getSavedExams());
    } catch (error) {
      console.error("Error resuming exam:", error);
      alert("Failed to resume exam. Please start a new exam.");
    }
  };

  const handleClearAllExams = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all saved exams? This action cannot be undone."
      )
    ) {
      // Use the proper utility function to clear all saved exams
      clearAllSavedExams();

      // Update state to empty array
      setSavedExams([]);

      // Force a re-render by updating a dummy state to ensure UI updates
      setCurrentState((prev) => prev);
    }
  };

  const handleSettingsChange = (newSettings: AppSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-gray-600 dark:text-gray-400">
            Loading...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8 relative">
          <button
            onClick={() => setShowSettings(true)}
            className="absolute top-0 right-0 p-3 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors duration-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Settings"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            AWS Exam Practice
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Test your knowledge with practice questions for AWS certifications
          </p>
        </header>

        {currentState === "select" &&
          !showDomainSelection &&
          !showDifficultySelection && (
            <ExamSelector
              onExamSelect={handleExamSelect}
              onResumeExam={handleResumeExam}
              onClearAllExams={handleClearAllExams}
              savedExams={savedExams}
            />
          )}

        {showDifficultySelection &&
          selectedExamId &&
          availableExams.length > 0 && (
            <DifficultySelection
              availableExams={availableExams}
              onDifficultySelect={handleDifficultySelect}
              onBack={handleBackToExamSelection}
            />
          )}

        {showDomainSelection && examData && (
          <DomainSelection
            examData={examData}
            domainOptions={domainOptions}
            onDomainToggle={handleDomainToggle}
            onStartQuiz={handleStartQuiz}
            onBack={handleBackToDifficultySelection}
          />
        )}

        {currentState === "quiz" && examData && (
          <QuizFlow
            examData={examData}
            onNewExam={handleNewExam}
            onBackToExamSelection={handleBackToExamSelection}
          />
        )}

        <SettingsPanel
          settings={settings}
          onSettingsChange={handleSettingsChange}
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
        />
      </div>
    </div>
  );
}

export default App;
