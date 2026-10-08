import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import FormField from './FormField'
import { MOCK_USER } from '../../mockAuth'

function SignInForm({ onSwitchToSignUp, onAuthenticated }) {
  const { t } = useTranslation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  // Stores whether to show the error, not the translated text itself, so the
  // message re-translates automatically if the language changes while it's visible.
  const [hasError, setHasError] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    // TODO: integrate with the backend, e.g. POST /api/auth/login
    // with { username, password } once the Express/MongoDB API exists.
    // Until then, check against the hard-coded mock account.
    if (username === MOCK_USER.username && password === MOCK_USER.password) {
      setHasError(false)
      onAuthenticated(username)
    } else {
      setHasError(true)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <FormField
        id="signin-username"
        label={t('auth.fields.username')}
        autoComplete="username"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
      />
      <FormField
        id="signin-password"
        label={t('auth.fields.password')}
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />

      {hasError && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {t('auth.signIn.error')}
        </p>
      )}

      <button
        type="submit"
        className="mt-1 w-full rounded-lg bg-purple-600 py-2.5 font-medium text-white transition-colors hover:bg-purple-700 active:bg-purple-800"
      >
        {t('auth.signIn.submit')}
      </button>

      <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
        {t('auth.signIn.noAccount')}{' '}
        <button
          type="button"
          onClick={onSwitchToSignUp}
          className="font-medium text-purple-600 hover:underline dark:text-purple-400"
        >
          {t('auth.signIn.signUpLink')}
        </button>
      </p>
    </form>
  )
}

export default SignInForm
