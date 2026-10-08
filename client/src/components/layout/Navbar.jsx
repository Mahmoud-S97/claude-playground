import { useTranslation } from 'react-i18next'
import LanguageSelector from '../i18n/LanguageSelector'
import Logo from '../Logo'
import ThemeToggle from '../theme/ThemeToggle'

function Navbar({ theme, onToggleTheme, isAuthenticated, onLogout }) {
  const { t } = useTranslation()

  return (
    <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/80 backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-950/80">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          {isAuthenticated && (
            <button
              type="button"
              onClick={onLogout}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white"
            >
              {t('nav.logout')}
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
