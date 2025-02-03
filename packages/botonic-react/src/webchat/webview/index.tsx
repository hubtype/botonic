import { isMobile, Session as CoreSession } from '@botonic/core'
import React, { useContext, useEffect } from 'react'

import { ROLES, WEBCHAT } from '../../constants'
import { CloseWebviewOptions, WebviewRequestContext } from '../../contexts'
import { WebchatContext } from '../context'
import { WebviewHeader } from './header'
import {
  StyledFrame,
  StyledFrameAsDiv,
  StyledWebview,
  StyledWebviewContent,
} from './styles'

export const WebviewContainer = () => {
  const { closeWebview, getThemeProperty, webchatState } =
    useContext(WebchatContext)

  const webviewRequestContext = {
    closeWebview: async (options?: CloseWebviewOptions) =>
      await closeWebview(options),
    params: webchatState.webviewParams || ({} as Record<string, any>),
    session: webchatState.session || ({} as Partial<CoreSession>),
  }

  // TODO: Remove this code and use theme or webchatState.theme from the context,
  // this code is duplicated from webchat.tsx
  let mobileStyle = {}
  if (isMobile(getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.mobileBreakpoint))) {
    mobileStyle = getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.mobileStyle) || {
      width: '100%',
      height: '100%',
      right: 0,
      bottom: 0,
      borderRadius: 0,
    }
  }

  const Webview = webchatState.webview as string | React.ComponentType

  const close = async (e: any) => {
    if (e.data === 'botonicCloseWebview') {
      console.log('Received close message from webview')
      await closeWebview()
    }
  }

  useEffect(() => {
    window.addEventListener('message', close, false)

    return () => window.removeEventListener('message', close, false)
  }, [])

  const isProduction = typeof Webview === 'string'

  return (
    <StyledWebview
      role={ROLES.WEBVIEW}
      style={{
        ...getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.webviewStyle),
        ...mobileStyle,
      }}
    >
      <WebviewHeader />
      <StyledWebviewContent>
        {isProduction ? (
          <StyledFrame src={Webview} />
        ) : (
          <WebviewRequestContext.Provider value={webviewRequestContext}>
            <StyledFrameAsDiv>
              <Webview />
            </StyledFrameAsDiv>
          </WebviewRequestContext.Provider>
        )}
      </StyledWebviewContent>
    </StyledWebview>
  )
}
