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
} from './multichannel/whatsapp/constants'
import { convertToMarkdownMeta } from './multichannel/whatsapp/markdown-meta'

export interface WhatsappCTAUrlButtonCommonProps {
  header?: string
  body: string
  footer?: string
  displayText: string
}

export interface WhatsappCTAUrlButtonUrlProps
  extends WhatsappCTAUrlButtonCommonProps {
  url: string
}

export interface WhatsappCTAUrlButtonWebviewProps
  extends WhatsappCTAUrlButtonCommonProps {
  webview: any
  params?: any
}

export type WhatsappCTAUrlButtonProps =
  | WhatsappCTAUrlButtonUrlProps
  | WhatsappCTAUrlButtonWebviewProps

const serialize = _whatsappCTAUrlButtonProps => {
  // TODO: Implement to have data persistance in localStorage, not needed for this WhatsApp development
  return {}
}

export const WhatsappCTAUrlButton = (props: WhatsappCTAUrlButtonProps) => {
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
      body: truncateText(
        convertToMarkdownMeta(props.body),
        WHATSAPP_MAX_BODY_CHARS
      ),
      footer: props.footer
        ? truncateText(props.footer, WHATSAPP_MAX_FOOTER_CHARS)
        : undefined,
      displayText: truncateText(props.displayText, WHATSAPP_MAX_BUTTON_CHARS),
      url:
        'webview' in props
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
