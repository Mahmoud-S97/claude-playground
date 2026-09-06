import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-white px-4 text-center text-neutral-900">
      <div className="flex items-center gap-4">
        <img src={viteLogo} className="h-16 w-16" alt="Vite logo" />
        <img src={reactLogo} className="h-16 w-16" alt="React logo" />
      </div>

      <h1 className="text-4xl font-semibold tracking-tight">
        Tailwind is wired up 🎉
      </h1>
      <p className="max-w-md text-neutral-600">
        This page is styled entirely with Tailwind utility classes, no custom
        CSS. Edit <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-sm">src/App.jsx</code> and save to test{' '}
        <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-sm">HMR</code>.
      </p>

      <button
        type="button"
        onClick={() => setCount((count) => count + 1)}
        className="rounded-md bg-purple-600 px-5 py-2.5 font-medium text-white transition-colors hover:bg-purple-700 active:bg-purple-800"
      >
        Count is {count}
      </button>
    </div>
  )
}

export default App
