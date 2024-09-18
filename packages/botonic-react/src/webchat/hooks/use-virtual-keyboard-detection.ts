import { useEffect, useState } from 'react'

export const useVirtualKeyboardDetection = originalHeight => {
  const [isVirtualKeyboardVisible, setIsVirtualKeyboardVisible] =
    useState(false)
  useEffect(() => {
    const handleResize = () => {
      if (visualViewport) {
        if (visualViewport.height < originalHeight) {
          setIsVirtualKeyboardVisible(true)
          return
        }
        setIsVirtualKeyboardVisible(false)
        return
      }
    }
    visualViewport && visualViewport.addEventListener('resize', handleResize)

    return () => {
      visualViewport &&
        visualViewport.removeEventListener('resize', handleResize)
    }
  }, [originalHeight])

  return { isVirtualKeyboardVisible }
}
