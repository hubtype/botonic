import React, { useContext, useEffect, useRef, useState } from 'react'

import { ROLES } from '../../constants'
import { WebchatContext } from '../../contexts'
import { ScrollableContent } from '../components/scrollable-content'
import { BotonicContainerId } from '../constants'
import { TypingIndicator } from '../typing-indicator'
import { IntroMessage } from './intro-message'
import { ScrollButton } from './scroll-button'
import { ContainerMessage } from './styles'
import { UnreadMessagesBanner } from './unread-messages-banner'
import { useNotifications } from './use-notifications'

export const WebchatMessageList = () => {
  const { webchatState, resetUnreadMessages, setLastMessageVisible } =
    useContext(WebchatContext)

  const [firstUnreadMessageId, setFirstUnreadMessageId] = useState()

  const lastMessageBottomRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    setTimeout(() => {
      lastMessageBottomRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      })
    }, 100)
  }

  const handleScrollToBottom = () => {
    resetUnreadMessages()
    scrollToBottom()
  }

  const unreadMessagesBannerRef = useRef<HTMLDivElement>(null)

  const scrollToBanner = () => {
    setTimeout(() => {
      unreadMessagesBannerRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }, 100)
  }

  const showUnreadMessagesBanner = (messageComponentId: string) =>
    firstUnreadMessageId &&
    messageComponentId === firstUnreadMessageId &&
    webchatState.numUnreadMessages > 0

  useEffect(() => {
    const firstUnreadMessage = webchatState.messagesComponents.find(
      message => message.props.isUnread
    )
    setFirstUnreadMessageId(firstUnreadMessage?.props?.id)
  }, [webchatState.messagesComponents])

  useEffect(() => {
    if (
      webchatState.messagesComponents.length > 0 &&
      lastMessageBottomRef.current
    ) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          setLastMessageVisible(entry.isIntersecting)
        })
      })
      observer.observe(lastMessageBottomRef.current)
    }
  }, [webchatState.messagesComponents])

  const { notificationsEnabled } = useNotifications()

  useEffect(() => {
    if (!notificationsEnabled) {
      scrollToBottom()
      return
    }
  }, [webchatState.typing])

  useEffect(() => {
    if (notificationsEnabled) {
      if (webchatState.isWebchatOpen && unreadMessagesBannerRef.current) {
        scrollToBanner()
        return
      }

      scrollToBottom()
      return
    }
  }, [firstUnreadMessageId, webchatState.isWebchatOpen, webchatState.typing])

  const showScrollButton =
    webchatState.numUnreadMessages > 0 && !webchatState.isLastMessageVisible

  const [chatAreaHeight, setChatAreaHeight] = useState(0)
  useEffect(() => {
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
  }, [webchatState.isWebchatOpen])

  return (
    <div
      id={BotonicContainerId.ChatArea}
      style={{
        display: 'inherit',
        flexDirection: 'inherit',
        height: chatAreaHeight,
        width: 'inherit',
        overflow: 'inherit',
      }}
    >
      <ScrollableContent
        id={BotonicContainerId.ScrollableContent}
        role={ROLES.MESSAGE_LIST}
        // @ts-ignore
        ismessagescontainer={true.toString()}
        style={{ flex: 1 }}
      >
        <IntroMessage />
        {webchatState.messagesComponents.map((messageComponent, index) => {
          return (
            <ContainerMessage role={ROLES.MESSAGE} key={index}>
              {showUnreadMessagesBanner(messageComponent.props.id) && (
                <UnreadMessagesBanner
                  unreadMessagesBannerRef={unreadMessagesBannerRef}
                />
              )}
              {messageComponent}
              {index === webchatState.messagesComponents.length - 1 && (
                <div
                  ref={lastMessageBottomRef}
                  style={{
                    content: '',
                  }}
                ></div>
              )}
            </ContainerMessage>
          )
        })}
        {webchatState.typing && <TypingIndicator />}
      </ScrollableContent>
      {showScrollButton && <ScrollButton handleClick={handleScrollToBottom} />}
    </div>
  )
}
