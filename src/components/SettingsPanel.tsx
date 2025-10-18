import { useState, useEffect } from 'react'
import { AppSettings } from '../types/exam'
import { getAvailableVoices, speakText, getNarratorSettings, Voice } from '../utils/narratorUtils'

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
  const [availableVoices, setAvailableVoices] = useState<Voice[]>([])
  const [isLoadingVoices, setIsLoadingVoices] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsLoadingVoices(true)
      getAvailableVoices().then(voices => {
        setAvailableVoices(voices)
        setIsLoadingVoices(false)
      }).catch(() => {
        setIsLoadingVoices(false)
      })
    }
  }, [isOpen])

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    onSettingsChange({ ...settings, theme })
  }

  const handleRandomizeQuestionsChange = (randomize: boolean) => {
    onSettingsChange({ ...settings, randomizeQuestions: randomize })
  }

  const handleRandomizeChoicesChange = (randomize: boolean) => {
    onSettingsChange({ ...settings, randomizeChoices: randomize })
  }

  const handleNarratorEnabledChange = (enabled: boolean) => {
    onSettingsChange({ ...settings, narratorEnabled: enabled })
  }

  const handleNarratorVoiceChange = (voice: string) => {
    onSettingsChange({ ...settings, narratorVoice: voice })
  }

  const handleNarratorRateChange = (rate: number) => {
    onSettingsChange({ ...settings, narratorRate: rate })
  }

  const handleNarratorPitchChange = (pitch: number) => {
    onSettingsChange({ ...settings, narratorPitch: pitch })
  }

  const handleTestVoice = async () => {
    const narratorSettings = getNarratorSettings(settings)
    try {
      await speakText("This is a test of the narrator voice. You can adjust the rate and pitch in the settings.", narratorSettings)
    } catch (error) {
      console.error('Failed to test voice:', error)
    }
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

          {/* Narrator Settings */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Question Narrator
            </label>
            <div className="space-y-4">
              {/* Enable/Disable Toggle */}
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settings.narratorEnabled}
                  onChange={(e) => handleNarratorEnabledChange(e.target.checked)}
                  className="text-primary-600 focus:ring-primary-500 rounded"
                />
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    Enable narrator
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Read questions and answer choices aloud
                  </div>
                </div>
              </label>

              {settings.narratorEnabled && (
                <>
                  {/* Voice Selection */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Voice
                    </label>
                    <select
                      value={settings.narratorVoice}
                      onChange={(e) => handleNarratorVoiceChange(e.target.value)}
                      disabled={isLoadingVoices}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Default Voice</option>
                      {availableVoices.map((voice) => (
                        <option key={voice.name} value={voice.name}>
                          {voice.name} ({voice.lang})
                        </option>
                      ))}
                    </select>
                    {isLoadingVoices && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Loading voices...
                      </p>
                    )}
                  </div>

                  {/* Speech Rate */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Speech Rate: {settings.narratorRate}x
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="2.0"
                      step="0.1"
                      value={settings.narratorRate}
                      onChange={(e) => handleNarratorRateChange(parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>0.5x</span>
                      <span>2.0x</span>
                    </div>
                  </div>

                  {/* Speech Pitch */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Speech Pitch: {settings.narratorPitch}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      value={settings.narratorPitch}
                      onChange={(e) => handleNarratorPitchChange(parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>0</span>
                      <span>2</span>
                    </div>
                  </div>

                  {/* Test Button */}
                  <button
                    onClick={handleTestVoice}
                    className="w-full px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 border border-primary-300 dark:border-primary-600 rounded-md hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors duration-200"
                  >
                    🔊 Test Voice
                  </button>
                </>
              )}
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
