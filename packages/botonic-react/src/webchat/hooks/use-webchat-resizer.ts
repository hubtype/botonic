import { useContext } from 'react'

import { WebchatContext } from '../../webchat/context'
import { useWebchatDimensions } from './use-webchat-dimensions'

export const useWebchatResizer = () => {
  const { webchatContainerRef, chatAreaRef, inputPanelRef, headerRef } =
    useContext(WebchatContext)

  const {
    calculateResizedPercentualWebchatHeight,
    calculateResizedPxChatAreaHeight,
  } = useWebchatDimensions()

  const handleKeyboardShown = () => {
    if (
      webchatContainerRef.current &&
      chatAreaRef.current &&
      headerRef.current &&
      inputPanelRef.current
    ) {
      webchatContainerRef.current.style.height = `${calculateResizedPercentualWebchatHeight()}%`
      chatAreaRef.current.style.height = `${calculateResizedPxChatAreaHeight()}px`
    }
  }

  const handleKeyboardHidden = () => {
    if (
      webchatContainerRef.current &&
      chatAreaRef.current &&
      inputPanelRef.current &&
      headerRef.current
    ) {
      webchatContainerRef.current.style.height = '100%'
      chatAreaRef.current.style.height = `${calculateResizedPxChatAreaHeight()}px`
    }
  }

  return {
    handleKeyboardShown,
    handleKeyboardHidden,
  }
}
