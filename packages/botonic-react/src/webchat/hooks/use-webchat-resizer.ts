import { useContext } from 'react'

import { WebchatContext } from '../../contexts'
import { useScrollToBottom } from './use-scroll-to-bottom'

const calculateResizedPercentualWebchatHeight = webchatElement => {
  const webchatHeight = webchatElement.clientHeight || 0
  const keyboardOffset =
    (window.visualViewport && window.visualViewport.height) ||
    window.innerHeight
  let newWebchatPercentualHeight = keyboardOffset / webchatHeight
  newWebchatPercentualHeight =
    Math.round(newWebchatPercentualHeight * 100 * 100) / 100 // Two decimal places
  return newWebchatPercentualHeight
}

const calculateResizedPxChatAreaHeight = (
  webchatElement,
  headerElement,
  inputPanelElement
) => {
  return (
    webchatElement.clientHeight -
    headerElement.clientHeight -
    inputPanelElement.clientHeight
  )
}

export const useWebchatResizer = () => {
  const { webchatRef, chatAreaRef, inputPanelRef, headerRef } =
    useContext(WebchatContext)

  const handleKeyboardShown = () => {
    if (
      webchatRef.current &&
      chatAreaRef.current &&
      headerRef.current &&
      inputPanelRef.current
    ) {
      webchatRef.current.style.height = `${calculateResizedPercentualWebchatHeight(webchatRef.current)}%`
      chatAreaRef.current.style.height = `${calculateResizedPxChatAreaHeight(webchatRef.current, headerRef.current, inputPanelRef.current)}px`
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
      chatAreaRef.current.style.height = `${calculateResizedPxChatAreaHeight(webchatRef.current, headerRef.current, inputPanelRef.current)}px`
    }
  }

  return {
    handleKeyboardShown,
    handleKeyboardHidden,
  }
}
