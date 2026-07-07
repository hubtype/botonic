import { type Session as CoreSession, isDev } from '@botonic/core'
import type React from 'react'
import { useContext, useEffect } from 'react'

import type { Webview } from '../../components/index-types'
import { ROLES, WEBCHAT } from '../../constants'
import {
  type CloseWebviewOptions,
  WebviewRequestContext,
  type WebviewRequestContextType,
} from '../../contexts'
import { WebchatContext, type WebchatState } from '../context'
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
    params: webchatState.webviewParams,
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

  if (isDev(webchatState.session as CoreSession)) {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const Webview = getWebviewInDevMode(localWebviews, webchatState)

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

function isReactComponent(value: unknown): value is React.ComponentType {
  return typeof value === 'function'
}

function isWebviewDescriptor(value: unknown): value is Webview {
  return (
    typeof value === 'object' &&
    value !== null &&
    'name' in value &&
    typeof (value as Webview).name === 'string' &&
    !isReactComponent(value)
  )
}

export function getWebviewInDevMode(
  localWebviews: React.ComponentType[] | undefined,
  webchatState: WebchatState
): React.ComponentType {
  const { webview } = webchatState

  if (webview == null) {
    throw new Error('No webview specified')
  }

  if (typeof webview === 'string') {
    return webview as unknown as React.ComponentType
  }

  if (isReactComponent(webview)) {
    return webview
  }

  if (isWebviewDescriptor(webview)) {
    const localWebview = localWebviews?.find(
      local => local.name === webview.name
    )

    if (!localWebview) {
      const registeredNames =
        localWebviews
          ?.map(w => w.name)
          .filter(Boolean)
          .join(', ') || 'none'
      throw new Error(
        `Local webview "${webview.name}" not found. Registered webviews: ${registeredNames}`
      )
    }

    return localWebview
  }

  throw new Error(
    'Invalid webview type: expected a React component, a webview descriptor { name }, or a string URL'
  )
}
