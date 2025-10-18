import { AppSettings } from '../types/exam'

interface SettingsPanelProps {
  settings: AppSettings
  onSettingsChange: (settings: AppSettings) => void
  isOpen: boolean
  onClose: () => void
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onSettingsChange,
  isOpen,
  onClose
}) => {
  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    onSettingsChange({ ...settings, theme })
  }

  const handleRandomizeQuestionsChange = (randomize: boolean) => {
    onSettingsChange({ ...settings, randomizeQuestions: randomize })
  }

  const handleRandomizeChoicesChange = (randomize: boolean) => {
    onSettingsChange({ ...settings, randomizeChoices: randomize })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Settings</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Theme Settings */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Theme
            </label>
            <div className="space-y-2">
              {[
                { value: 'system', label: 'System', description: 'Follow system preference' },
                { value: 'light', label: 'Light', description: 'Always use light theme' },
                { value: 'dark', label: 'Dark', description: 'Always use dark theme' }
              ].map((option) => (
                <label key={option.value} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="theme"
                    value={option.value}
                    checked={settings.theme === option.value}
                    onChange={() => handleThemeChange(option.value as 'light' | 'dark' | 'system')}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {option.label}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {option.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Question Order Settings */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Question Order
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="questionOrder"
                  checked={!settings.randomizeQuestions}
                  onChange={() => handleRandomizeQuestionsChange(false)}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    Sequential
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Questions appear in the order listed in the JSON file
                  </div>
                </div>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="questionOrder"
                  checked={settings.randomizeQuestions}
                  onChange={() => handleRandomizeQuestionsChange(true)}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    Random
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Questions appear in random order
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Choice Order Settings */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Answer Choices Order
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="choiceOrder"
                  checked={!settings.randomizeChoices}
                  onChange={() => handleRandomizeChoicesChange(false)}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    Sequential
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Answer choices appear in the order listed in the JSON file
                  </div>
                </div>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="choiceOrder"
                  checked={settings.randomizeChoices}
                  onChange={() => handleRandomizeChoicesChange(true)}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    Random
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Answer choices appear in random order
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="btn-primary"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

export default SettingsPanel
