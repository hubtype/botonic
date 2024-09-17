import { useCallback, useContext } from 'react'

import { WebchatContext } from '../../contexts'
import { scrollToBottom } from '../../util/dom'
import { DEVICES } from '../devices'

export const useWebchatResizer = (currentDevice, host) => {
  const { webchatRef, chatAreaRef, inputPanelRef, headerRef } =
    useContext(WebchatContext)

  const initialChatAreaHeight = chatAreaRef.current?.clientHeight

  const setChatAreaHeight = useCallback(
    newHeight => {
      if (chatAreaRef.current) {
        chatAreaRef.current.style.height = newHeight
      }
    },
    [chatAreaRef]
  )

  const setWebchatElementHeight = useCallback(
    newHeight => {
      if (webchatRef.current) {
        webchatRef.current.style.height = newHeight
      }
    },
    [webchatRef]
  )

  const onFocus = useCallback(
    onKeyboardShownFn => {
      if (currentDevice !== DEVICES.MOBILE.IPHONE) return

      const waitUntilKeyboardIsShown = 500

      const calculateNewWebchatElementHeight = () => {
        const webchatHeight = webchatRef.current?.clientHeight || 0
        const keyboardOffset =
          (window.visualViewport && window.visualViewport.height) ||
          window.innerHeight

        let newWebchatPercentualHeight = keyboardOffset / webchatHeight
        newWebchatPercentualHeight =
          Math.round(newWebchatPercentualHeight * 100 * 100) / 100 // Two decimal places
        return newWebchatPercentualHeight
      }

      setTimeout(() => {
        const newWebchatPercentualHeight = calculateNewWebchatElementHeight()
        setWebchatElementHeight(`${newWebchatPercentualHeight}%`)
        if (webchatRef.current && headerRef.current && inputPanelRef.current) {
          setChatAreaHeight(
            `${webchatRef.current.clientHeight - headerRef.current.clientHeight - inputPanelRef.current.clientHeight}px`
          )
        }
        scrollToBottom(host)
        onKeyboardShownFn()
      }, waitUntilKeyboardIsShown)
    },
    [
      currentDevice,
      host,
      setWebchatElementHeight,
      setChatAreaHeight,
      headerRef,
      inputPanelRef,
      webchatRef,
    ]
  )

  // Handle onBlur, typically when the keyboard is hidden on mobile devices
  const onBlur = useCallback(() => {
    if (currentDevice !== DEVICES.MOBILE.IPHONE) return
    setWebchatElementHeight('100%')
    setChatAreaHeight(`${initialChatAreaHeight}px`)
  }, [
    currentDevice,
    setWebchatElementHeight,
    setChatAreaHeight,
    initialChatAreaHeight,
  ])

  return {
    onFocus,
    onBlur,
  }
}
