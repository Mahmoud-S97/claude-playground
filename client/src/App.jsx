import Navbar from './components/layout/Navbar'
import { useAuth } from './hooks/auth/useAuth'
import { useTheme } from './hooks/useTheme'
import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage'

function App() {
  const { theme, toggleTheme } = useTheme()
  const { isAuthenticated, isCheckingSession } = useAuth()

  return (
    <div className="flex min-h-svh flex-col bg-neutral-50 dark:bg-neutral-950">
      <Navbar theme={theme} onToggleTheme={toggleTheme} />
      {isCheckingSession ? (
        <main className="flex-1" aria-busy="true" />
      ) : isAuthenticated ? (
        <HomePage />
      ) : (
        <AuthPage />
      )}
    </div>
  )
}

export default App
