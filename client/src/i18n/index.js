import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ar from './ar.json'
import en from './en.json'

const STORAGE_KEY = 'lang'
const SUPPORTED_LANGUAGES = ['en', 'ar']
const FALLBACK_LANGUAGE = 'en'

function getPreferredLanguage() {
  const stored = localStorage.getItem(STORAGE_KEY)
  return SUPPORTED_LANGUAGES.includes(stored) ? stored : FALLBACK_LANGUAGE
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar },
  },
  lng: getPreferredLanguage(),
  fallbackLng: FALLBACK_LANGUAGE,
  supportedLngs: SUPPORTED_LANGUAGES,
  interpolation: {
    escapeValue: false,
  },
})

i18n.on('languageChanged', (language) => {
  localStorage.setItem(STORAGE_KEY, language)
})

export default i18n
