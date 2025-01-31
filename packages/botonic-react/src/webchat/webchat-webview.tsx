import { isMobile, Session as CoreSession } from '@botonic/core'
import React, { useContext } from 'react'

import { WEBCHAT } from '../constants'
import { CloseWebviewOptions, WebviewRequestContext } from '../contexts'
import { WebchatContext } from './context'
import { WebviewContainer } from './webview'

export const WebchatWebview = () => {
  const { closeWebview, getThemeProperty, webchatState } =
    useContext(WebchatContext)

  const webviewRequestContext = {
    closeWebview: async (options?: CloseWebviewOptions) =>
      await closeWebview(options),
    params: webchatState.webviewParams || ({} as Record<string, any>),
    session: webchatState.session || ({} as Partial<CoreSession>),
  }

  // TODO: Remove this code and use the theme from the context,
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

  return (
    <WebviewRequestContext.Provider value={webviewRequestContext}>
      <WebviewContainer
        style={{
          ...getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.webviewStyle),
          ...mobileStyle,
        }}
        webview={webchatState.webview}
      />
    </WebviewRequestContext.Provider>
  )
}
