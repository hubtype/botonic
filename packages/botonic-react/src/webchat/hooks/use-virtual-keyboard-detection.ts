import { useEffect, useState } from 'react'

export const useVirtualKeyboardDetection = (originalHeight: number) => {
  const [isVirtualKeyboardVisible, setIsVirtualKeyboardVisible] =
    useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.visualViewport) {
        if (window.visualViewport.height < originalHeight) {
          setIsVirtualKeyboardVisible(true)
          return
        }
        setIsVirtualKeyboardVisible(false)
        return
      }
    }
    window.visualViewport?.addEventListener('resize', handleResize)

    return () => {
      window.visualViewport?.removeEventListener('resize', handleResize)
    }
  }, [originalHeight])

  return { isVirtualKeyboardVisible }
}
