import { INPUT } from '@botonic/core'
import React from 'react'

import { truncateText } from '../util'
import { renderComponent } from '../util/react'
import { generateWebviewUrlWithParams } from '../util/webviews'
import { Message } from './message'
import {
  WHATSAPP_MAX_BODY_CHARS,
  WHATSAPP_MAX_BUTTON_CHARS,
  WHATSAPP_MAX_FOOTER_CHARS,
  WHATSAPP_MAX_HEADER_CHARS,
} from './multichannel/multichannel-utils'
import { whatsappMarkdown } from './multichannel/whatsapp/markdown'

export const WHATSAPP_MAX_BUTTON_LIST_CHARS = 24
export const WHATSAPP_MAX_BUTTON_LIST_DESCRIPTION_CHARS = 72
export const WHATSAPP_MAX_BUTTON_LIST_ID_CHARS = 200

export interface WhatsappCTAUrlButtonProps {
  header?: string
  body: string
  footer?: string
  displayText: string
  url?: string
  webview?: any
  params?: any
}

const serialize = _whatsappCTAUrlButtonProps => {
  // TODO: Implement to have data persistance in localStorage, not needed for this WhatsApp development
  return {}
}

export const WhatsappCTAUrlButton = (props: WhatsappCTAUrlButtonProps) => {
  if (!props.url && !props.webview) {
    console.error('You must provide at least a url or a webview')
  }
  const renderBrowser = () => {
    // Return a dummy message for browser
    const message = `${JSON.stringify(props)}`
    return (
      <Message
        json={serialize(message)}
        {...props}
        type={INPUT.WHATSAPP_CTA_URL_BUTTON}
      >
        {message}
      </Message>
    )
  }

  const renderNode = () => {
    const validatedProps = {
      ...props,
      header: props.header
        ? truncateText(props.header, WHATSAPP_MAX_HEADER_CHARS)
        : undefined,
      body: truncateText(whatsappMarkdown(props.body), WHATSAPP_MAX_BODY_CHARS),
      footer: props.footer
        ? truncateText(props.footer, WHATSAPP_MAX_FOOTER_CHARS)
        : undefined,
      displayText: truncateText(props.displayText, WHATSAPP_MAX_BUTTON_CHARS),
      url: props.webview
        ? generateWebviewUrlWithParams(props.webview, props.params)
        : props.url,
    }
    return (
      // @ts-ignore Property 'message' does not exist on type 'JSX.IntrinsicElements'.
      <message {...validatedProps} type={INPUT.WHATSAPP_CTA_URL_BUTTON} />
    )
  }

  return renderComponent({ renderBrowser, renderNode })
}
