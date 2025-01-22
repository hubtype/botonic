import React, { ForwardedRef, forwardRef, useContext } from 'react'

import { WEBCHAT } from '../../constants'
import { WebchatContext } from '../../webchat/context'
import { BotonicContainerId } from '../constants'
import { DefaultHeader } from './default-header'
import { StyledWebchatHeader } from './styles'

export const WebchatHeader = forwardRef(
  (_, ref: ForwardedRef<HTMLDivElement>) => {
    const { getThemeProperty, toggleWebchat } = useContext(WebchatContext)

    const handleCloseWebchat = () => {
      toggleWebchat(false)
    }

    const CustomHeader = getThemeProperty(
      WEBCHAT.CUSTOM_PROPERTIES.customHeader
    )

    if (CustomHeader) {
      return (
        <div id={BotonicContainerId.Header} ref={ref}>
          <CustomHeader onCloseClick={handleCloseWebchat} />
        </div>
      )
    }

    return (
      <StyledWebchatHeader id={BotonicContainerId.Header} ref={ref}>
        <DefaultHeader />
      </StyledWebchatHeader>
    )
  }
)

WebchatHeader.displayName = 'WebchatHeader'
