import { useEffect, useState } from 'react'

const STORAGE_KEY = 'theme'

function getPreferredTheme() {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

/**
 * Tracks light/dark theme, applies the `dark` class to <html> (which the
 * `@custom-variant dark` in index.css hooks into for Tailwind's `dark:`
 * utilities), and persists the choice in localStorage.
 */
export function useTheme() {
  const [theme, setTheme] = useState(getPreferredTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  const toggleTheme = () =>
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))

  return { theme, toggleTheme }
}
