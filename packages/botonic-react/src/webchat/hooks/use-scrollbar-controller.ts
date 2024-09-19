import { useContext, useEffect } from 'react'

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

  const hasScrollbar = () => {
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
  }

  const toggleOnMouseWheelEvents = () => {
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
  }

  const handleOnMouseOverEvents = e => {
    let target = e.currentTarget
    while (target) {
      toggleOnMouseWheelEvents()
      target = target.parentNode
    }
  }

  const toggleOnTouchMoveEvents = () => {
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
  }

  const handleOnTouchMoveEvents = () => {
    toggleOnTouchMoveEvents()
  }

  const limitScrollBoundaries = () => {
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
  }

  const handleScrollEvents = () => {
    if (webchatRef.current) {
      if (isMobileDevice()) {
        if (currentDevice !== DEVICES.MOBILE.IPHONE) return

        limitScrollBoundaries()

        webchatRef.current.ontouchstart = handleOnTouchMoveEvents
        webchatRef.current.ontouchmove = handleOnTouchMoveEvents
      } else {
        webchatRef.current.onmouseover = e => handleOnMouseOverEvents(e)
      }
    }
  }

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
  }, [currentDevice, host])

  return {
    handleScrollEvents,
    handleOnTouchMoveEvents,
    handleOnMouseOverEvents,
    hasScrollbar,
  }
}
