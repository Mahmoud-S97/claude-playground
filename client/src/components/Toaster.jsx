import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const AUTO_DISMISS_MS = 4000

const VARIANT_STYLES = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200',
  error: 'border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-200',
}

function Toast({ toast, onDismiss }) {
  const { t } = useTranslation()

  useEffect(() => {
    const timeoutId = setTimeout(() => onDismiss(toast.id), AUTO_DISMISS_MS)
    return () => clearTimeout(timeoutId)
  }, [toast.id, onDismiss])

  return (
    <div
      role={toast.variant === 'error' ? 'alert' : 'status'}
      className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border px-4 py-3 text-sm font-medium shadow-lg ${VARIANT_STYLES[toast.variant]}`}
    >
      <p className="flex-1">{toast.message}</p>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label={t('common.close')}
        className="-m-1 flex h-6 w-6 flex-shrink-0 cursor-pointer items-center justify-center rounded-full opacity-60 transition-opacity hover:opacity-100"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-3.5 w-3.5">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

// Stacked under the navbar, above modals, so messages stay visible.
function Toaster({ toasts, onDismiss }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-20 z-[70] flex flex-col items-center gap-2 px-4">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  )
}

export default Toaster
