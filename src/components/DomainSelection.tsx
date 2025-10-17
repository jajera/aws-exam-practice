import { DomainOption, ExamData } from "../types/exam";
import { getSelectedDomainsCount } from "../utils/examUtils";

interface DomainSelectionProps {
  examData: ExamData;
  domainOptions: DomainOption[];
  onDomainToggle: (domainName: string) => void;
  onStartQuiz: () => void;
  onBack: () => void;
}

export default function DomainSelection({
  examData,
  domainOptions,
  onDomainToggle,
  onStartQuiz,
  onBack,
}: DomainSelectionProps) {
  const selectedCount = getSelectedDomainsCount(domainOptions);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Select Domains for {examData.title}
          </h2>
          <button onClick={onBack} className="btn-secondary">
            ← Back to Difficulty
          </button>
        </div>

        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Choose which domains you want to focus on. All domains are selected by
          default.
        </p>

        <div className="grid gap-4 mb-6">
          {domainOptions.map((domain) => (
            <div
              key={domain.name}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                domain.selected
                  ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                  : "border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500"
              }`}
              onClick={() => onDomainToggle(domain.name)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={domain.selected}
                    onChange={() => onDomainToggle(domain.name)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {domain.name}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {domain.percentage}% of exam
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-3 ml-7">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                  Topics covered:
                </p>
                <div className="flex flex-wrap gap-1">
                  {domain.subcategories.map((subcategory, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded"
                    >
                      {subcategory}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            onClick={onStartQuiz}
            disabled={selectedCount === 0}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start Quiz ({selectedCount} domain{selectedCount !== 1 ? "s" : ""}{" "}
            selected)
          </button>
        </div>
      </div>
    </div>
  );
}
