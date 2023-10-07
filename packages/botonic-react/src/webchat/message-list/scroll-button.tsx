import React, { useContext, useEffect, useState } from 'react'

import ArrowScrollDown from '../../assets/arrow-scroll-down.svg'
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

  const CustomScrollButton = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.scrollButtonCustom,
    undefined
  )

  const scrollButtonEnabled = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.scrollButtonEnabled,
    false
  )

  return (
    scrollButtonEnabled && (
      <>
        {CustomScrollButton ? (
          <CustomScrollButton />
        ) : (
          <ContainerScrollButton onClick={handleClick}>
            <img src={resolveImage(ArrowScrollDown)} />
          </ContainerScrollButton>
        )}
      </>
    )
  )
}
