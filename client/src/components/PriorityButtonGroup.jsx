import { useTranslation } from 'react-i18next'

const PRIORITY_OPTIONS = [
  { value: 'low', activeClass: 'bg-sky-500 text-white shadow-sm', idleClass: 'bg-sky-500/10 text-sky-600 hover:bg-sky-500/20 dark:text-sky-400' },
  { value: 'medium', activeClass: 'bg-amber-500 text-white shadow-sm', idleClass: 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 dark:text-amber-400' },
  { value: 'high', activeClass: 'bg-rose-500 text-white shadow-sm', idleClass: 'bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 dark:text-rose-400' },
]

function PriorityButtonGroup({ value, onChange }) {
  const { t } = useTranslation()

  return (
    <div className="flex gap-2">
      {PRIORITY_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors ${
            value === option.value ? option.activeClass : option.idleClass
          }`}
        >
          {t(`priority.${option.value}`)}
        </button>
      ))}
    </div>
  )
}

export default PriorityButtonGroup
