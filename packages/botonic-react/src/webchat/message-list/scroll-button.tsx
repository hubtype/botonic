import React, { useContext, useEffect, useState } from 'react'

import ArrawScrollDown from '../../assets/arrow-scroll-down.svg'
import { WEBCHAT } from '../../constants'
import { WebchatContext } from '../../contexts'
import { resolveImage } from '../../util/environment'
import { ContainerScrollButton } from './styles'

interface ScrollButtonProps {
  handleClick: () => void
}

export const ScrollButton = ({
  handleClick,
}: ScrollButtonProps): JSX.Element => {
  const { getThemeProperty } = useContext(WebchatContext)

  const [show, setShow] = useState(false)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShow(true)
    }, 500)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [])

  const CustomScrollButton = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.scrollButtonCustom,
    undefined
  )

  const scrollButtonEnabled = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.scrollButtonEnabled,
    false
  )

  console.log('scrollButtonEnabled', scrollButtonEnabled)

  return (
    <>
      {show && scrollButtonEnabled ? (
        <>
          {CustomScrollButton ? (
            <CustomScrollButton />
          ) : (
            <ContainerScrollButton onClick={handleClick}>
              <img src={resolveImage(ArrawScrollDown)} />
            </ContainerScrollButton>
          )}
        </>
      ) : null}
    </>
  )
}
