/**
 * App logo: a "T" letter mark in a rounded gradient badge, plus wordmark.
 * Pure markup/CSS (no image asset), so it scales cleanly at any size.
 */
function Logo({ withWordmark = true }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        aria-hidden="true"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 font-bold text-white shadow-sm"
      >
        T
      </span>
      {withWordmark && (
        <span className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-white">
          Todo
        </span>
      )}
    </div>
  )
}

export default Logo
