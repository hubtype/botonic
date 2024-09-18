import { useCallback, useContext, useEffect, useState } from 'react'

import { WebchatContext } from '../../contexts'
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
  const {
    webchatState: { isWebchatOpen },
    webchatRef,
    chatAreaRef,
    repliesRef,
    scrollableMessagesListRef,
  } = useContext(WebchatContext)

  const [chatAreaSizeChanged, setChatAreaSizeChanged] = useState(false)

  const hasScrollbar = useCallback(() => {
    if (chatAreaRef.current && scrollableMessagesListRef.current) {
      if (!repliesRef) {
        return (
          scrollableMessagesListRef.current?.scrollHeight >
          chatAreaRef.current?.clientHeight
        )
      }
      if (repliesRef.current) {
        return (
          scrollableMessagesListRef.current?.scrollHeight >
          chatAreaRef.current?.clientHeight - repliesRef.current?.clientHeight
        )
      }
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

  const toggleOnTouchMoveEvents = useCallback(() => {
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
  }, [])

  const handleOnTouchMoveEvents = useCallback(
    _e => {
      toggleOnTouchMoveEvents()
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
    webchatRef,
    currentDevice,
    handleOnTouchMoveEvents,
    handleOnMouseOverEvents,
    limitScrollBoundaries,
  ])

  useEffect(() => {
    const webchat = webchatRef.current

    handleScrollEvents()

    return () => {
      if (webchat) {
        webchat.onmouseover = null
        webchat.ontouchstart = null
        webchat.ontouchmove = null
      }
    }
  }, [
    currentDevice,
    host,
    handleScrollEvents,
    handleOnMouseOverEvents,
    handleOnTouchMoveEvents,
    limitScrollBoundaries,
  ])

  return {
    handleScrollEvents,
    handleOnTouchMoveEvents,
    handleOnMouseOverEvents,
    hasScrollbar,
  }
}
