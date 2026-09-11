import { useState } from 'react'
import FormField from './FormField'

function SignUpForm({ onSwitchToSignIn, onAuthenticated }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    // TODO: integrate with the backend, e.g. POST /api/auth/signup
    // with { username, password } once the Express/MongoDB API exists.
    // Until then, just mock a successful account creation + sign-in.
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setError('')
    onAuthenticated()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <FormField
        id="signup-username"
        label="Username"
        autoComplete="username"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
      />
      <FormField
        id="signup-password"
        label="Password"
        type="password"
        autoComplete="new-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <FormField
        id="signup-confirm-password"
        label="Confirm Password"
        type="password"
        autoComplete="new-password"
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
      />

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="mt-1 w-full rounded-lg bg-purple-600 py-2.5 font-medium text-white transition-colors hover:bg-purple-700 active:bg-purple-800"
      >
        Create Account
      </button>

      <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToSignIn}
          className="font-medium text-purple-600 hover:underline dark:text-purple-400"
        >
          Sign In
        </button>
      </p>
    </form>
  )
}

export default SignUpForm
