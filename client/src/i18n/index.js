import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ar from './ar.json'
import en from './en.json'

const STORAGE_KEY = 'lang'
const SUPPORTED_LANGUAGES = ['en', 'ar']
const FALLBACK_LANGUAGE = 'en'
const RTL_LANGUAGES = ['ar']

function getPreferredLanguage() {
  const stored = localStorage.getItem(STORAGE_KEY)
  return SUPPORTED_LANGUAGES.includes(stored) ? stored : FALLBACK_LANGUAGE
}

// Keeps <html dir="rtl|ltr" lang="..."> in sync with the active language, so
// the whole document mirrors for Arabic (Tailwind's rtl:/ltr: variants key
// off this attribute) and assistive tech/browsers know its language.
function applyDocumentDirection(language) {
  document.documentElement.dir = RTL_LANGUAGES.includes(language) ? 'rtl' : 'ltr'
  document.documentElement.lang = language
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

applyDocumentDirection(i18n.language)

i18n.on('languageChanged', (language) => {
  localStorage.setItem(STORAGE_KEY, language)
  applyDocumentDirection(language)
})

export default i18n
