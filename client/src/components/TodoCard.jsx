import { useEffect, useState } from 'react'

const PRIORITY_ORDER = ['low', 'medium', 'high']

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

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low', activeClass: 'bg-sky-500 text-white shadow-sm', idleClass: 'bg-sky-500/10 text-sky-600 hover:bg-sky-500/20 dark:text-sky-400' },
  { value: 'medium', label: 'Medium', activeClass: 'bg-amber-500 text-white shadow-sm', idleClass: 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 dark:text-amber-400' },
  { value: 'high', label: 'High', activeClass: 'bg-rose-500 text-white shadow-sm', idleClass: 'bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 dark:text-rose-400' },
]

const dueFormatter = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
})

function formatDueAt(dueAt) {
  return dueFormatter.format(new Date(dueAt))
}

// <input type="datetime-local"> wants "YYYY-MM-DDTHH:mm", our stored
// dueAt strings carry seconds too.
function toDateTimeLocalValue(dueAt) {
  return dueAt.slice(0, 16)
}

const inputClasses =
  'w-full rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-2 text-sm text-neutral-900 outline-none transition-colors focus:border-transparent focus:ring-2 focus:ring-purple-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white'

function PriorityButtonGroup({ value, onChange }) {
  return (
    <div className="flex gap-2">
      {PRIORITY_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors ${
            value === option.value ? option.activeClass : option.idleClass
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

function ConfirmDeleteDialog({ onConfirm, onCancel }) {
  return (
    <div
      className="fixed inset-0 z-[60] flex h-full w-full items-center justify-center bg-neutral-900/70 p-4"
      onClick={onCancel}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-label="Confirm delete"
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900"
      >
        <h3 className="text-base font-semibold text-neutral-900 dark:text-white">Delete this todo card?</h3>
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
          This removes the card and all 3 tasks. This can&apos;t be undone.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-700 active:bg-rose-800"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  )
}

function EditTodoModal({ draft, onChange, onApply, onDelete, onClose }) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key !== 'Escape') return
      if (isConfirmingDelete) setIsConfirmingDelete(false)
      else onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose, isConfirmingDelete])

  function updateSubtask(index, changes) {
    onChange({
      ...draft,
      subtasks: draft.subtasks.map((task, i) => (i === index ? { ...task, ...changes } : task)),
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-neutral-900/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Edit ${draft.title || 'todo card'}`}
        onClick={(event) => event.stopPropagation()}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900"
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Edit todo card</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="todo-card-title" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Card title
            </label>
            <input
              id="todo-card-title"
              type="text"
              value={draft.title}
              onChange={(event) => onChange({ ...draft, title: event.target.value })}
              className={inputClasses}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Card-Level Priority</span>
            <PriorityButtonGroup
              value={draft.priority}
              onChange={(value) => onChange({ ...draft, priority: value })}
            />
          </div>

          <div className="flex flex-col gap-4">
            {draft.subtasks.map((task, index) => (
              <div key={task.id} className="flex flex-col gap-1.5">
                <label
                  htmlFor={`todo-task-${index}-title`}
                  className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >
                  Task {index + 1}
                </label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    id={`todo-task-${index}-title`}
                    type="text"
                    value={task.title}
                    onChange={(event) => updateSubtask(index, { title: event.target.value })}
                    className={`sm:flex-1 ${inputClasses}`}
                  />
                  <input
                    id={`todo-task-${index}-due`}
                    type="datetime-local"
                    value={toDateTimeLocalValue(task.dueAt)}
                    onChange={(event) => updateSubtask(index, { dueAt: `${event.target.value}:00` })}
                    className={`sm:w-56 [color-scheme:light] dark:[color-scheme:dark] ${inputClasses}`}
                  />
                </div>
                <PriorityButtonGroup
                  value={task.priority}
                  onChange={(value) => updateSubtask(index, { priority: value })}
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between rounded-lg bg-neutral-100 px-4 py-3 dark:bg-neutral-800">
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Mark card as Finished
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={draft.finished}
              onClick={() => onChange({ ...draft, finished: !draft.finished })}
              className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors ${
                draft.finished ? 'bg-emerald-500' : 'bg-neutral-300 dark:bg-neutral-600'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  draft.finished ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setIsConfirmingDelete(true)}
            className="rounded-lg border border-rose-300 px-4 py-2 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 dark:border-rose-900 dark:text-rose-400 dark:hover:bg-rose-950/50"
          >
            Delete
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onApply}
              className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700 active:bg-purple-800"
            >
              Apply Changes
            </button>
          </div>
        </div>
      </div>

      {isConfirmingDelete && (
        <ConfirmDeleteDialog onConfirm={onDelete} onCancel={() => setIsConfirmingDelete(false)} />
      )}
    </div>
  )
}

function TodoCard({ todo }) {
  const [title, setTitle] = useState(todo.title)
  const [priority, setPriority] = useState(todo.priority)
  const [subtasks, setSubtasks] = useState(() =>
    [...todo.subtasks].sort(
      (a, b) => PRIORITY_ORDER.indexOf(a.priority) - PRIORITY_ORDER.indexOf(b.priority),
    ),
  )
  const [isDeleted, setIsDeleted] = useState(false)
  const [draft, setDraft] = useState(null)

  const isFinished = subtasks.every((task) => task.completed)
  const doneCount = subtasks.filter((task) => task.completed).length

  if (isDeleted) return null

  function toggleTask(event, index) {
    event.stopPropagation()
    setSubtasks((current) => {
      const next = current.map((task) => ({ ...task }))
      next[index].completed = !next[index].completed
      return next
    })
  }

  function openModal() {
    setDraft({
      title,
      priority,
      subtasks: subtasks.map((task) => ({ ...task })),
      finished: isFinished,
    })
  }

  function closeModal() {
    setDraft(null)
  }

  function applyChanges() {
    setTitle(draft.title)
    setPriority(draft.priority)
    setSubtasks(draft.subtasks.map((task) => ({ ...task, completed: draft.finished })))
    setDraft(null)
  }

  function handleDelete() {
    setIsDeleted(true)
    setDraft(null)
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
              title={`${priority} priority`}
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
            {isFinished ? 'Finished' : `${doneCount}/${subtasks.length}`}
          </span>
        </div>

        <div className="divide-y divide-neutral-900/10 dark:divide-white/10">
          {subtasks.map((task, index) => (
            <div key={task.id} className="flex items-center gap-3 py-3 first:pt-2.5 last:pb-0">
              <button
                type="button"
                aria-pressed={task.completed}
                aria-label={`Mark "${task.title}" as ${task.completed ? 'not done' : 'done'}`}
                onClick={(event) => toggleTask(event, index)}
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
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide capitalize ${PRIORITY_STYLES[task.priority]}`}
                >
                  {task.priority}
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
        <EditTodoModal
          draft={draft}
          onChange={setDraft}
          onApply={applyChanges}
          onDelete={handleDelete}
          onClose={closeModal}
        />
      )}
    </>
  )
}

export default TodoCard
