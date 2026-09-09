import Navbar from './components/Navbar'
import { useTheme } from './hooks/useTheme'
import AuthPage from './pages/AuthPage'

function App() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="flex min-h-svh flex-col bg-neutral-50 dark:bg-neutral-950">
      <Navbar theme={theme} onToggleTheme={toggleTheme} />
      <AuthPage />
    </div>
  )
}

export default App
