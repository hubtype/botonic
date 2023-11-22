import { useEffect, useState } from 'react'

export function useDebounce(delay?: number) {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShow(true)
    }, delay || 500)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [])

  return show
}
