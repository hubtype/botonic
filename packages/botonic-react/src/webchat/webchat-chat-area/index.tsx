import React, { useContext, useEffect, useState } from 'react'

import { WebchatContext } from '../../contexts'
import { BotonicContainerId } from '../constants'
import { WebchatMessageList } from '../message-list'
import { WebchatReplies } from '../replies'
import { StyledWebchatChatChatArea } from './styles'

export const WebchatChatArea = () => {
  const { webchatState } = useContext(WebchatContext)

  const [chatAreaHeight, setChatAreaHeight] = useState(0)

  useEffect(() => {
    if (webchatState.isWebchatOpen) {
      const webchatHeight = document.getElementById(
        BotonicContainerId.Webchat
      )?.clientHeight

      const headerHeight = document.getElementById(
        BotonicContainerId.Header
      )?.clientHeight

      const inputPanelHeight = document.getElementById(
        BotonicContainerId.InputPanel
      )?.clientHeight

      if (webchatHeight && headerHeight && inputPanelHeight) {
        setChatAreaHeight(webchatHeight - headerHeight - inputPanelHeight)
      }
    }
  }, [webchatState.isWebchatOpen])

  return (
    <StyledWebchatChatChatArea
      id={BotonicContainerId.ChatArea}
      height={chatAreaHeight}
    >
      <WebchatMessageList />
      {webchatState.replies && Object.keys(webchatState.replies).length > 0 && (
        <WebchatReplies replies={webchatState.replies} />
      )}
    </StyledWebchatChatChatArea>
  )
}
