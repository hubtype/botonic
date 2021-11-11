import React, { useEffect, useRef, useState } from 'react'

import { Backdrop } from './backdrop'
import {
  MODAL_ACTIVE_CLASSNAME,
  MODAL_CONTENT_CLASSNAME,
  MODAL_PORTAL_CLASS_NAME,
} from './constants'
import { Content } from './content'
import { Portal } from './portal'

const ESCAPE_KEY_CODE = 27

export function PortalModalComponent({ opened, onClose, locked, children }) {
  const [active, setActive] = useState(false)

  const backdrop = useRef(null)

  useEffect(() => {
    const { current } = backdrop
    const transitionEnd = () => setActive(opened)
    const keyHandler = e =>
      !locked && [ESCAPE_KEY_CODE].indexOf(e.which) >= 0 && onClose()
    const clickHandler = e => !locked && e.target === current && onClose()

    if (current) {
      current.addEventListener('transitionend', transitionEnd)
      current.addEventListener('click', clickHandler)
      window.addEventListener('keyup', keyHandler)
    }

    if (opened) {
      window.setTimeout(() => {
        document.activeElement.blur()
        setActive(opened)
      }, 10)
    }

    return () => {
      if (current) {
        current.removeEventListener('transitionend', transitionEnd)
        current.removeEventListener('click', clickHandler)
      }
      window.removeEventListener('keyup', keyHandler)
    }
  }, [opened, locked, onClose])

  return (
    (opened || active) && (
      <Portal className={MODAL_PORTAL_CLASS_NAME}>
        <Backdrop
          ref={backdrop}
          className={active && opened && MODAL_ACTIVE_CLASSNAME}
        >
          <Content className={MODAL_CONTENT_CLASSNAME}>{children}</Content>
        </Backdrop>
      </Portal>
    )
  )
}
