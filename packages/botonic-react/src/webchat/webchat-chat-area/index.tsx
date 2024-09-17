import React, { useContext, useEffect, useState } from 'react'

import { WebchatContext } from '../../contexts'
import { BotonicContainerId } from '../constants'
import { WebchatMessageList } from '../message-list'
import { WebchatReplies } from '../replies'
import { StyledWebchatChatArea } from './styles'

export const WebchatChatArea = () => {
  const {
    webchatState: { isWebchatOpen, replies },
    webchatRef,
    headerRef,
    inputPanelRef,
    chatAreaRef,
  } = useContext(WebchatContext)

  const [chatAreaHeight, setChatAreaHeight] = useState(0)

  useEffect(() => {
    if (isWebchatOpen) {
      if (webchatRef.current && headerRef.current && inputPanelRef.current) {
        const newHeight =
          webchatRef.current.clientHeight -
          headerRef.current.clientHeight -
          inputPanelRef.current.clientHeight
        setChatAreaHeight(newHeight)
      }
    }
  }, [isWebchatOpen, webchatRef, headerRef, inputPanelRef])

  return (
    <StyledWebchatChatArea
      id={BotonicContainerId.ChatArea}
      ref={chatAreaRef}
      height={chatAreaHeight}
    >
      <WebchatMessageList />
      {replies && Object.keys(replies).length > 0 && (
        <WebchatReplies replies={replies} />
      )}
    </StyledWebchatChatArea>
  )
}
