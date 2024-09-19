import { useEffect } from 'react'

import { DEVICES } from '../devices'
import { useScrollToBottom } from './use-scroll-to-bottom'
import { useScrollbarController } from './use-scrollbar-controller'
import { useVirtualKeyboardDetection } from './use-virtual-keyboard-detection'
import { useWebchatResizer } from './use-webchat-resizer'

function getCurrentDevice() {
  // @ts-ignore
  if (navigator.userAgentData) return navigator.userAgentData.platform
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
    if (currentDevice !== DEVICES.MOBILE.IPHONE) return
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
      if (currentDevice !== DEVICES.MOBILE.IPHONE) return
      handleScrollEvents()
    }
  }, [host, isWebchatOpen, handleScrollEvents])

  return {
    currentDevice,
  }
}
