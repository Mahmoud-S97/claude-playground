import { useEffect, useState } from 'react'
import TodoCard from '../components/TodoCard'
import mockData from '../../mock-data/data.json'

const MOTIVATION_SUBTITLES = [
  'One task at a time — every box you check moves you closer to a done day.',
  "Progress isn't loud — it's just today's list, finished one item at a time.",
  'Future you is built by what you finish today, not what you plan for tomorrow.',
]

const SUBTITLE_ROTATE_MS = 7000

// Reveals `text` one character at a time, like a terminal typing out a command.
function useTypewriter(text, speedMs = 35) {
  const [output, setOutput] = useState('')

  useEffect(() => {
    let charCount = 0
    const intervalId = setInterval(() => {
      charCount += 1
      setOutput(text.slice(0, charCount))
      if (charCount >= text.length) clearInterval(intervalId)
    }, speedMs)

    return () => clearInterval(intervalId)
  }, [text, speedMs])

  return output
}

function HomePage() {
  const { todos } = mockData
  const [subtitleIndex, setSubtitleIndex] = useState(0)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSubtitleIndex((current) => (current + 1) % MOTIVATION_SUBTITLES.length)
    }, SUBTITLE_ROTATE_MS)
    return () => clearInterval(intervalId)
  }, [])

  const subtitle = MOTIVATION_SUBTITLES[subtitleIndex]
  const typedSubtitle = useTypewriter(subtitle)

  return (
    <main className="flex flex-1 flex-col items-center py-12">
      <div className="w-full max-w-5xl px-4">
        <section
          className="relative overflow-hidden rounded-2xl border border-white/60 bg-gradient-to-br from-purple-100 via-sky-50 to-rose-50 px-6 py-8
            shadow-[0_8px_30px_rgba(15,15,25,0.10),inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-xl backdrop-saturate-150
            dark:border-white/10 dark:from-purple-950/40 dark:via-neutral-950 dark:to-neutral-950
            dark:shadow-[0_8px_30px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.08)]
            sm:px-10 sm:py-10"
        >
          <div
            aria-hidden="true"
            className="absolute -top-24 -left-10 h-64 w-64 rounded-full bg-purple-300/30 blur-3xl dark:bg-purple-600/20"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-sky-300/30 blur-3xl dark:bg-sky-600/10"
          />

          <div className="relative">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
              Finish today. Own tomorrow.
            </h1>
            <p
              aria-label={subtitle}
              className="mt-2 min-h-[1.5em] text-sm text-neutral-600 dark:text-neutral-300 sm:text-base"
            >
              <span aria-hidden="true">{typedSubtitle}</span>
              <span
                aria-hidden="true"
                className="ml-0.5 inline-block animate-pulse text-purple-500 dark:text-purple-400"
              >
                ▍
              </span>
            </p>
          </div>
        </section>

        <div className="mt-8">
          {/* TODO: render the real todo list once the backend/API exists. */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {todos.map((todo) => (
              <TodoCard key={todo.id} todo={todo} />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

export default HomePage
