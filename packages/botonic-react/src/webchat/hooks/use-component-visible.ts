import { useEffect, useRef, useState } from 'react'

interface ComponentVisible {
  ref: React.RefObject<HTMLElement>
  isComponentVisible: boolean
  setIsComponentVisible: React.Dispatch<React.SetStateAction<boolean>>
}

export function useComponentVisible(
  initialIsVisible: boolean,
  onClickOutside: () => void
): ComponentVisible {
  const [isComponentVisible, setIsComponentVisible] = useState(initialIsVisible)
  const ref = useRef<HTMLElement>(null)
  const handleClickOutside = event => {
    const target = event.path ? event.path[0] : event.target
    if (ref.current && !ref.current.contains(target)) {
      setIsComponentVisible(false)
      onClickOutside()
    }
  }
  useEffect(() => {
    document.addEventListener('click', handleClickOutside, false)
    return () => {
      document.removeEventListener('click', handleClickOutside, false)
    }
  })
  return { ref, isComponentVisible, setIsComponentVisible }
}
