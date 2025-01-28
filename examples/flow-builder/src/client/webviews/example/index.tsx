import {
  FlowBuilderJSONVersion,
  useWebviewContents,
} from '@botonic/plugin-flow-builder'
import React from 'react'
import { Provider } from 'react-redux'

import { context } from '../../../server/domain/user-data'
import { BotSession } from '../../../server/types'
import { isLocal, isWhatsApp } from '../../../server/utils/env-utils'
import {
  FLOW_BUILDER_API_URL,
  MAP_CONTENTS,
  MyWebviewContentsContext,
  WEBVIEW_ID,
} from '../../constants'
import { isMobile } from '../utils'
import BackgroundImage from './desktopBackground.png'
import { ExampleApp } from './example-app'
import { useWebviewRequestContext } from './hooks/use-webview-request-context'
import { store } from './redux/store'
import { BackgroundDesktop } from './styles'

export function ExampleWebview(): React.ReactElement {
  const webviewRequestContext = useWebviewRequestContext()
  const session = webviewRequestContext.session
  const isWhatsAppDesktop = isWhatsApp(session) && !isMobile()

  const { isLoading, error, webviewContentsContext } = useWebviewContents({
    apiUrl: FLOW_BUILDER_API_URL,
    version: isLocal()
      ? FlowBuilderJSONVersion.DRAFT
      : FlowBuilderJSONVersion.LATEST,
    orgId: webviewRequestContext.session.organization_id,
    botId: webviewRequestContext.session.bot.id,
    webviewId: WEBVIEW_ID,
    locale: context(webviewRequestContext.session as BotSession).locale,
    mapContents: MAP_CONTENTS,
  })

  if (error) {
    return <div>Error Component</div>
  }

  return (
    <MyWebviewContentsContext.Provider value={webviewContentsContext}>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Provider store={store}>
          {isWhatsAppDesktop ? (
            <BackgroundDesktop>
              <ExampleApp isWhatsAppDesktop={isWhatsAppDesktop} />
              <img src={BackgroundImage} />
            </BackgroundDesktop>
          ) : (
            <ExampleApp isWhatsAppDesktop={isWhatsAppDesktop} />
          )}
        </Provider>
      )}
    </MyWebviewContentsContext.Provider>
  )
}
