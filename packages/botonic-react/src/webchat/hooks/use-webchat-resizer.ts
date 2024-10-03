import { useContext } from 'react'

import { WebchatContext } from '../../contexts'
import { useWebchatDimensions } from './use-webchat-dimensions'

export const useWebchatResizer = () => {
  const { webchatRef, chatAreaRef, inputPanelRef, headerRef } =
    useContext(WebchatContext)

  const {
    calculateResizedPercentualWebchatHeight,
    calculateResizedPxChatAreaHeight,
  } = useWebchatDimensions()

  const handleKeyboardShown = () => {
    if (
      webchatRef.current &&
      chatAreaRef.current &&
      headerRef.current &&
      inputPanelRef.current
    ) {
      webchatRef.current.style.height = `${calculateResizedPercentualWebchatHeight()}%`
      chatAreaRef.current.style.height = `${calculateResizedPxChatAreaHeight()}px`
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
      chatAreaRef.current.style.height = `${calculateResizedPxChatAreaHeight()}px`
    }
  }

  return {
    handleKeyboardShown,
    handleKeyboardHidden,
  }
}
