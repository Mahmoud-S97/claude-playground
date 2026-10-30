import { createContext, createElement, useCallback, useEffect, useMemo, useState } from 'react'
import * as authApi from '../api/authApi'
import { useToast } from '../hooks/toast/useToast'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const { showToast } = useToast()
  const [user, setUser] = useState(null)
  const [isCheckingSession, setIsCheckingSession] = useState(true)

  // Restore the session from the httpOnly cookie on first load.
  useEffect(() => {
    let ignore = false
    authApi
      .getCurrentUser()
      .then((currentUser) => {
        if (!ignore) setUser(currentUser)
      })
      .catch(() => {
        if (!ignore) setUser(null)
      })
      .finally(() => {
        if (!ignore) setIsCheckingSession(false)
      })
    return () => {
      ignore = true
    }
  }, [])

  // login/signUp throw ApiError on failure so each form can show the server's
  // message. On success, responses are { code, message, user }.
  const login = useCallback(
    async (username, password) => {
      const { user: loggedInUser, message } = await authApi.login(username, password)
      setUser(loggedInUser)
      showToast(message)
      return loggedInUser
    },
    [showToast],
  )

  const signUp = useCallback(
    async (username, password) => {
      const { user: newUser, message } = await authApi.signUp(username, password)
      setUser(newUser)
      showToast(message)
      return newUser
    },
    [showToast],
  )

  const logout = useCallback(async () => {
    // Log out locally even if the request fails; the cookie expires on its own.
    const response = await authApi.logout().catch(() => null)
    setUser(null)
    showToast(response?.message)
  }, [showToast])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      isCheckingSession,
      login,
      signUp,
      logout,
    }),
    [user, isCheckingSession, login, signUp, logout],
  )

  // Plain createElement because this is a .js file (Vite only compiles JSX in .jsx).
  return createElement(AuthContext.Provider, { value }, children)
}
