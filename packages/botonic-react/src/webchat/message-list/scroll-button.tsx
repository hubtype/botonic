import React, { useEffect, useState } from 'react'

import ArrawScrollDown from '../../assets/arrow-scroll-down.svg'
import { resolveImage } from '../../util/environment'
import { ContainerScrollButton } from './styles'

interface ScrollButtonProps {
  handleClick: () => void
}

export const ScrollButton = ({ handleClick }: ScrollButtonProps) => {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShow(true)
    }, 500)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [])

  return show ? (
    <ContainerScrollButton onClick={handleClick}>
      <img src={resolveImage(ArrawScrollDown)} />
    </ContainerScrollButton>
  ) : null
}
