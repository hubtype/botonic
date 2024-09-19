import { useEffect, useState } from 'react'

export const useVirtualKeyboardDetection = originalHeight => {
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
    window.visualViewport &&
      window.visualViewport.addEventListener('resize', handleResize)

    return () => {
      window.visualViewport &&
        window.visualViewport.removeEventListener('resize', handleResize)
    }
  }, [originalHeight])

  return { isVirtualKeyboardVisible }
}
