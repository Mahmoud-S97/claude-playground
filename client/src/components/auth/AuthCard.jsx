import { useState } from 'react'
import SignInForm from './SignInForm'
import SignUpForm from './SignUpForm'

const TABS = [
  { id: 'signin', label: 'Sign In' },
  { id: 'signup', label: 'Sign Up' },
]

function AuthCard() {
  const [activeTab, setActiveTab] = useState('signin')

  return (
    <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 shadow-xl shadow-neutral-200/50 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none">
      {/* Navbar-style segmented control for switching between forms */}
      <div role="tablist" aria-label="Authentication" className="relative mb-8 grid grid-cols-2 rounded-full bg-neutral-100 p-1 dark:bg-neutral-800">
        <span
          aria-hidden="true"
          className="absolute inset-y-1 left-1 z-0 w-[calc(50%-4px)] rounded-full bg-white shadow-sm transition-transform duration-300 ease-out dark:bg-neutral-700"
          style={{ transform: activeTab === 'signup' ? 'translateX(100%)' : 'translateX(0)' }}
        />
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative z-10 rounded-full py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-neutral-900 dark:text-white'
                : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div role="tabpanel">
        {activeTab === 'signin' ? (
          <SignInForm onSwitchToSignUp={() => setActiveTab('signup')} />
        ) : (
          <SignUpForm onSwitchToSignIn={() => setActiveTab('signin')} />
        )}
      </div>
    </div>
  )
}

export default AuthCard
