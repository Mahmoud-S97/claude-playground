import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ConfirmDeleteDialog from './ConfirmDeleteDialog'
import PriorityButtonGroup from './PriorityButtonGroup'
import { defaultDueInput } from './todoDraft'

const inputClasses =
  'w-full rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-2 text-sm text-neutral-900 outline-none transition-colors focus:border-transparent focus:ring-2 focus:ring-purple-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white'

// mode "add": a new, unsaved card (no Delete). mode "edit": an existing card.
// `error` is a message to show (usually the server's, already translated).
function TodoModal({ mode = 'edit', draft, onChange, onApply, onDelete, onClose, isSaving = false, error = null }) {
  const { t } = useTranslation()
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
  const isAddMode = mode === 'add'
  const title = isAddMode ? t('editModal.addTitle') : t('editModal.title')
  const dialogLabel = isAddMode
    ? title
    : t('editModal.dialogLabel', { title: draft.title || t('editModal.untitledCard') })

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

  // Typing a title in an empty slot suggests tomorrow 09:00; clearing that title
  // again removes the suggestion (a date the user picked themselves stays).
  function updateSubtaskTitle(index, title) {
    const task = draft.subtasks[index]
    if (title.trim() && !task.dueAt) {
      updateSubtask(index, { title, dueAt: defaultDueInput(), isDateSuggested: true })
    } else if (!title.trim() && !task.id && task.isDateSuggested) {
      updateSubtask(index, { title, dueAt: '', isDateSuggested: false })
    } else {
      updateSubtask(index, { title })
    }
  }

  function confirmDelete() {
    setIsConfirmingDelete(false)
    onDelete()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-neutral-900/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={dialogLabel}
        onClick={(event) => event.stopPropagation()}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900"
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('common.close')}
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
              {t('editModal.cardTitleLabel')}
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
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              {t('editModal.cardPriorityLabel')}
            </span>
            <PriorityButtonGroup
              value={draft.priority}
              onChange={(value) => onChange({ ...draft, priority: value })}
            />
          </div>

          <div className="flex flex-col gap-4">
            {draft.subtasks.map((task, index) => (
              <div key={task.key} className="flex flex-col gap-1.5">
                <label
                  htmlFor={`todo-task-${index}-title`}
                  className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >
                  {t('editModal.taskLabel', { number: index + 1 })}
                </label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    id={`todo-task-${index}-title`}
                    type="text"
                    value={task.title}
                    onChange={(event) => updateSubtaskTitle(index, event.target.value)}
                    className={`sm:flex-1 ${inputClasses}`}
                  />
                  <input
                    id={`todo-task-${index}-due`}
                    type="datetime-local"
                    value={task.dueAt}
                    onChange={(event) => updateSubtask(index, { dueAt: event.target.value, isDateSuggested: false })}
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
              {t('editModal.markFinished')}
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
                className={`absolute top-0.5 start-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  draft.finished ? 'translate-x-5 rtl:-translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {error && (
          <p role="alert" className="mt-5 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
            {error}
          </p>
        )}

        <div className="mt-6 flex items-center gap-3">
          {!isAddMode && (
            <button
              type="button"
              disabled={isSaving}
              onClick={() => setIsConfirmingDelete(true)}
              className="rounded-lg border border-rose-300 px-4 py-2 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-rose-900 dark:text-rose-400 dark:hover:bg-rose-950/50"
            >
              {t('common.delete')}
            </button>
          )}
          <div className="ms-auto flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              {t('common.cancel')}
            </button>
            <button
              type="button"
              disabled={isSaving}
              onClick={onApply}
              className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700 active:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? t('editModal.saving') : t('common.applyChanges')}
            </button>
          </div>
        </div>
      </div>

      {isConfirmingDelete && (
        <ConfirmDeleteDialog onConfirm={confirmDelete} onCancel={() => setIsConfirmingDelete(false)} />
      )}
    </div>
  )
}

export default TodoModal
