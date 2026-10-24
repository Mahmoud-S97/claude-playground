import { useEffect, useState } from 'react'
import { getCurrentUser, logout } from './api/authApi'
import Navbar from './components/layout/Navbar'
import { useTheme } from './hooks/useTheme'
import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage'

function App() {
  const { theme, toggleTheme } = useTheme()
  // No "full name" field yet — until signup collects one, the username
  // doubles as the display name.
  const [username, setUsername] = useState(null)
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const isAuthenticated = username !== null

  useEffect(() => {
    let ignore = false
    getCurrentUser()
      .then((user) => {
        if (!ignore) setUsername(user?.username ?? null)
      })
      .catch(() => {
        if (!ignore) setUsername(null)
      })
      .finally(() => {
        if (!ignore) setIsCheckingSession(false)
      })
    return () => {
      ignore = true
    }
  }, [])

  async function handleLogout() {
    // Log out locally even if the request fails; the cookie expires on its own.
    await logout().catch(() => {})
    setUsername(null)
  }

  return (
    <div className="flex min-h-svh flex-col bg-neutral-50 dark:bg-neutral-950">
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />
      {isCheckingSession ? (
        <main className="flex-1" aria-busy="true" />
      ) : isAuthenticated ? (
        <HomePage username={username} />
      ) : (
        <AuthPage onAuthenticated={setUsername} />
      )}
    </div>
  )
}

export default App
