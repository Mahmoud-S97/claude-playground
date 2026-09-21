import { useEffect, useState } from 'react'
import ConfirmDeleteDialog from './ConfirmDeleteDialog'
import PriorityButtonGroup from './PriorityButtonGroup'

// <input type="datetime-local"> wants "YYYY-MM-DDTHH:mm", our stored
// dueAt strings carry seconds too.
function toDateTimeLocalValue(dueAt) {
  return dueAt.slice(0, 16)
}

const inputClasses =
  'w-full rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-2 text-sm text-neutral-900 outline-none transition-colors focus:border-transparent focus:ring-2 focus:ring-purple-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white'

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

export default EditTodoModal
