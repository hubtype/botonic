import { useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'

export const BOTONIC_PORTAL_CLASS_LIST_NAME = 'botonic-portal-container'

export function Portal({ children, parent, className }) {
  const element = useMemo(() => document.createElement('div'), [])

  useEffect(() => {
    const target = parent && parent.appendChild ? parent : document.body
    const classList = [BOTONIC_PORTAL_CLASS_LIST_NAME]

    if (className) className.split(' ').forEach(item => classList.push(item))
    classList.forEach(item => element.classList.add(item))
    target.appendChild(element)

    return () => target.removeChild(element)
  }, [element, parent, className])

  return createPortal(children, element)
}
