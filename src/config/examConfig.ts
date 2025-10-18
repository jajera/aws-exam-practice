export interface ExamConfig {
  examId: string;
  displayName: string;
  description: string;
  difficulty: string;
  colorScheme: {
    primary: string;
    secondary: string;
    questionTag: string;
    domainTag: string;
  };
  icon?: string;
  order: number;
}

// Dynamic color scheme generation based on difficulty keywords
const getColorScheme = (difficulty: string) => {
  const lowerDifficulty = difficulty.toLowerCase();

  // Check for specific patterns and return appropriate colors
  if (
    lowerDifficulty.includes("expert") ||
    lowerDifficulty.includes("advanced")
  ) {
    return {
      primary: "border-red-500 bg-red-50 dark:bg-red-900/20 hover:shadow-lg",
      secondary:
        "border-slate-200 dark:border-slate-600 hover:border-red-400 hover:bg-red-50 dark:hover:bg-slate-700 dark:hover:border-slate-500 hover:shadow-lg",
      questionTag:
        "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200",
      domainTag:
        "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200",
    };
  }

  if (lowerDifficulty.includes("intermediate")) {
    return {
      primary:
        "border-orange-500 bg-orange-50 dark:bg-orange-900/20 hover:shadow-lg",
      secondary:
        "border-slate-200 dark:border-slate-600 hover:border-orange-400 hover:bg-orange-50 dark:hover:bg-slate-700 dark:hover:border-slate-500 hover:shadow-lg",
      questionTag:
        "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200",
      domainTag:
        "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200",
    };
  }

  if (lowerDifficulty.includes("basic")) {
    return {
      primary: "border-blue-500 bg-blue-50 dark:bg-blue-900/20 hover:shadow-lg",
      secondary:
        "border-slate-200 dark:border-slate-600 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 dark:hover:border-slate-500 hover:shadow-lg",
      questionTag:
        "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200",
      domainTag:
        "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200",
    };
  }

  if (
    lowerDifficulty.includes("beginner") ||
    lowerDifficulty.includes("intro")
  ) {
    return {
      primary:
        "border-green-500 bg-green-50 dark:bg-green-900/20 hover:shadow-lg",
      secondary:
        "border-slate-200 dark:border-slate-600 hover:border-green-400 hover:bg-green-50 dark:hover:bg-slate-700 dark:hover:border-slate-500 hover:shadow-lg",
      questionTag:
        "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200",
      domainTag:
        "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200",
    };
  }

  // Default fallback for any unknown difficulty
  return {
    primary:
      "border-slate-500 bg-slate-50 dark:bg-slate-900/20 hover:shadow-lg",
    secondary:
      "border-slate-200 dark:border-slate-600 hover:border-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 dark:hover:border-slate-500 hover:shadow-lg",
    questionTag:
      "bg-slate-100 dark:bg-slate-900/30 text-slate-800 dark:text-slate-200",
    domainTag:
      "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200",
  };
};

// Dynamic icon generation based on difficulty keywords
const getIcon = (difficulty: string) => {
  const lowerDifficulty = difficulty.toLowerCase();

  if (lowerDifficulty.includes("expert")) return "🚀";
  if (lowerDifficulty.includes("advanced")) return "⚡";
  if (lowerDifficulty.includes("intermediate")) return "📚";
  if (lowerDifficulty.includes("basic")) return "📖";
  if (lowerDifficulty.includes("beginner")) return "🌱";
  if (lowerDifficulty.includes("intro")) return "🎯";

  // Default fallback
  return "📝";
};

// Dynamic order generation based on difficulty keywords
const getOrder = (difficulty: string) => {
  const lowerDifficulty = difficulty.toLowerCase();

  if (lowerDifficulty.includes("beginner") || lowerDifficulty.includes("intro"))
    return 1;
  if (lowerDifficulty.includes("basic")) return 2;
  if (lowerDifficulty.includes("intermediate")) return 3;
  if (lowerDifficulty.includes("advanced")) return 4;
  if (lowerDifficulty.includes("expert")) return 5;

  // Default fallback - put unknown difficulties at the end
  return 99;
};

// Generate config from exam data
export const generateExamConfig = (examData: any): ExamConfig => {
  const difficulty = examData.summary?.difficulty || "Unknown";
  const colorScheme = getColorScheme(difficulty);
  const icon = getIcon(difficulty);
  const order = getOrder(difficulty);

  return {
    examId: examData.examId,
    displayName: examData.summary?.difficulty || examData.title,
    description: examData.summary?.description || "Practice exam questions",
    difficulty: difficulty,
    colorScheme,
    icon,
    order,
  };
};

// Dynamic exam discovery - scan for JSON files in /data/ directory
export const getAvailableExamFiles = async (): Promise<string[]> => {
  try {
    // In a real implementation, you'd scan the filesystem
    // For now, we'll return the known files
    return ["saa-c03-basic", "saa-c03-intermediate", "saa-c03-advanced"];
  } catch (error) {
    console.error("Error discovering exam files:", error);
    return [];
  }
};

export const getExamConfig = async (
  examId: string
): Promise<ExamConfig | undefined> => {
  try {
    const response = await fetch(`./data/${examId}.json`);
    if (!response.ok) return undefined;

    const examData = await response.json();
    return generateExamConfig(examData);
  } catch (error) {
    console.error("Error loading exam config:", error);
    return undefined;
  }
};
