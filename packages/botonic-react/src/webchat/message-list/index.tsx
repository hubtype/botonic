import { INPUT } from '@botonic/core'
import React, { useContext, useEffect, useRef, useState } from 'react'

import { ROLES } from '../../constants'
import { SENDERS } from '../../index-types'
import { WebchatContext } from '../../webchat/context'
import { BotonicContainerId } from '../constants'
import TypingIndicator from '../typing-indicator'
import { IntroMessage } from './intro-message'
import { ScrollButton } from './scroll-button'
import {
  ContainerMessage,
  ScrollableMessageList,
  SystemContainerMessage,
} from './styles'
import { UnreadMessagesBanner } from './unread-messages-banner'
import { useNotifications } from './use-notifications'
const SCROLL_TIMEOUT = 200
const scrollOptionsEnd: ScrollIntoViewOptions = {
  block: 'end',
}
const scrollOptionsCenter: ScrollIntoViewOptions = {
  block: 'center',
}

export const WebchatMessageList = () => {
  const {
    webchatState,
    resetUnreadMessages,
    setLastMessageVisible,
    scrollableMessagesListRef,
  } = useContext(WebchatContext)

  const { notificationsEnabled } = useNotifications()

  const [firstUnreadMessageId, setFirstUnreadMessageId] = useState<string>()

  const lastMessageRef = useRef<HTMLDivElement>(null)
  const typingRef = useRef<HTMLDivElement>(null)
  const unreadMessagesBannerRef = useRef<HTMLDivElement>(null)

  const scrollToTyping = () => {
    setTimeout(() => {
      typingRef.current?.scrollIntoView(scrollOptionsEnd)
    }, SCROLL_TIMEOUT)
  }

  const scrollToLastMessage = () => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView(scrollOptionsEnd)
    }, SCROLL_TIMEOUT)
  }

  const scrollToBanner = () => {
    setTimeout(() => {
      unreadMessagesBannerRef.current?.scrollIntoView(scrollOptionsCenter)
    }, SCROLL_TIMEOUT)
  }

  const handleScrollToBottom = () => {
    resetUnreadMessages()
    if (webchatState.typing) {
      scrollToTyping()
      return
    }

    scrollToLastMessage()
  }

  const showUnreadMessagesBanner = (messageComponentId: string) => {
    return (
      !webchatState.isInputFocused &&
      firstUnreadMessageId &&
      messageComponentId === firstUnreadMessageId &&
      webchatState.numUnreadMessages > 0
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isSystemMessage = (messageComponent: any) => {
    return (
      messageComponent.props?.sentBy === SENDERS.system ||
      messageComponent.props?.type === INPUT.SYSTEM_DEBUG_TRACE
    )
  }

  useEffect(() => {
    const firstUnreadMessage = webchatState.messagesComponents.find(
      message => message.props.isUnread
    )
    setFirstUnreadMessageId(firstUnreadMessage?.props?.id)
  }, [webchatState.messagesComponents])

  useEffect(() => {
    if (webchatState.messagesComponents.length > 0 && lastMessageRef.current) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          setLastMessageVisible(entry.isIntersecting)
        })
      })
      observer.observe(lastMessageRef.current)
    }
  }, [webchatState.messagesComponents])

  useEffect(() => {
    if (!notificationsEnabled) {
      if (webchatState.typing) {
        scrollToTyping()
        return
      }

      scrollToLastMessage()
    }
  }, [webchatState.typing, webchatState.messagesComponents])

  useEffect(() => {
    if (webchatState.isWebchatOpen && notificationsEnabled) {
      if (unreadMessagesBannerRef.current) {
        scrollToBanner()
        return
      }

      if (webchatState.typing) {
        scrollToTyping()
        return
      }

      scrollToLastMessage()
    }
  }, [
    firstUnreadMessageId,
    webchatState.isWebchatOpen,
    webchatState.typing,
    webchatState.messagesComponents,
  ])

  const showScrollButton =
    webchatState.numUnreadMessages > 0 && !webchatState.isLastMessageVisible

  return (
    <>
      <ScrollableMessageList
        id={BotonicContainerId.ScrollableMessagesList}
        ref={scrollableMessagesListRef}
        role={ROLES.MESSAGE_LIST}
      >
        <IntroMessage />
        {webchatState.messagesComponents.map((messageComponent, index) => {
          const messageId = messageComponent.props.id
          const isCurrentSystemMessage = isSystemMessage(messageComponent)
          const MessageContainer = isCurrentSystemMessage
            ? SystemContainerMessage
            : ContainerMessage

          return (
            <React.Fragment key={messageId}>
              <MessageContainer role={ROLES.MESSAGE}>
                {showUnreadMessagesBanner(messageId) && (
                  <UnreadMessagesBanner
                    unreadMessagesBannerRef={unreadMessagesBannerRef}
                  />
                )}
                {messageComponent}
              </MessageContainer>
              {index === webchatState.messagesComponents.length - 1 && (
                <div
                  ref={lastMessageRef}
                  style={{
                    content: '',
                  }}
                ></div>
              )}
            </React.Fragment>
          )
        })}
        {webchatState.typing && <TypingIndicator ref={typingRef} />}
      </ScrollableMessageList>
      {showScrollButton && <ScrollButton handleClick={handleScrollToBottom} />}
    </>
  )
}
