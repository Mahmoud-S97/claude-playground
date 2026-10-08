import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import FormField from './FormField'

function SignUpForm({ onSwitchToSignIn, onAuthenticated }) {
  const { t } = useTranslation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  // Stores whether to show the error, not the translated text itself, so the
  // message re-translates automatically if the language changes while it's visible.
  const [hasError, setHasError] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    // TODO: integrate with the backend, e.g. POST /api/auth/signup
    // with { username, password } once the Express/MongoDB API exists.
    // Until then, just mock a successful account creation + sign-in.
    if (password !== confirmPassword) {
      setHasError(true)
      return
    }

    setHasError(false)
    onAuthenticated(username)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <FormField
        id="signup-username"
        label={t('auth.fields.username')}
        autoComplete="username"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
      />
      <FormField
        id="signup-password"
        label={t('auth.fields.password')}
        type="password"
        autoComplete="new-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <FormField
        id="signup-confirm-password"
        label={t('auth.fields.confirmPassword')}
        type="password"
        autoComplete="new-password"
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
      />

      {hasError && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {t('auth.signUp.passwordMismatch')}
        </p>
      )}

      <button
        type="submit"
        className="mt-1 w-full rounded-lg bg-purple-600 py-2.5 font-medium text-white transition-colors hover:bg-purple-700 active:bg-purple-800"
      >
        {t('auth.signUp.submit')}
      </button>

      <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
        {t('auth.signUp.hasAccount')}{' '}
        <button
          type="button"
          onClick={onSwitchToSignIn}
          className="font-medium text-purple-600 hover:underline dark:text-purple-400"
        >
          {t('auth.signUp.signInLink')}
        </button>
      </p>
    </form>
  )
}

export default SignUpForm
