import { createContext, createElement, Fragment, useCallback, useMemo, useState } from 'react'
import Toaster from '../components/Toaster'

export const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  // variant: "success" | "error". Messages usually come straight from the API,
  // already in the user's language.
  const showToast = useCallback((message, variant = 'success') => {
    if (!message) return
    setToasts((current) => [...current, { id: crypto.randomUUID(), message, variant }])
  }, [])

  const value = useMemo(() => ({ showToast }), [showToast])

  // Plain createElement because this is a .js file (Vite only compiles JSX in .jsx).
  return createElement(
    ToastContext.Provider,
    { value },
    createElement(Fragment, null, children, createElement(Toaster, { toasts, onDismiss: dismissToast })),
  )
}
