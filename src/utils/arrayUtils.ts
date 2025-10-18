// Fisher-Yates shuffle algorithm
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Shuffle questions while preserving their IDs
export function shuffleQuestions<T extends { id: number }>(questions: T[]): T[] {
  return shuffleArray(questions)
}

// Shuffle choices while preserving their labels
export function shuffleChoices<T extends { label: string }>(choices: T[]): T[] {
  return shuffleArray(choices)
}
