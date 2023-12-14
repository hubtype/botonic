import React, { useContext } from 'react'

import ArrowScrollDown from '../../assets/arrow-scroll-down.svg'
import { WEBCHAT } from '../../constants'
import { WebchatContext } from '../../contexts'
import { resolveImage } from '../../util/environment'
import { ContainerScrollButton } from './styles'
import { useDebounce } from './use-debounce'

interface ScrollButtonProps {
  handleClick: () => void
}

export const ScrollButton = ({
  handleClick,
}: ScrollButtonProps): JSX.Element => {
  const { getThemeProperty } = useContext(WebchatContext)

  const show = useDebounce()

  const CustomScrollButton = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.scrollButtonCustom,
    undefined
  )

  const scrollButtonEnabled = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.scrollButtonEnabled,
    CustomScrollButton
  )

  return (
    <>
      {scrollButtonEnabled && show ? (
        <>
          {CustomScrollButton ? (
            <CustomScrollButton handleScrollToBottom={handleClick} />
          ) : (
            <ContainerScrollButton onClick={handleClick}>
              <img src={resolveImage(ArrowScrollDown)} />
            </ContainerScrollButton>
          )}
        </>
      ) : null}
    </>
  )
}
