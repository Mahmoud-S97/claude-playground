import { createContext, createElement, useCallback, useEffect, useMemo, useState } from 'react'
import * as authApi from '../api/authApi'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
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

  // login/signUp throw ApiError on failure so each form can show its own message.
  // Responses are { code, message, user }.
  const login = useCallback(async (username, password) => {
    const { user: loggedInUser } = await authApi.login(username, password)
    setUser(loggedInUser)
    return loggedInUser
  }, [])

  const signUp = useCallback(async (username, password) => {
    const { user: newUser } = await authApi.signUp(username, password)
    setUser(newUser)
    return newUser
  }, [])

  const logout = useCallback(async () => {
    // Log out locally even if the request fails; the cookie expires on its own.
    await authApi.logout().catch(() => {})
    setUser(null)
  }, [])

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
