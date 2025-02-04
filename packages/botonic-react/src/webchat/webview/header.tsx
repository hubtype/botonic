import React, { useContext } from 'react'

import { ROLES, WEBCHAT } from '../../constants'
import { WebviewRequestContext } from '../../contexts'
import { WebchatContext } from '../context'
import { StyledCloseHeader, StyledWebviewHeader } from './styles'

export const WebviewHeader = () => {
  const { closeWebview } = useContext(WebviewRequestContext)
  const { getThemeProperty } = useContext(WebchatContext)

  return (
    <StyledWebviewHeader
      role={ROLES.WEBVIEW_HEADER}
      style={{
        ...getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.webviewHeaderStyle),
      }}
    >
      <StyledCloseHeader onClick={() => closeWebview()}>✕</StyledCloseHeader>
    </StyledWebviewHeader>
  )
}
