import { AppSettings } from '../types/exam'

export function getSystemTheme(): 'light' | 'dark' {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return 'light'
}

export function applyTheme(theme: AppSettings['theme']) {
  const root = document.documentElement
  const actualTheme = theme === 'system' ? getSystemTheme() : theme
  
  if (actualTheme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

export function getInitialSettings(): AppSettings {
  if (typeof window === 'undefined') {
    return {
      theme: 'system',
      randomizeQuestions: false,
      randomizeChoices: false
    }
  }

  const saved = localStorage.getItem('appSettings')
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch (error) {
      console.error('Failed to parse saved settings:', error)
    }
  }

  return {
    theme: 'system',
    randomizeQuestions: false,
    randomizeChoices: false
  }
}

export function saveSettings(settings: AppSettings) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('appSettings', JSON.stringify(settings))
  }
}
