import { useState } from "react";

interface SavedExam {
  id: string;
  examId: string;
  difficulty: string;
  title: string;
  startTime: number;
  lastSaved: number;
  progress: {
    answered: number;
    total: number;
    percentage: number;
  };
}

interface ExamSelectorProps {
  onExamSelect: (examId: string) => void;
  onResumeExam?: (examSessionId?: string) => void;
  onClearAllExams?: () => void;
  savedExams?: SavedExam[];
  hasSavedExam?: boolean;
}

const availableExams = [
  {
    id: "saa-c03",
    title: "AWS Certified Solutions Architect – Associate (SAA-C03)",
    description:
      "Design resilient, high-performing, secure, and cost-optimized AWS solutions",
  },
];

const ExamSelector: React.FC<ExamSelectorProps> = ({
  onExamSelect,
  onResumeExam,
  onClearAllExams,
  savedExams = [],
}) => {
  const [selectedExam, setSelectedExam] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleStartExam = async () => {
    if (!selectedExam) return;

    setIsLoading(true);
    try {
      await onExamSelect(selectedExam);
    } catch (error) {
      console.error("Error starting exam:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6">
          Select an Exam
        </h2>

        {savedExams.length > 0 && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-blue-900 dark:text-blue-100">
                Saved Exams
              </h3>
              <button
                onClick={onClearAllExams}
                className="px-3 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded transition-colors duration-200"
              >
                Clear All
              </button>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
              You have {savedExams.length} saved exam
              {savedExams.length !== 1 ? "s" : ""} in progress.
            </p>
            <div className="space-y-3">
              {savedExams.map((exam) => (
                <div
                  key={exam.id}
                  className="flex items-center justify-between p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg border border-blue-100 dark:border-blue-600"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-900 dark:text-white text-sm">
                      {exam.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      {exam.difficulty} • {exam.progress.answered}/
                      {exam.progress.total} questions (
                      {exam.progress.percentage}%)
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                      Last saved: {new Date(exam.lastSaved).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => onResumeExam?.(exam.id)}
                    className="ml-4 px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors duration-200"
                  >
                    Resume
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          {availableExams.map((exam) => (
            <div
              key={exam.id}
              className={`exam-card ${
                selectedExam === exam.id
                  ? "exam-card-selected"
                  : "exam-card-unselected"
              }`}
              onClick={() => setSelectedExam(exam.id)}
            >
              <div className="flex items-start space-x-3">
                <input
                  type="radio"
                  name="exam"
                  value={exam.id}
                  checked={selectedExam === exam.id}
                  onChange={() => setSelectedExam(exam.id)}
                  className="mt-1 text-primary-600 focus:ring-primary-500"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white">
                    {exam.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">
                    {exam.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={handleStartExam}
            disabled={!selectedExam || isLoading}
            className={`btn-primary px-8 py-3 text-lg ${
              !selectedExam || isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Loading..." : "Start Exam"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamSelector;
