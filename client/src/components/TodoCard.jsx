import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getErrorMessage } from '../api/http'
import TodoModal from './TodoModal'
import { todoToDraft } from './todoDraft'

const PRIORITY_STYLES = {
  high: 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
  medium: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  low: 'bg-sky-500/15 text-sky-600 dark:text-sky-400',
}

const PRIORITY_DOT = {
  high: 'bg-rose-500',
  medium: 'bg-amber-500',
  low: 'bg-sky-500',
}

const dueFormatter = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
})

function formatDueAt(dueAt) {
  return dueFormatter.format(new Date(dueAt))
}

// Shows one card from the server. Changes go through the callbacks
// (from useTodos); the card itself only holds the open modal's form state.
function TodoCard({ todo, onToggleSubtask, onSave, onDelete }) {
  const { t } = useTranslation()
  const { title, priority, subtasks } = todo
  const [draft, setDraft] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)

  const isFinished = subtasks.every((task) => task.completed)
  const doneCount = subtasks.filter((task) => task.completed).length

  function toggleTask(event, subtaskId) {
    event.stopPropagation()
    onToggleSubtask(todo, subtaskId)
  }

  function openModal() {
    setSaveError(null)
    setDraft(todoToDraft(todo))
  }

  function closeModal() {
    setDraft(null)
  }

  // Keeps the modal open with the server's message if the request fails.
  async function runAndClose(action) {
    setIsSaving(true)
    setSaveError(null)
    try {
      await action()
      setDraft(null)
    } catch (error) {
      setSaveError(getErrorMessage(error, t))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={openModal}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            openModal()
          }
        }}
        className={`cursor-pointer rounded-2xl border border-white/60 bg-white/50 p-4 transition-shadow
          shadow-[0_8px_30px_rgba(15,15,25,0.10),inset_0_1px_0_rgba(255,255,255,0.6)]
          backdrop-blur-xl backdrop-saturate-150 hover:shadow-[0_10px_36px_rgba(15,15,25,0.16),inset_0_1px_0_rgba(255,255,255,0.6)]
          dark:border-white/10 dark:bg-white/[0.06]
          dark:shadow-[0_8px_30px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.08)]
          ${isFinished ? 'ring-1 ring-emerald-400/50 dark:ring-emerald-400/30' : ''}`}
      >
        <div className="mb-1 flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <span
              title={t('todoCard.priorityTitle', { priority: t(`priority.${priority}`) })}
              className={`h-2 w-2 flex-shrink-0 rounded-full ${PRIORITY_DOT[priority]}`}
            />
            <h3 className="min-w-0 flex-1 truncate text-sm font-semibold text-neutral-900 dark:text-white">
              {title}
            </h3>
          </div>
          <span
            className={`flex-shrink-0 rounded-full px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide ${
              isFinished
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                : 'bg-neutral-500/10 text-neutral-500 dark:text-neutral-400'
            }`}
          >
            {isFinished ? t('todoCard.finished') : `${doneCount}/${subtasks.length}`}
          </span>
        </div>

        <div className="divide-y divide-neutral-900/10 dark:divide-white/10">
          {subtasks.map((task) => (
            <div key={task.id} className="flex items-center gap-3 py-3 first:pt-2.5 last:pb-0">
              <button
                type="button"
                aria-pressed={task.completed}
                aria-label={t(task.completed ? 'todoCard.markNotDone' : 'todoCard.markDone', {
                  title: task.title,
                })}
                onClick={(event) => toggleTask(event, task.id)}
                className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full transition-colors ${
                  task.completed
                    ? 'bg-emerald-500 shadow-[0_2px_8px_rgba(16,185,129,0.45)]'
                    : 'cursor-pointer border-[1.5px] border-neutral-400/70 bg-white/10 hover:border-neutral-500 dark:border-white/20 dark:hover:border-white/40'
                }`}
              >
                {task.completed && (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3 w-3"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                )}
              </button>

              <span
                className={`min-w-0 flex-1 truncate text-sm font-medium ${
                  task.completed
                    ? 'text-neutral-400 line-through decoration-neutral-300 dark:text-neutral-500 dark:decoration-neutral-600'
                    : 'text-neutral-900 dark:text-white'
                }`}
              >
                {task.title}
              </span>

              <span className="flex flex-shrink-0 items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide ${PRIORITY_STYLES[task.priority]}`}
                >
                  {t(`priority.${task.priority}`)}
                </span>
                <span className="flex items-center gap-1 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-3 w-3 flex-shrink-0"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <path d="M3 10h18M8 2v4M16 2v4" />
                  </svg>
                  {formatDueAt(task.dueAt)}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {draft && (
        <TodoModal
          draft={draft}
          onChange={setDraft}
          onApply={() => runAndClose(() => onSave(todo, draft))}
          onDelete={() => runAndClose(() => onDelete(todo.id))}
          onClose={closeModal}
          isSaving={isSaving}
          error={saveError}
        />
      )}
    </>
  )
}

export default TodoCard
