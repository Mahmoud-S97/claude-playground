import { useState } from 'react'
import Navbar from './components/Navbar'
import { useTheme } from './hooks/useTheme'
import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage'

function App() {
  const { theme, toggleTheme } = useTheme()
  // Hard-coded auth flag (no backend yet) — flips Auth-Page <-> Home-Page.
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  return (
    <div className="flex min-h-svh flex-col bg-neutral-50 dark:bg-neutral-950">
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        isAuthenticated={isAuthenticated}
        onLogout={() => setIsAuthenticated(false)}
      />
      {isAuthenticated ? (
        <HomePage />
      ) : (
        <AuthPage onAuthenticated={() => setIsAuthenticated(true)} />
      )}
    </div>
  )
}

export default App
