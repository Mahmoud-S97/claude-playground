import { useState } from 'react'
import FormField from './FormField'

function SignInForm({ onSwitchToSignUp }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    // TODO: integrate with the backend, e.g. POST /api/auth/login
    // with { username, password } once the Express/MongoDB API exists.
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <FormField
        id="signin-username"
        label="Username"
        autoComplete="username"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
      />
      <FormField
        id="signin-password"
        label="Password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />

      <button
        type="submit"
        className="mt-1 w-full rounded-lg bg-purple-600 py-2.5 font-medium text-white transition-colors hover:bg-purple-700 active:bg-purple-800"
      >
        Sign In
      </button>

      <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
        Don&apos;t have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToSignUp}
          className="font-medium text-purple-600 hover:underline dark:text-purple-400"
        >
          Sign Up
        </button>
      </p>
    </form>
  )
}

export default SignInForm
