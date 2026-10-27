import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import EyeIcon from '../icons/EyeIcon'
import EyeSlashIcon from '../icons/EyeSlashIcon'

function FormField({ id, label, type = 'text', autoComplete, maxLength, value, onChange }) {
  const { t } = useTranslation()
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword && isPasswordVisible ? 'text' : type
  const toggleLabel = t(isPasswordVisible ? 'auth.fields.hidePassword' : 'auth.fields.showPassword')

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={inputType}
          required
          autoComplete={autoComplete}
          maxLength={maxLength}
          value={value}
          onChange={onChange}
          className={`w-full rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-transparent focus:ring-2 focus:ring-purple-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-500 ${
            isPassword ? 'pe-11' : ''
          }`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setIsPasswordVisible((visible) => !visible)}
            aria-label={toggleLabel}
            aria-pressed={isPasswordVisible}
            aria-controls={id}
            title={toggleLabel}
            className="absolute inset-y-0 end-0 flex w-10 cursor-pointer items-center justify-center rounded-e-lg text-neutral-400 transition-colors hover:text-neutral-700 focus-visible:text-neutral-700 focus-visible:outline-none dark:text-neutral-500 dark:hover:text-neutral-200 dark:focus-visible:text-neutral-200"
          >
            {isPasswordVisible ? <EyeIcon className="h-5 w-5" /> : <EyeSlashIcon className="h-5 w-5" />}
          </button>
        )}
      </div>
    </div>
  )
}

export default FormField
