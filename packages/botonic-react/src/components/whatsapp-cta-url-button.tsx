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

export enum WhatsappCTAUrlHeaderType {
  Document = 'document',
  Image = 'image',
  Text = 'text',
  Video = 'video',
}
export interface WhatsappCTAUrlHeaderTextProps {
  headerType: WhatsappCTAUrlHeaderType.Text
  header: string
}

export interface WhatsappCTAUrlHeaderImageProps {
  headerType: WhatsappCTAUrlHeaderType.Image
  headerImage: string
}

export interface WhatsappCTAUrlHeaderVideoProps {
  headerType: WhatsappCTAUrlHeaderType.Video
  headerVideo: string
}

export interface WhatsappCTAUrlHeaderDocumentProps {
  headerType: WhatsappCTAUrlHeaderType.Document
  headerDocument: string
}

export interface WhatsappCTAUrlNoHeaderProps {
  headerType?: undefined
}

export type WhatsappCTAUrlHeader =
  | WhatsappCTAUrlHeaderTextProps
  | WhatsappCTAUrlHeaderImageProps
  | WhatsappCTAUrlHeaderVideoProps
  | WhatsappCTAUrlHeaderDocumentProps
  | WhatsappCTAUrlNoHeaderProps

export type WhatsappCTAUrlButtonCommonProps = WhatsappCTAUrlHeader & {
  body: string
  footer?: string
  displayText: string
}

export type WhatsappCTAUrlButtonUrlProps = WhatsappCTAUrlButtonCommonProps & {
  url: string
}

export type WhatsappCTAUrlButtonWebviewProps =
  WhatsappCTAUrlButtonCommonProps & {
    webview: any
    params?: any
  }

export type WhatsappCTAUrlButtonProps =
  | WhatsappCTAUrlButtonUrlProps
  | WhatsappCTAUrlButtonWebviewProps

const serialize = _whatsappCTAUrlButtonProps => {
  // TODO: Implement to have data persistence in localStorage, not needed for this WhatsApp development
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
      headerType: props.headerType,
      header:
        props.headerType === WhatsappCTAUrlHeaderType.Text && props.header
          ? truncateText(props.header, WHATSAPP_MAX_HEADER_CHARS)
          : undefined,
      headerImage:
        props.headerType === WhatsappCTAUrlHeaderType.Image
          ? props.headerImage
          : undefined,
      headerVideo:
        props.headerType === WhatsappCTAUrlHeaderType.Video
          ? props.headerVideo
          : undefined,
      headerDocument:
        props.headerType === WhatsappCTAUrlHeaderType.Document
          ? props.headerDocument
          : undefined,
      body: truncateText(
        convertToMarkdownMeta(props.body),
        WHATSAPP_MAX_BODY_CHARS
      ),
      footer: props.footer
        ? truncateText(
            convertToMarkdownMeta(props.footer),
            WHATSAPP_MAX_FOOTER_CHARS
          )
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
