import React from 'react'

export const useOnClickOutside = (
  dependency: boolean,
  id: string,
  onClickOutside: () => void,
  ref: React.RefObject<HTMLDivElement>
) => {
  const handleClickOutside = (event: any) => {
    if (
      !ref?.current?.contains(event.target as Node) &&
      !(event.target.id as string).startsWith(id)
    ) {
      onClickOutside()
    }
  }

  React.useEffect(() => {
    if (dependency) {
      document.addEventListener('mousedown', handleClickOutside)

      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
    return () => null
  }, [dependency])
}
