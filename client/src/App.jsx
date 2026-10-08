import { useState } from 'react'
import Navbar from './components/layout/Navbar'
import { useTheme } from './hooks/useTheme'
import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage'

function App() {
  const { theme, toggleTheme } = useTheme()
  // Hard-coded auth flag (no backend yet) — flips Auth-Page <-> Home-Page.
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  // No "full name" field yet — until signup collects one, the username
  // entered at sign-in/sign-up doubles as the display name.
  const [username, setUsername] = useState('')

  function handleAuthenticated(enteredUsername) {
    setUsername(enteredUsername)
    setIsAuthenticated(true)
  }

  function handleLogout() {
    setIsAuthenticated(false)
    setUsername('')
  }

  return (
    <div className="flex min-h-svh flex-col bg-neutral-50 dark:bg-neutral-950">
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />
      {isAuthenticated ? (
        <HomePage username={username} />
      ) : (
        <AuthPage onAuthenticated={handleAuthenticated} />
      )}
    </div>
  )
}

export default App
