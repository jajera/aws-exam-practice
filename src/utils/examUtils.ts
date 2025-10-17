import { DomainOption, ExamData } from "../types/exam";
import { shuffleChoices, shuffleQuestions } from "./arrayUtils";

export const filterQuestionsByDomains = (
  questions: ExamData["questions"],
  selectedDomains: string[]
): ExamData["questions"] => {
  if (selectedDomains.length === 0) return questions;
  return questions.filter((question) =>
    selectedDomains.includes(question.domain)
  );
};

export const processQuestions = (
  questions: ExamData["questions"],
  randomizeQuestions: boolean,
  randomizeChoices: boolean
): ExamData["questions"] => {
  let processedQuestions = [...questions];

  if (randomizeQuestions) {
    processedQuestions = shuffleQuestions(processedQuestions);
  }

  if (randomizeChoices) {
    processedQuestions = processedQuestions.map((question) => ({
      ...question,
      choices: shuffleChoices([...question.choices]),
    }));
  }

  return processedQuestions;
};

export const getSelectedDomains = (domainOptions: DomainOption[]): string[] => {
  return domainOptions
    .filter((domain) => domain.selected)
    .map((domain) => domain.name);
};

export const getSelectedDomainsCount = (
  domainOptions: DomainOption[]
): number => {
  return domainOptions.filter((domain) => domain.selected).length;
};

export const calculateQuestionScore = (
  question: ExamData["questions"][0],
  userAnswer: string | string[]
): boolean => {
  const correctAnswers = question.choices
    .filter((choice) => choice.is_correct)
    .map((choice) => choice.label)
    .sort();

  const correctAnswersCount = correctAnswers.length;

  if (correctAnswersCount > 1) {
    // Multiple correct answers - user must select exactly the right ones
    const userAnswers = Array.isArray(userAnswer)
      ? userAnswer.sort()
      : [userAnswer];
    return (
      userAnswers.length === correctAnswersCount &&
      userAnswers.every((answer, index) => answer === correctAnswers[index])
    );
  } else {
    // Single correct answer
    return userAnswer === correctAnswers[0];
  }
};
