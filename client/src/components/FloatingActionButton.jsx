// Round primary button pinned to the bottom "end" corner (right in LTR,
// left in RTL). Pass the icon as children and a label for screen readers.
function FloatingActionButton({ label, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="fixed end-6 bottom-6 z-40 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-purple-600 text-white shadow-lg shadow-purple-600/30 transition duration-300 ease-out hover:scale-110 hover:bg-purple-700 hover:shadow-xl hover:shadow-purple-600/40 focus-visible:ring-4 focus-visible:ring-purple-500/40 focus-visible:outline-none active:scale-95 motion-reduce:transition-none motion-reduce:hover:scale-100"
    >
      {children}
    </button>
  )
}

export default FloatingActionButton
