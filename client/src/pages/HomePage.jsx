import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getErrorMessage } from '../api/http'
import FloatingActionButton from '../components/FloatingActionButton'
import PlusIcon from '../components/icons/PlusIcon'
import TodoCard from '../components/TodoCard'
import TodoModal from '../components/TodoModal'
import { createEmptyTodoDraft } from '../components/todoDraft'
import { useAuth } from '../hooks/auth/useAuth'
import { useTodos } from '../hooks/todos/useTodos'
import { useTypewriter } from '../hooks/useTypewriter'

const SUBTITLE_ROTATE_MS = 7000

// No "full name" field at signup yet — capitalize the username so it reads
// like a real name until that's collected.
function capitalize(value) {
  if (!value) return value
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function HomePage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const username = user?.username
  const { todos, isLoading, loadError, loadTodos, createTodo, saveTodo, deleteTodo, toggleSubtask } =
    useTodos()
  const [newTodoDraft, setNewTodoDraft] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [createError, setCreateError] = useState(null)
  const [subtitleIndex, setSubtitleIndex] = useState(0)

  function openAddModal() {
    setCreateError(null)
    setNewTodoDraft(createEmptyTodoDraft())
  }

  // Keeps the modal open with the server's message if creating fails.
  async function addTodo() {
    setIsCreating(true)
    setCreateError(null)
    try {
      await createTodo(newTodoDraft)
      setNewTodoDraft(null)
    } catch (error) {
      setCreateError(getErrorMessage(error, t))
    } finally {
      setIsCreating(false)
    }
  }

  const subtitles = t('home.subtitles', { returnObjects: true })
  const subtitleCount = subtitles.length

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSubtitleIndex((current) => (current + 1) % subtitleCount)
    }, SUBTITLE_ROTATE_MS)
    return () => clearInterval(intervalId)
  }, [subtitleCount])

  const subtitle = subtitles[subtitleIndex % subtitleCount]
  const typedSubtitle = useTypewriter(subtitle)

  return (
    <main className="flex flex-1 flex-col items-center pt-12 pb-28">
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
            {username && (
              <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                {t('home.greeting', { name: capitalize(username) })}
              </p>
            )}
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
              {t('home.headline')}
            </h1>
            <p
              aria-label={subtitle}
              className="mt-2 min-h-[1.5em] text-sm text-neutral-600 dark:text-neutral-300 sm:text-base"
            >
              <span aria-hidden="true">{typedSubtitle}</span>
              <span
                aria-hidden="true"
                className="ms-0.5 inline-block animate-pulse text-purple-500 dark:text-purple-400"
              >
                ▍
              </span>
            </p>
          </div>
        </section>

        <div className="mt-8">
          {isLoading ? (
            <p role="status" className="py-16 text-center text-sm text-neutral-500 dark:text-neutral-400">
              {t('home.loading')}
            </p>
          ) : loadError ? (
            <div role="alert" className="flex flex-col items-center gap-3 py-16 text-center">
              <p className="text-sm text-rose-600 dark:text-rose-400">{loadError}</p>
              <button
                type="button"
                onClick={loadTodos}
                className="cursor-pointer rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                {t('home.retry')}
              </button>
            </div>
          ) : todos.length === 0 ? (
            <p className="py-16 text-center text-sm text-neutral-500 dark:text-neutral-400">{t('home.empty')}</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {todos.map((todo) => (
                <TodoCard
                  key={todo.id}
                  todo={todo}
                  onToggleSubtask={toggleSubtask}
                  onSave={saveTodo}
                  onDelete={deleteTodo}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <FloatingActionButton label={t('home.addTodo')} onClick={openAddModal}>
        <PlusIcon className="h-7 w-7" />
      </FloatingActionButton>

      {newTodoDraft && (
        <TodoModal
          mode="add"
          draft={newTodoDraft}
          onChange={setNewTodoDraft}
          onApply={addTodo}
          onClose={() => setNewTodoDraft(null)}
          isSaving={isCreating}
          error={createError}
        />
      )}
    </main>
  )
}

export default HomePage
