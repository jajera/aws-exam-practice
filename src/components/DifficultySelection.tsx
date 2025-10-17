import { generateExamConfig } from "../config/examConfig";
import { ExamData } from "../types/exam";

interface DifficultySelectionProps {
  availableExams: ExamData[];
  onDifficultySelect: (examId: string) => void;
  onBack: () => void;
}

export default function DifficultySelection({
  availableExams,
  onDifficultySelect,
  onBack,
}: DifficultySelectionProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Select Difficulty Level
          </h2>
          <button onClick={onBack} className="btn-secondary">
            ← Back to Exams
          </button>
        </div>

        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Choose the difficulty level for your practice exam.
        </p>

        <div className="grid gap-4 mb-6">
          {availableExams
            .map((exam) => ({ exam, config: generateExamConfig(exam) }))
            .sort((a, b) => a.config.order - b.config.order)
            .map(({ exam, config }) => (
              <div
                key={exam.examId}
                className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 ${config.colorScheme.primary}`}
                onClick={() => onDifficultySelect(exam.examId)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                      {config.displayName}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-3">
                      {config.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`px-3 py-1 text-sm rounded-full ${config.colorScheme.questionTag}`}
                      >
                        {exam.questions.length} Questions
                      </span>
                      <span
                        className={`px-3 py-1 text-sm rounded-full ${config.colorScheme.domainTag}`}
                      >
                        {exam.summary.domains.length} Domain
                        {exam.summary.domains.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                  {config.icon && <div className="text-2xl">{config.icon}</div>}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
