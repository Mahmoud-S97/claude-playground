import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ApiError, signUp } from '../../api/authApi'
import FormField from './FormField'
import { isValidPassword, MAX_FIELD_LENGTH, USERNAME_PATTERN } from './validation'

function SignUpForm({ onSwitchToSignIn, onAuthenticated }) {
  const { t } = useTranslation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  // Stores which message to show, not the translated text itself, so it
  // re-translates automatically if the language changes while it's visible.
  const [errorKey, setErrorKey] = useState(null)

  const handleSubmit = async (event) => {
    event.preventDefault()

    const trimmedUsername = username.trim()
    const trimmedPassword = password.trim()
    const trimmedConfirmPassword = confirmPassword.trim()

    if (!USERNAME_PATTERN.test(trimmedUsername)) {
      setErrorKey('auth.signUp.usernameInvalid')
      return
    }

    if (!isValidPassword(trimmedPassword)) {
      setErrorKey('auth.signUp.passwordInvalid')
      return
    }

    if (trimmedPassword !== trimmedConfirmPassword) {
      setErrorKey('auth.signUp.passwordMismatch')
      return
    }

    setErrorKey(null)
    setIsSubmitting(true)
    try {
      await signUp(trimmedUsername, trimmedPassword)
      onAuthenticated(trimmedUsername)
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        setErrorKey('auth.signUp.usernameTaken')
      } else {
        setErrorKey('auth.signUp.serverError')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <FormField
        id="signup-username"
        label={t('auth.fields.username')}
        autoComplete="username"
        maxLength={MAX_FIELD_LENGTH}
        value={username}
        onChange={(event) => setUsername(event.target.value)}
      />
      <FormField
        id="signup-password"
        label={t('auth.fields.password')}
        type="password"
        autoComplete="new-password"
        maxLength={MAX_FIELD_LENGTH}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <FormField
        id="signup-confirm-password"
        label={t('auth.fields.confirmPassword')}
        type="password"
        autoComplete="new-password"
        maxLength={MAX_FIELD_LENGTH}
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
      />

      {errorKey && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {t(errorKey)}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-1 w-full rounded-lg bg-purple-600 py-2.5 font-medium text-white transition-colors hover:bg-purple-700 active:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? t('auth.signUp.submitting') : t('auth.signUp.submit')}
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
