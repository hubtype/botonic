import React, { useContext, useEffect, useRef, useState } from 'react'

import { ROLES } from '../../constants'
import { WebchatContext } from '../../contexts'
import { BotonicContainerId } from '../constants'
import TypingIndicator from '../typing-indicator'
import { IntroMessage } from './intro-message'
import { ScrollButton } from './scroll-button'
import { ContainerMessage, ScrollableMessageList } from './styles'
import { UnreadMessagesBanner } from './unread-messages-banner'
import { useNotifications } from './use-notifications'

const SCROLL_TIMEOUT = 100

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
      typingRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      })
    }, SCROLL_TIMEOUT)
  }

  const scrollToLastMessage = () => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      })
    }, SCROLL_TIMEOUT)
  }

  const scrollToBanner = () => {
    setTimeout(() => {
      unreadMessagesBannerRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }, SCROLL_TIMEOUT)
  }

  const scrollToBottom = () => {
    setTimeout(() => {
      if (webchatState.isLastMessageVisible && webchatState.typing) {
        scrollToTyping()
        return
      }

      scrollToLastMessage()
    }, SCROLL_TIMEOUT)
  }

  const handleScrollToBottom = () => {
    resetUnreadMessages()
    scrollToBottom()
  }

  const showUnreadMessagesBanner = (messageComponentId: string) => {
    return (
      !webchatState.isInputFocus &&
      firstUnreadMessageId &&
      messageComponentId === firstUnreadMessageId &&
      webchatState.numUnreadMessages > 0
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
      scrollToBottom()
      return
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
      // Another option to do scroll to bottom of scrollableMessagesListRef without smoth effect
      //scrollableMessagesListRef.current?.scrollTo(0, scrollableMessagesListRef.current.scrollHeight)
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
          return (
            <>
              <ContainerMessage role={ROLES.MESSAGE} key={index}>
                {showUnreadMessagesBanner(messageComponent.props.id) && (
                  <UnreadMessagesBanner
                    unreadMessagesBannerRef={unreadMessagesBannerRef}
                  />
                )}
                {messageComponent}
              </ContainerMessage>
              {index === webchatState.messagesComponents.length - 1 && (
                <div
                  ref={lastMessageRef}
                  style={{
                    content: '',
                  }}
                ></div>
              )}
            </>
          )
        })}
        {webchatState.typing && <TypingIndicator ref={typingRef} />}
      </ScrollableMessageList>
      {showScrollButton && <ScrollButton handleClick={handleScrollToBottom} />}
    </>
  )
}
