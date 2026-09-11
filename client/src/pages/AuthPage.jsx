import AuthCard from '../components/auth/AuthCard'

function AuthPage({ onAuthenticated }) {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="flex w-full max-w-md flex-col items-center gap-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
            Welcome to Todo
          </h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Sign in to your account or create a new one
          </p>
        </div>

        <AuthCard onAuthenticated={onAuthenticated} />
      </div>
    </main>
  )
}

export default AuthPage
