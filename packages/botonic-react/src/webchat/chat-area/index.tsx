import React, { useContext, useEffect, useState } from 'react'

import { WebchatContext } from '../../contexts'
import { BotonicContainerId } from '../constants'
import { useWebchatDimensions } from '../hooks'
import { WebchatMessageList } from '../message-list'
import { WebchatReplies } from '../replies'
import { StyledChatArea } from './styles'

export const ChatArea = () => {
  const {
    webchatState: { replies },
    chatAreaRef,
  } = useContext(WebchatContext)

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
      {replies && Object.keys(replies).length > 0 && (
        <WebchatReplies replies={replies} />
      )}
    </StyledChatArea>
  )
}
