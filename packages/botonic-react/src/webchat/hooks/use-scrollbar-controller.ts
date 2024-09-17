import { useCallback, useContext, useEffect, useRef, useState } from 'react'

import { WebchatContext } from '../../contexts'
import { getWebchatElement } from '../../util/dom'
import { BotonicContainerId } from '../constants'
import { DEVICES, isMobileDevice } from '../devices'

const debounced = (delay, fn) => {
  let timerId
  return function (...args) {
    if (timerId) {
      clearTimeout(timerId)
    }
    timerId = setTimeout(() => {
      fn(...args)
      timerId = null
    }, delay)
  }
}

const stopAtScrollLimit = element => {
  if (element.scrollTop === 0) element.scrollTop = 1
  if (element.scrollHeight - element.scrollTop === element.clientHeight)
    element.scrollTop -= 1
}

export const useScrollbarController = (currentDevice, host) => {
  const webchatRef = useRef<HTMLElement | null>(null)
  const chatAreaRef = useRef<HTMLElement | null>(null)
  const scrollableMessagesListRef = useRef<HTMLElement | null>(null)
  const repliesContainerRef = useRef<HTMLElement | null>(null)
  const {
    webchatState: { isWebchatOpen },
  } = useContext(WebchatContext)

  const [chatAreaSizeChanged, setChatAreaSizeChanged] = useState(false)

  const hasScrollbar = useCallback(() => {
    if (chatAreaRef.current && scrollableMessagesListRef.current) {
      if (repliesContainerRef.current) {
        return (
          scrollableMessagesListRef.current?.scrollHeight >
          chatAreaRef.current?.clientHeight -
            repliesContainerRef.current?.clientHeight
        )
      }
      return (
        scrollableMessagesListRef.current?.scrollHeight >
        chatAreaRef.current?.clientHeight
      )
    }
    return false
  }, [])

  const toggleOnMouseWheelEvents = useCallback(() => {
    if (scrollableMessagesListRef.current) {
      if (hasScrollbar()) {
        // @ts-ignore
        scrollableMessagesListRef.current.onmousewheel = {}
        return
      }
      // @ts-ignore
      scrollableMessagesListRef.current.onmousewheel = e => {
        e.preventDefault()
      }
    }
  }, [hasScrollbar])

  const handleOnMouseOverEvents = useCallback(
    e => {
      let target = e.currentTarget
      while (target) {
        toggleOnMouseWheelEvents()
        target = target.parentNode
      }
    },
    [toggleOnMouseWheelEvents]
  )

  const toggleOnTouchMoveEvents = useCallback(
    _e => {
      if (webchatRef.current && scrollableMessagesListRef.current) {
        if (hasScrollbar()) {
          scrollableMessagesListRef.current.style.touchAction = 'auto'
          webchatRef.current.style.touchAction = 'auto'
          webchatRef.current.ontouchmove = null
          webchatRef.current.ontouchstart = null
          return
        }

        scrollableMessagesListRef.current.style.touchAction = 'none'
        webchatRef.current.style.touchAction = 'none'
      }
      if (webchatRef.current) {
        webchatRef.current.ontouchstart = e => {
          if (e.target === e.currentTarget) {
            e.preventDefault()
          }
        }
        webchatRef.current.ontouchmove = e => {
          if (e.target === e.currentTarget) {
            e.preventDefault()
          }
        }
      }
    },
    [hasScrollbar]
  )

  const handleOnTouchMoveEvents = useCallback(
    e => {
      toggleOnTouchMoveEvents(e)
    },
    [toggleOnTouchMoveEvents]
  )

  const limitScrollBoundaries = useCallback(() => {
    if (currentDevice !== DEVICES.MOBILE.IPHONE) return
    const chatArea = chatAreaRef.current
    const dStopAtScrollLimit = debounced(100, stopAtScrollLimit)

    if (chatArea) {
      // @ts-ignore
      if (window.addEventListener) {
        chatArea.addEventListener(
          'scroll',
          () => dStopAtScrollLimit(chatArea),
          true
        )
        // @ts-ignore
      } else if (window.attachEvent) {
        // @ts-ignore
        chatAreaRef.attachEvent('scroll', () => dStopAtScrollLimit(chatArea))
      }
    }
  }, [currentDevice])
  const handleScrollEvents = useCallback(() => {
    if (webchatRef.current) {
      if (isMobileDevice()) {
        if (currentDevice !== DEVICES.MOBILE.IPHONE) return
        limitScrollBoundaries()

        webchatRef.current.ontouchstart = e => {
          handleOnTouchMoveEvents(e)
        }
        webchatRef.current.ontouchmove = e => {
          handleOnTouchMoveEvents(e)
        }
      } else {
        webchatRef.current.onmouseover = e => handleOnMouseOverEvents(e)
      }
    }
  }, [
    currentDevice,
    handleOnTouchMoveEvents,
    handleOnMouseOverEvents,
    limitScrollBoundaries,
  ])

  useEffect(() => {
    const webchat = getWebchatElement(host)
    webchatRef.current = webchat
    chatAreaRef.current = document.getElementById(BotonicContainerId.ChatArea)
    scrollableMessagesListRef.current = document.getElementById(
      BotonicContainerId.ScrollableMessagesList
    )
    repliesContainerRef.current = document.getElementById(
      BotonicContainerId.RepliesContainer
    )

    handleScrollEvents()

    return () => {
      webchat.onmouseover = null
      webchat.ontouchstart = null
      webchat.ontouchmove = null
    }
  }, [
    currentDevice,
    host,
    handleScrollEvents,
    handleOnMouseOverEvents,
    handleOnTouchMoveEvents,
    limitScrollBoundaries,
  ])

  useEffect(() => {
    console.log('chatAreaRef.current', chatAreaRef.current)
    if (isWebchatOpen && chatAreaRef.current) {
      const resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          if (entry.target === chatAreaRef.current) {
            setChatAreaSizeChanged(!chatAreaSizeChanged)
          }
        }
      })
      resizeObserver.observe(chatAreaRef.current)
    }
  }, [isWebchatOpen])

  return {
    handleScrollEvents,
    handleOnTouchMoveEvents,
    handleOnMouseOverEvents,
    webchatRef,
    hasScrollbar,
  }
}
