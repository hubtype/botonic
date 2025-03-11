import React, { useContext, useEffect, useState } from 'react'

import { BotonicContainerId } from '../constants'
import { WebchatContext } from '../context'
import { HandoffInformationBanner } from '../handoff'
import { useWebchatDimensions } from '../hooks'
import { WebchatMessageList } from '../message-list'
import { WebchatReplies } from '../replies'
import { StyledChatArea } from './styles'

export const ChatArea = () => {
  const { webchatState, chatAreaRef } = useContext(WebchatContext)

  const { calculateResizedPxChatAreaHeight } = useWebchatDimensions()
  const [chatAreaHeight, setChatAreaHeight] = useState(0)

  useEffect(() => {
    setChatAreaHeight(calculateResizedPxChatAreaHeight())
  }, [])

  return (
    <StyledChatArea
      id={BotonicContainerId.ChatArea}
      ref={chatAreaRef}
      height={chatAreaHeight}
    >
      <WebchatMessageList />
      {webchatState.isWebchatOpen && webchatState.handoffState.isHandoff && (
        <HandoffInformationBanner />
      )}
      {webchatState.replies && webchatState.replies.length > 0 && (
        <WebchatReplies />
      )}
    </StyledChatArea>
  )
}
