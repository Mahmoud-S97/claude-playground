import { useEffect, useState } from 'react'

// Reveals `text` one character at a time, like a terminal typing out a command.
export function useTypewriter(text, speedMs = 35) {
  const [output, setOutput] = useState('')

  useEffect(() => {
    let charCount = 0
    const intervalId = setInterval(() => {
      charCount += 1
      setOutput(text.slice(0, charCount))
      if (charCount >= text.length) clearInterval(intervalId)
    }, speedMs)

    return () => clearInterval(intervalId)
  }, [text, speedMs])

  return output
}
