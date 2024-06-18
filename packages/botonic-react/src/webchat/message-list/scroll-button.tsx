import React, { useContext } from 'react'

import ArrowScrollDown from '../../assets/arrow-scroll-down.svg'
import { WEBCHAT } from '../../constants'
import { WebchatContext } from '../../contexts'
import { resolveImage } from '../../util/environment'
import { ContainerScrollButton } from './styles'
import { useDebounce } from './use-debounce'
import { useNotifications } from './use-notifications'

interface ScrollButtonProps {
  handleClick: () => void
}

export const ScrollButton = ({
  handleClick,
}: ScrollButtonProps): JSX.Element => {
  const { CustomScrollButton, scrollButtonEnabled } = useNotifications()

  const show = useDebounce()

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
