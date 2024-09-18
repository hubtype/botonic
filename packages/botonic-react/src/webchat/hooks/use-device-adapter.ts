import { useEffect } from 'react'

import { DEVICES } from '../devices'
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

  const { isVirtualKeyboardVisible } = useVirtualKeyboardDetection(
    window.innerHeight
  )

  const { handleKeyboardShown, handleKeyboardHidden } = useWebchatResizer(host)

  const { handleOnTouchMoveEvents, handleScrollEvents } =
    useScrollbarController(currentDevice, host)

  useEffect(() => {
    if (currentDevice !== DEVICES.MOBILE.IPHONE) return
    if (isVirtualKeyboardVisible) {
      handleKeyboardShown()
      // handleOnTouchMoveEvents(() => {})
    } else {
      handleKeyboardHidden()
      // handleOnTouchMoveEvents(() => {})
    }
    return
  }, [isVirtualKeyboardVisible])

  useEffect(() => {
    if (host && isWebchatOpen) {
      handleScrollEvents()
    }
  }, [host, isWebchatOpen, handleScrollEvents])

  return {
    currentDevice,
  }
}
