import { isDev, Session as CoreSession, Session } from '@botonic/core'
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

export const WebviewContainer = ({
  localWebviews,
}: {
  localWebviews?: React.ComponentType[]
}) => {
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

  if (isDev(webchatState.session as Session)) {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const Webview =
      localWebviews?.find(webview => {
        if (typeof webchatState.webview === 'string') {
          return false
        }
        return webview.name === webchatState.webview?.name
      }) ?? (webchatState.webview as React.ComponentType)

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
            <StyledFrameAsDiv>
              <Webview />
            </StyledFrameAsDiv>
          </StyledWebviewContent>
        </StyledWebview>
      </WebviewRequestContext.Provider>
    )
  }

  const webviewUrl =
    webchatState.webview && typeof webchatState.webview === 'string'
      ? webchatState.webview
      : ''

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
          <StyledFrame src={webviewUrl as string} />
        </StyledWebviewContent>
      </StyledWebview>
    </WebviewRequestContext.Provider>
  )
}
