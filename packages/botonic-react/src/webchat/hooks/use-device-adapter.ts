import { useCallback, useEffect, useRef, useState } from 'react'

import { DEVICES } from '../devices'
import { useScrollbarController } from './use-scrollbar-controller'
import { useWebchatResizer } from './use-webchat-resizer'

function getCurrentDevice() {
  // @ts-ignore
  if (navigator.userAgentData) return navigator.userAgentData.platform
  return navigator.platform
}

export const useDeviceAdapter = (host, isWebchatOpen) => {
  const currentDevice = getCurrentDevice()
  const webchatResizer = useWebchatResizer(currentDevice, host)
  const { handleOnTouchMoveEvents, handleScrollEvents } =
    useScrollbarController(currentDevice, host)

  const onFocus = useCallback(
    e => {
      setTimeout(() => {
        webchatResizer.onFocus(() => {
          handleOnTouchMoveEvents(e)
        })
      }, 0)
    },
    [handleOnTouchMoveEvents, webchatResizer]
  )

  const onBlur = useCallback(
    e => {
      if (currentDevice !== DEVICES.MOBILE.IPHONE) return
      webchatResizer.onBlur()
      handleOnTouchMoveEvents(e)
    },
    [currentDevice, webchatResizer, handleOnTouchMoveEvents]
  )

  useEffect(() => {
    if (host && isWebchatOpen) {
      handleScrollEvents()
    }
  }, [host, isWebchatOpen, handleScrollEvents])

  return {
    currentDevice,
    onFocus,
    onBlur,
  }
}
