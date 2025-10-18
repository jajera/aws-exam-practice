import { ExamData, QuizState } from "../types/exam";

export interface SavedExam {
  id: string;
  examId: string;
  difficulty: string;
  title: string;
  startTime: number;
  lastSaved: number;
  quizState: QuizState;
  progress: {
    answered: number;
    total: number;
    percentage: number;
  };
}

const STORAGE_KEY = "savedExams";
const CURRENT_EXAM_KEY = "currentExamId";

export const saveExamProgress = (
  examData: ExamData,
  quizState: QuizState
): void => {
  try {
    // Get existing saved exams
    const savedExams = getSavedExams();

    // Create consistent ID for this exam session using startTime
    const examSessionId = `${examData.examId}-${quizState.startTime}`;

    // Calculate progress
    const answered = Object.keys(quizState.answers).length;
    const total = examData.questions.length;
    const percentage = Math.round((answered / total) * 100);

    // Create saved exam object
    const savedExam: SavedExam = {
      id: examSessionId,
      examId: examData.examId,
      difficulty: examData.summary?.difficulty || "Unknown",
      title: examData.title,
      startTime: quizState.startTime,
      lastSaved: Date.now(),
      quizState: { ...quizState },
      progress: {
        answered,
        total,
        percentage,
      },
    };

    // Find existing exam with same examId and startTime
    const existingIndex = savedExams.findIndex(
      (exam) =>
        exam.examId === examData.examId &&
        exam.startTime === quizState.startTime
    );

    if (existingIndex >= 0) {
      // Update existing exam
      savedExams[existingIndex] = savedExam;
    } else {
      // Add new exam
      savedExams.push(savedExam);
    }

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedExams));
    localStorage.setItem(CURRENT_EXAM_KEY, examSessionId);
  } catch (error) {
    console.error("Error saving exam progress:", error);
  }
};

export const getSavedExams = (): SavedExam[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Error loading saved exams:", error);
    return [];
  }
};

export const getCurrentExamId = (): string | null => {
  return localStorage.getItem(CURRENT_EXAM_KEY);
};

export const getSavedExam = (examSessionId: string): SavedExam | null => {
  const savedExams = getSavedExams();
  return savedExams.find((exam) => exam.id === examSessionId) || null;
};

export const deleteSavedExam = (examSessionId: string): void => {
  try {
    const savedExams = getSavedExams();
    const filtered = savedExams.filter((exam) => exam.id !== examSessionId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));

    // If this was the current exam, clear it
    if (getCurrentExamId() === examSessionId) {
      localStorage.removeItem(CURRENT_EXAM_KEY);
    }
  } catch (error) {
    console.error("Error deleting saved exam:", error);
  }
};

export const clearAllSavedExams = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(CURRENT_EXAM_KEY);
  } catch (error) {
    console.error("Error clearing saved exams:", error);
  }
};

export const cleanupDuplicateExams = (): void => {
  try {
    const savedExams = getSavedExams();

    // Group exams by examId and startTime, keeping only the most recent one
    const examMap = new Map<string, SavedExam>();

    savedExams.forEach((exam) => {
      const key = `${exam.examId}-${exam.startTime}`;
      const existing = examMap.get(key);

      if (!existing || exam.lastSaved > existing.lastSaved) {
        examMap.set(key, exam);
      }
    });

    // Convert back to array and save
    const cleanedExams = Array.from(examMap.values());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanedExams));
  } catch (error) {
    console.error("Error cleaning up duplicate exams:", error);
  }
};

export const hasIncompleteExams = (): boolean => {
  const savedExams = getSavedExams();
  return savedExams.some((exam) => !exam.quizState.isCompleted);
};

export const removeCompletedExams = (): void => {
  try {
    const savedExams = getSavedExams();
    const incompleteExams = savedExams.filter(
      (exam) => !exam.quizState.isCompleted
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(incompleteExams));
  } catch (error) {
    console.error("Error removing completed exams:", error);
  }
};
