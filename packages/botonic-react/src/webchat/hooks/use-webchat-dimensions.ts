import { useCallback, useContext } from 'react'

import { WebchatContext } from '../../webchat/context'

export const useWebchatDimensions = () => {
  const {
    webchatContainerRef,
    headerRef,
    inputPanelRef,
    webchatState: { isWebchatOpen },
  } = useContext(WebchatContext)

  const calculateResizedPercentualWebchatHeight = useCallback(() => {
    const webchatElement = webchatContainerRef.current
    if (!isWebchatOpen || !webchatElement) return 0
    const webchatHeight = webchatElement.clientHeight || 0
    const keyboardOffset =
      (window.visualViewport && window.visualViewport.height) ||
      window.innerHeight
    let newWebchatPercentualHeight = keyboardOffset / webchatHeight
    newWebchatPercentualHeight =
      Math.round(newWebchatPercentualHeight * 100 * 100) / 100 // Two decimal places
    return newWebchatPercentualHeight
  }, [isWebchatOpen])

  const calculateResizedPxChatAreaHeight = useCallback(() => {
    const webchatElement = webchatContainerRef.current
    const headerElement = headerRef.current
    const inputPanelElement = inputPanelRef.current

    if (!isWebchatOpen || !webchatElement) return 0

    const headerElementHeight = headerElement ? headerElement.clientHeight : 0
    const inputPanelElementHeight = inputPanelElement
      ? inputPanelElement.clientHeight
      : 0

    return (
      webchatElement.clientHeight -
      headerElementHeight -
      inputPanelElementHeight
    )
  }, [isWebchatOpen])

  return {
    calculateResizedPercentualWebchatHeight,
    calculateResizedPxChatAreaHeight,
  }
}
