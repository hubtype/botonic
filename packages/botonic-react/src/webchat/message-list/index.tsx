import React, { useContext, useEffect, useRef, useState } from 'react'

import { ROLES, WEBCHAT } from '../../constants'
import { WebchatContext } from '../../contexts'
import { scrollToBottom } from '../../util'
import { StyledScrollbar } from '../components/styled-scrollbar'
import { TypingIndicator } from '../components/typing-indicator'
import { IntroMessage } from './intro-message'
import { ScrollButton } from './scroll-button'
import { ContainerMessage } from './styles'
import { UnreadMessagesBanner } from './unread-messages-banner'

export const WebchatMessageList = props => {
  const {
    webchatState,
    getThemeProperty,
    resetUnreadMessages,
    setLastMessageVisible,
  } = useContext(WebchatContext)

  const scrollbarOptions = {
    ...{ enable: true, autoHide: true },
    ...getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.scrollbar),
  }

  const [firstUnreadMessageId, setFirstUnreadMessageId] = useState()

  const lastMessageRef = useRef<HTMLDivElement>(null)

  const handleScrollToBottom = () => {
    resetUnreadMessages()
    scrollToBottom({ host: props.host })
  }

  const showUnreadMessagesBanner = (messageComponentId: string) =>
    firstUnreadMessageId &&
    messageComponentId === firstUnreadMessageId &&
    webchatState.numUnreadMessages > 0

  const unreadMessagesBannerRef = useRef<HTMLDivElement>(null)

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
    if (webchatState.isLastMessageVisible && webchatState.typing) {
      scrollToBottom({ host: props.host })
    }
    if (webchatState.isLastMessageVisible) {
      scrollToBottom({ host: props.host })
    }
  }, [webchatState.typing, webchatState.isLastMessageVisible])

  useEffect(() => {
    if (firstUnreadMessageId) {
      if (unreadMessagesBannerRef.current) {
        unreadMessagesBannerRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
        return
      }
    } else if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      })
      return
    }
  }, [firstUnreadMessageId])

  const showScrollButton =
    webchatState.numUnreadMessages > 0 && !webchatState.isLastMessageVisible

  return (
    <>
      <StyledScrollbar
        role={ROLES.MESSAGE_LIST}
        // TODO: Distinguis between multiple instances of webchat, e.g. `${uniqueId}-botonic-scrollable`
        id='botonic-scrollable-content'
        // @ts-ignore
        scrollbar={scrollbarOptions}
        autoHide={scrollbarOptions.autoHide}
        ismessagescontainer={true.toString()}
        style={{
          ...props.style,
        }}
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

              {index === webchatState.messagesComponents.length - 1 && (
                <div ref={lastMessageRef} style={{ content: '' }}></div>
              )}
              {messageComponent}
            </ContainerMessage>
          )
        })}
        {webchatState.typing && <TypingIndicator />}
      </StyledScrollbar>
      {showScrollButton && <ScrollButton handleClick={handleScrollToBottom} />}
    </>
  )
}
