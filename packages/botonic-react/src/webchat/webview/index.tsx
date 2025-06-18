import { Session as CoreSession } from '@botonic/core'
import React, { useContext, useEffect } from 'react'

import { ROLES, WEBCHAT } from '../../constants'
import {
  CloseWebviewOptions,
  WebviewRequestContext,
  WebviewRequestContextType,
} from '../../contexts'
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

  const webviewRequestContext: WebviewRequestContextType = {
    params: webchatState.webviewParams || ({} as Record<string, string>),
    session: webchatState.session || ({} as Partial<CoreSession>),
    getUserCountry: () => webchatState.session?.user?.country || '',
    getUserLocale: () => webchatState.session?.user?.locale || '',
    getSystemLocale: () => webchatState.session?.user?.system_locale || '',
    closeWebview: async (options?: CloseWebviewOptions) =>
      await closeWebview(options),
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

  // TODO: Review how to split the logic of rendering a webview in local development and production
  // In local development, Webview is a component. In production it is the URL of the webview
  const isUrlToWebview = typeof Webview === 'string'

  return (
    <WebviewRequestContext.Provider value={webviewRequestContext}>
      <StyledWebview
        role={ROLES.WEBVIEW}
        style={{
          ...getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.webviewStyle),
        }}
      >
        <WebviewHeader />
        <StyledWebviewContent>
          {isUrlToWebview ? (
            <StyledFrame src={Webview} />
          ) : (
            <StyledFrameAsDiv>
              <Webview />
            </StyledFrameAsDiv>
          )}
        </StyledWebviewContent>
      </StyledWebview>
    </WebviewRequestContext.Provider>
  )
}
