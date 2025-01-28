import { Session } from '@botonic/core'
import { FlowButton, FlowContent, FlowText } from '@botonic/plugin-flow-builder'
import { Button, Multichannel, Text } from '@botonic/react'
import pako from 'pako'
import React from 'react'

import { WEBVIEW_NAME_BY_URL } from '../constants'
import { BotRequest } from '../types'
import { getRequestData } from './actions'

export function renderFlowBuilderContents(
  contents: FlowContent[],
  request: BotRequest
): React.ReactNode {
  return (
    <Multichannel text={{ buttonsAsText: false }}>
      {contents.map(content => {
        if (content instanceof FlowText) {
          return renderContent(content, request)
        }
        return content.toBotonic(content.id, request)
      })}
    </Multichannel>
  )
}

function renderContent(content: FlowText, request: BotRequest): JSX.Element {
  return (
    <Text>
      {content.text}
      {renderButtons(content, request)}
    </Text>
  )
}

function renderButtons(
  content: FlowText,
  request: BotRequest
): React.ReactNode {
  return content.buttons.map((button: FlowButton, i: number) => {
    if (isWebviewButton(button)) {
      return (
        <Button
          url={getCompressedWebviewUrl(button.url as string, request)}
          key={i}
        >
          {button.text}
        </Button>
      )
    }
    return button.renderButton(i, content.buttonStyle)
  })
}

function getCompressedWebviewUrl(url: string, request: BotRequest): string {
  const { session } = getRequestData(request)

  const webviewSession = structuredClone(session)

  reduceSessionSizeBeforeWebview(webviewSession)

  compressSession(webviewSession)

  const urlParams =
    '?context=' + encodeURIComponent(JSON.stringify(webviewSession))

  return `${process.env.STATIC_URL}/${WEBVIEW_NAME_BY_URL[url]}${urlParams}`
}

function reduceSessionSizeBeforeWebview(session: Session): void {
  delete session._hubtype_case_contact_reasons
}

function compressSession(session: Session): void {
  session.user.extra_data = btoa(
    String.fromCharCode(...pako.gzip(JSON.stringify(session.user.extra_data)))
  )
}

function isWebviewButton(button: FlowButton): boolean {
  return !!button.url && Object.keys(WEBVIEW_NAME_BY_URL).includes(button.url)
}
