import { useContext } from 'react'

import { WebchatContext } from '../../contexts'
import { scrollToBottom } from '../../util/dom'

export const useWebchatResizer = host => {
  const { webchatRef, chatAreaRef, inputPanelRef, headerRef } =
    useContext(WebchatContext)

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
      scrollToBottom(host)
    }
  }

  const handleKeyboardHidden = () => {
    if (webchatRef.current && chatAreaRef.current) {
      webchatRef.current.style.height = '100%'
      chatAreaRef.current.style.height = '100%'
    }
  }

  return {
    handleKeyboardShown,
    handleKeyboardHidden,
  }
}
