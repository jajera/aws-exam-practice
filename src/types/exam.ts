export interface Choice {
  label: string;
  text: string;
  explanation: string;
  is_correct: boolean;
}

export interface Question {
  id: number;
  question: string;
  type: 'single-choice' | 'multiple-choice';
  domain: string;
  subcategory: string;
  choices: Choice[];
}

export interface Domain {
  name: string;
  percentage: number;
  subcategories: string[];
}

export interface ExamSummary {
  description: string;
  difficulty?: string;
  domains: Domain[];
}

export interface ExamData {
  examId: string;
  title: string;
  summary: ExamSummary;
  questions: Question[];
}

export interface QuizState {
  currentQuestionIndex: number;
  answers: { [questionId: number]: string | string[] };
  isCompleted: boolean;
  startTime: number;
  endTime?: number;
}

export interface ExamResult {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  domainBreakdown: { [domain: string]: { correct: number; total: number; percentage: number } };
  timeSpent: number;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  randomizeQuestions: boolean;
  randomizeChoices: boolean;
  narratorEnabled: boolean;
  narratorVoice: string;
  narratorRate: number;
  narratorPitch: number;
}

export interface DomainOption {
  name: string;
  percentage: number;
  subcategories: string[];
  selected: boolean;
}
