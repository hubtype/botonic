import { useContext } from 'react'

import { WebchatContext } from '../../contexts'
import { useScrollToBottom } from './use-scroll-to-bottom'

export const useWebchatResizer = host => {
  const { webchatRef, chatAreaRef, inputPanelRef, headerRef } =
    useContext(WebchatContext)
  const { scrollToBottom } = useScrollToBottom({ host })

  const handleKeyboardShown = () => {
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

    if (
      webchatRef.current &&
      chatAreaRef.current &&
      headerRef.current &&
      inputPanelRef.current
    ) {
      const newWebchatPercentualHeight = `${calculateNewWebchatElementHeight()}%`
      webchatRef.current.style.height = newWebchatPercentualHeight

      const newChatAreaHeight = `${webchatRef.current.clientHeight - headerRef.current.clientHeight - inputPanelRef.current.clientHeight}px`

      chatAreaRef.current.style.height = newChatAreaHeight
      scrollToBottom()
    }
  }

  const handleKeyboardHidden = () => {
    if (
      webchatRef.current &&
      chatAreaRef.current &&
      inputPanelRef.current &&
      headerRef.current
    ) {
      webchatRef.current.style.height = '100%'
      chatAreaRef.current.style.height = `${webchatRef.current.clientHeight - headerRef.current.clientHeight - inputPanelRef.current.clientHeight}px`
    }
  }

  return {
    handleKeyboardShown,
    handleKeyboardHidden,
  }
}
