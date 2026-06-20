import { useCallback, useState } from 'react'

export function useFocusMode() {
  const [isFocusMode, setIsFocusMode] = useState(false)

  const toggleFocusMode = useCallback(() => {
    setIsFocusMode((prev) => !prev)
  }, [])

  return { isFocusMode, toggleFocusMode }
}
