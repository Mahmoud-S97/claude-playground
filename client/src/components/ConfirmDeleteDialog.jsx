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

export default ConfirmDeleteDialog
