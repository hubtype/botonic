import React, { useEffect, useRef, useState } from 'react'

import { Backdrop } from './backdrop'
import {
  MODAL_ACTIVE_CLASSNAME,
  MODAL_CONTENT_CLASSNAME,
  MODAL_PORTAL_CLASS_NAME,
} from './constants'
import { ModalContent } from './content'
import { Portal } from './portal'

const ESCAPE_KEY_CODE = 27

export function PortalModalComponent({
  open,
  onClose,
  locked,
  children,
  customContent,
}) {
  const [active, setActive] = useState(false)

  const backdrop = useRef(null)

  useEffect(() => {
    const { current } = backdrop
    const transitionEnd = () => setActive(open)
    const keyHandler = e =>
      !locked && [ESCAPE_KEY_CODE].indexOf(e.which) >= 0 && onClose()
    const clickHandler = e => !locked && e.target === current && onClose()

    if (current) {
      current.addEventListener('transitionend', transitionEnd)
      current.addEventListener('click', clickHandler)
      window.addEventListener('keyup', keyHandler)
    }

    if (open) {
      window.setTimeout(() => {
        document.activeElement.blur()
        setActive(open)
      }, 10)
    }

    return () => {
      if (current) {
        current.removeEventListener('transitionend', transitionEnd)
        current.removeEventListener('click', clickHandler)
      }
      window.removeEventListener('keyup', keyHandler)
    }
  }, [open, locked, onClose])

  return (
    (open || active) && (
      <Portal className={MODAL_PORTAL_CLASS_NAME}>
        <Backdrop
          ref={backdrop}
          className={active && open && MODAL_ACTIVE_CLASSNAME}
        >
          {customContent ? (
            customContent
          ) : (
            <ModalContent className={MODAL_CONTENT_CLASSNAME}>
              {children}
            </ModalContent>
          )}
        </Backdrop>
      </Portal>
    )
  )
}
