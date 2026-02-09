import { useEffect } from 'react'

import { DEVICES } from '../devices'
import { useScrollToBottom } from './use-scroll-to-bottom'
import { useScrollbarController } from './use-scrollbar-controller'
import { useVirtualKeyboardDetection } from './use-virtual-keyboard-detection'
import { useWebchatResizer } from './use-webchat-resizer'

// To avoid type error using experimental new API supported by some browsers like Chrome but not in Safari
interface NavigatorWithUserAgentData extends Navigator {
  userAgentData?: {
    platform: string
  }
}

function getCurrentDevice() {
  const nav = navigator as NavigatorWithUserAgentData
  if (nav.userAgentData) {
    return nav.userAgentData.platform
  }
  return navigator.platform
}

export const useDeviceAdapter = (host, isWebchatOpen) => {
  const currentDevice = getCurrentDevice()

  const { scrollToBottom } = useScrollToBottom({ host })

  const { isVirtualKeyboardVisible } = useVirtualKeyboardDetection(
    window.innerHeight
  )

  const { handleKeyboardShown, handleKeyboardHidden } = useWebchatResizer()

  const { handleScrollEvents } = useScrollbarController(currentDevice, host)

  useEffect(() => {
    if (currentDevice !== DEVICES.MOBILE.IPHONE) {
      return
    }
    if (isVirtualKeyboardVisible) {
      handleKeyboardShown()
      scrollToBottom()
    } else {
      handleKeyboardHidden()
    }

    return
  }, [isVirtualKeyboardVisible])

  useEffect(() => {
    if (host && isWebchatOpen) {
      if (currentDevice !== DEVICES.MOBILE.IPHONE) {
        return
      }
      handleScrollEvents()
    }
  }, [host, isWebchatOpen, handleScrollEvents])

  return {
    currentDevice,
  }
}
