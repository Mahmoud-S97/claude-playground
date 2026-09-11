function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
          Hello from the Todos Home Page
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Your todo list will live here.
        </p>

        {/* TODO: render the real todo list once the backend/API exists. */}
        <div className="mt-8 rounded-2xl border border-dashed border-neutral-300 bg-white p-10 text-center text-sm text-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-500">
          No todos yet — this is just the layout for now.
        </div>
      </div>
    </main>
  )
}

export default HomePage
